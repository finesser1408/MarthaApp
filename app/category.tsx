import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { isSmallScreen, screen } from '../utils/responsive';
import { ALL_PRODUCTS } from '../constants/catalog';
import { useCart } from '../context/CartContext';

const { width } = screen;

const CATEGORY_ALIASES: Record<string, string> = {
  'Fruit Food': 'Fruits',
};

export default function CategoryScreen() {
  const { categoryName } = useLocalSearchParams<{ categoryName?: string }>();
  const router = useRouter();
  const { addToCart, getCount } = useCart();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = useMemo(() => (categoryName ? String(categoryName) : 'Fruits'), [categoryName]);
  const resolvedCategory = CATEGORY_ALIASES[currentCategory] ?? currentCategory;
  const products = useMemo(
    () => {
      const list = ALL_PRODUCTS.filter((p) => (p.category ?? 'Fruits') === resolvedCategory);
      return list.length > 0 ? list : ALL_PRODUCTS.filter((p) => (p.category ?? 'Fruits') === 'Fruits');
    },
    [resolvedCategory]
  );
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2A4D50" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isSmallScreen && { fontSize: 16 }]}>{currentCategory ?? 'Category'}</Text>
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter-outline" size={24} color="#2A4D50" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
            accessibilityRole="button"
            accessibilityLabel="Open cart"
          >
            <Ionicons name="cart-outline" size={22} color="#2A4D50" />
            {getCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isSmallScreen && { marginHorizontal: 12, paddingVertical: 10, paddingHorizontal: 12 }] }>
        <Ionicons name="search" size={isSmallScreen ? 18 : 20} color="#7C7C7C" style={styles.searchIcon} />
        <TextInput
          placeholder="Search products..."
          style={[styles.searchInput, isSmallScreen && { fontSize: 14 }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={isSmallScreen ? 18 : 20} color="#7C7C7C" />
          </TouchableOpacity>
        )}
      </View>

      {/* View Toggle and Results Count */}
      <View style={[styles.controlsContainer, isSmallScreen && { paddingHorizontal: 12, marginBottom: 12 }]}>
        <Text style={[styles.resultsText, isSmallScreen && { fontSize: 12 }]}>{filteredProducts.length} products found</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            onPress={() => setViewMode('grid')}
            style={[styles.toggleButton, viewMode === 'grid' && styles.activeToggle]}
          >
            <Ionicons name="grid" size={isSmallScreen ? 18 : 20} color={viewMode === 'grid' ? '#FFFFFF' : '#2A4D50'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
          >
            <Ionicons name="list" size={isSmallScreen ? 18 : 20} color={viewMode === 'list' ? '#FFFFFF' : '#2A4D50'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.categoryList, isSmallScreen && { paddingHorizontal: 12, paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              viewMode === 'grid' ? styles.gridView : styles.listView,
              isSmallScreen && (viewMode === 'grid'
                ? { padding: 10, margin: 6, maxWidth: (width - 40) / 2 }
                : { padding: 12, marginHorizontal: 6 })
            ]}
            onPress={() =>
              router.push({
                pathname: '/product',
                params: {
                  product: JSON.stringify({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    rating: item.rating,
                    imageKey: (item as any).imageKey,
                  }),
                },
              })
            }
          >
            <Image
              source={typeof item.image === 'number' ? item.image : { uri: item.image }}
              style={[
                styles.categoryItemImage,
                viewMode === 'grid' ? styles.gridImage : styles.listImage,
                isSmallScreen && (viewMode === 'grid' ? { height: 100, marginBottom: 10 } : { width: 90, height: 90, marginRight: 12 })
              ]}
            />

            <View style={[styles.itemInfo, viewMode === 'list' && styles.listItemInfo]}>
              <View>
                <Text style={[styles.categoryItemName, isSmallScreen && { fontSize: 14 }]}>{item.name}</Text>
                {viewMode === 'list' && (
                  <Text style={[styles.itemDescription, isSmallScreen && { fontSize: 12, lineHeight: 16 }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={isSmallScreen ? 12 : 14} color="#FFC107" />
                  <Text style={[styles.ratingText, isSmallScreen && { fontSize: 11 }]}>{item.rating}</Text>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={[styles.categoryItemPrice, isSmallScreen && { fontSize: 14 }]}>
                  ${item.price.toFixed(2)}/{item.unit}
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, isSmallScreen && { width: 28, height: 28, borderRadius: 14 }]}
                  onPress={() =>
                    addToCart(
                      {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        imageKey: (item as any).imageKey,
                        image: (item as any).image,
                      },
                      1
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${item.name} to cart`}
                >
                  <Ionicons name="add" size={isSmallScreen ? 18 : 20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A4D50',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4CAF50',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2A4D50',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#4CAF50',
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  gridView: {
    flex: 1,
    margin: 8,
    padding: 12,
    maxWidth: (width - 48) / 2,
  },
  listView: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 8,
  },
  categoryItemImage: {
    resizeMode: 'contain',
    borderRadius: 12,
  },
  gridImage: {
    width: '100%',
    height: 120,
    marginBottom: 12,
  },
  listImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  listItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A4D50',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#7C7C7C',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryItemPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
