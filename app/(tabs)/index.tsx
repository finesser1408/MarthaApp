import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

const screenWidth = Dimensions.get('window').width;

const categories = [
  { id: '1', name: 'Fruit Food', icon: '🍎' },
  { id: '2', name: 'Vegetables', icon: '🥦' },
  { id: '3', name: 'Fruits', icon: '🍇', isActive: true },
  { id: '4', name: 'Dairy', icon: '🥛' },
  { id: '5', name: 'Bakery', icon: '🍞' },
  { id: '6', name: 'Meat', icon: '🍗' },
  { id: '7', name: 'Beverages', icon: '🥤' },
  { id: '8', name: 'Snacks', icon: '🍿' },
];

const fruits = [
  { 
    id: '1', 
    name: 'Banana', 
    price: 2.50, 
    unit: 'kg',
    image: require('../../assets/images/banana.jpg'),
    imageKey: 'banana',
    rating: 4.5
  },
  { 
    id: '2', 
    name: 'Fresh Orange', 
    price: 1.50, 
    unit: 'kg',
    image: require('../../assets/images/orange.jpg'),
    imageKey: 'orange',
    rating: 4.2
  },
  { 
    id: '3', 
    name: 'Apple', 
    price: 3.20, 
    unit: 'kg',
    image: require('../../assets/images/apple.jpg'),
    imageKey: 'apple',
    rating: 4.8
  },
  { 
    id: '4', 
    name: 'Strawberry', 
    price: 4.50, 
    unit: 'box',
    image: require('../../assets/images/strawberry.jpg'),
    imageKey: 'strawberry',
    rating: 4.7
  },
];

const promotions = [
  {
    id: '1',
    title: '35% OFF',
    subtitle: 'On your first order',
    image: require('../../assets/images/banner 1.jpg'),
    backgroundColor: '#E8F5E9',
  },
  {
    id: '2',
    title: 'Free Delivery',
    subtitle: 'On orders above $35',
    image: require('../../assets/images/banner 2.jpg'),
    backgroundColor: '#E3F2FD',
  },
  {
    id: '3',
    title: 'Buy 1 Get 1',
    subtitle: 'Selected fruits only',
    image: require('../../assets/images/banner 1.jpg'),
    backgroundColor: '#FFECB3',
  },
];

export default function HomeScreen() {
  const [activePromo, setActivePromo] = useState(0);
  const { addToCart, getCount } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with location, search and cart */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => router.push('/address' as Href)}
          accessibilityRole="button"
          accessibilityLabel="Edit delivery address"
        >
          <Ionicons name="location-outline" size={20} color="#4CAF50" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.deliveryText}>Delivery to</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {user?.homeAddress ? `Home • ${user.homeAddress}` : 'Home • Set your address'}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={16} color="#4CAF50" />
        </TouchableOpacity>
        

        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/cart' as Href)}
        >
          <Ionicons name="cart-outline" size={24} color="#4CAF50" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{getCount()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar - Dominant like Instacart */}
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => router.push('/search' as Href)}
      >
        <Ionicons name="search" size={20} color="#7C7C7C" />
        <Text style={styles.searchPlaceholder}>Search products or stores</Text>
      </TouchableOpacity>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section with Promotional Banners */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Fresh groceries, delivered fast</Text>
          <View style={styles.promoCarousel}>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const contentOffset = e.nativeEvent.contentOffset;
                const index = Math.round(contentOffset.x / (screenWidth - 40));
                setActivePromo(index);
              }}
              scrollEventThrottle={16}
            >
              {promotions.map((promo, index) => (
                <View 
                  key={promo.id} 
                  style={[
                    styles.promoCard, 
                    { backgroundColor: promo.backgroundColor }
                  ]}
                >
                  <View style={styles.promoContent}>
                    <Text style={styles.promoTitle}>{promo.title}</Text>
                    <Text style={styles.promoSubtitle}>{promo.subtitle}</Text>
                    <TouchableOpacity style={styles.promoButton}>
                      <Text style={styles.promoButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={promo.image as number}
                    style={styles.promoImage}
                    contentFit="contain"
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.promoIndicators}>
              {promotions.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.promoIndicator, 
                    index === activePromo && styles.promoIndicatorActive
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => router.push({ pathname: '/category', params: { categoryName: category.name } })}
              >
                <View style={[
                  styles.categoryIconContainer, 
                  category.isActive && styles.activeIconContainer
                ]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/category', params: { categoryName: 'Fruits' } })}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={fruits}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.productsList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.productCard}
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
                        imageKey: item.imageKey,
                      }),
                    },
                  })
                }
              >
                <View style={styles.productImageContainer}>
                  <Image
                    source={item.image as number}
                    style={styles.productImage}
                    contentFit="contain"
                  />
                  <TouchableOpacity 
                    style={styles.heartIcon}
                    onPress={() => toggleFavorite(String(item.id))}
                    accessibilityRole="button"
                    accessibilityLabel={isFavorite(String(item.id)) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Ionicons 
                      name={isFavorite(String(item.id)) ? 'heart' : 'heart-outline'} 
                      size={20} 
                      color="#FF6B6B" 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}/{item.unit}</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        imageKey: (item as any).imageKey,
                      }, 1)
                    }
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Weekly Deals Section */}
        <View style={styles.dealsSection}>
          <Image
            source={require('../../assets/images/banner 2.jpg')}
            style={styles.dealsImage}
            contentFit="cover"
          />
          <View style={styles.dealsContent}>
            <Text style={styles.dealsTitle}>Weekly Deals</Text>
            <Text style={styles.dealsSubtitle}>Save up to 50% on selected items</Text>
            <TouchableOpacity style={styles.dealsButton}>
              <Text style={styles.dealsButtonText}>View All Deals</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 30, // Added padding at bottom to prevent overlap
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  deliveryText: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A4D50',
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F7F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4CAF50',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#7C7C7C',
    fontSize: 16,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2A4D50',
    marginBottom: 16,
  },
  promoCarousel: {
    position: 'relative',
  },
  promoCard: {
    width: screenWidth - 40,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    minHeight: 160,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2A4D50',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 16,
  },
  promoButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  promoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  promoIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  promoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  promoIndicatorActive: {
    backgroundColor: '#4CAF50',
    width: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A4D50',
  },
  seeAll: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (screenWidth - 60) / 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F5FCF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeIconContainer: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#7C7C7C',
    fontWeight: '500',
  },
  productsList: {
    paddingVertical: 8,
  },
  productCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#FFF9E6',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#E65100',
    fontWeight: '600',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A4D50',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dealsSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealsImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  dealsContent: {
    padding: 16,
  },
  dealsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A4D50',
    marginBottom: 8,
  },
  dealsSubtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 16,
  },
  dealsButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  dealsButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});