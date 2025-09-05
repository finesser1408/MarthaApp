import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { isSmallScreen, screen } from '../utils/responsive';

const { width } = screen;

const relatedItems = [
  {
    id: '1',
    name: 'Organic Banana',
    price: 3.0,
    unit: 'kg',
    image: require('../assets/images/banana.jpg'),
    imageKey: 'banana',
    rating: 4.3,
  },
  {
    id: '2',
    name: 'Green Apple',
    price: 2.8,
    unit: 'kg',
    image: require('../assets/images/apple.jpg'),
    imageKey: 'apple',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Mango',
    price: 4.2,
    unit: 'kg',
    image: require('../assets/images/mango.jpg'),
    imageKey: 'mango',
    rating: 4.8,
  },
];

export default function ProductScreen() {
  const { product: productParam } = useLocalSearchParams<{ product?: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite: isFav, toggleFavorite } = useFavorites();

  const imageMap: Record<string, any> = {
    banana: require('../assets/images/banana.jpg'),
    orange: require('../assets/images/orange.jpg'),
    apple: require('../assets/images/apple.jpg'),
    strawberry: require('../assets/images/strawberry.jpg'),
    mango: require('../assets/images/mango.jpg'),
    eggs: require('../assets/images/eggs.jpg'),
    milk: require('../assets/images/milk.jpg'),
    spinach: require('../assets/images/spinach.jpg'),
    potatoes: require('../assets/images/potatoes.jpg'),
    almonds: require('../assets/images/almonds.jpg'),
    doritos: require('../assets/images/doritos.jpg'),
    milo: require('../assets/images/milo.jpg'),
    noodles: require('../assets/images/noodles.jpg'),
    cooking_oil: require('../assets/images/cooking oil.jpg'),
    bread: require('../assets/images/White Bread.jpg'),
    tomato_sauce: require('../assets/images/tomato sauce.jpg'),
  };

  const product = useMemo(() => {
    try {
      return productParam ? JSON.parse(productParam) : null;
    } catch (_) {
      return null;
    }
  }, [productParam]);

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}> 
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#2A4D50', fontSize: 16 }}>Product not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
            <Text style={{ color: '#4CAF50', fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, isSmallScreen && { paddingHorizontal: 16, paddingVertical: 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2A4D50" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => toggleFavorite(String(product.id))}
          accessibilityRole="button"
          accessibilityLabel={isFav(String(product.id)) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons name={isFav(String(product.id)) ? 'heart' : 'heart-outline'} size={24} color={isFav(String(product.id)) ? '#FF6B6B' : '#2A4D50'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={product.imageKey && imageMap[product.imageKey]
              ? imageMap[product.imageKey]
              : (typeof (product as any).image === 'number'
                  ? (product as any).image
                  : { uri: (product as any).image })}
            style={[
              styles.productImage,
              isSmallScreen && { height: 240 }
            ]}
          />
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#FFFFFF" />
            <Text style={styles.ratingText}>{product.rating || 4.5}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={[styles.productInfo, isSmallScreen && { paddingHorizontal: 16 }]}>
          <Text style={[styles.productName, isSmallScreen && { fontSize: 22, marginBottom: 6 }]}>{product.name}</Text>
          <Text style={[styles.productPrice, isSmallScreen && { fontSize: 20, marginBottom: 20 }]}>${Number(product.price).toFixed(2)}/{product.unit}</Text>

          {/* Quantity Selector */}
          <View style={[styles.quantitySection, isSmallScreen && { marginBottom: 20 }]}>
            <Text style={[styles.quantityLabel, isSmallScreen && { fontSize: 14 }]}>Quantity</Text>
            <View style={[styles.quantityContainer, isSmallScreen && { padding: 2 }] }>
              <TouchableOpacity style={[styles.quantityButton, isSmallScreen && { width: 32, height: 32, borderRadius: 16 }]} onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                <Ionicons name="remove" size={18} color="#4CAF50" />
              </TouchableOpacity>
              <Text style={[styles.quantityText, isSmallScreen && { fontSize: 16, marginHorizontal: 12 }]}>{quantity}</Text>
              <TouchableOpacity style={[styles.quantityButton, isSmallScreen && { width: 32, height: 32, borderRadius: 16 }]} onPress={() => setQuantity((prev) => prev + 1)}>
                <Ionicons name="add" size={18} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Details */}
          <View style={[styles.detailsSection, isSmallScreen && { marginBottom: 20 }]}>
            <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16, marginBottom: 12 }]}>Product Details</Text>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={18} color="#7C7C7C" />
              <Text style={[styles.detailText, isSmallScreen && { fontSize: 13 }]}>Delivery: 10-15 min</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="flame-outline" size={18} color="#7C7C7C" />
              <Text style={[styles.detailText, isSmallScreen && { fontSize: 13 }]}>Calories: 25 kcal/100g</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="leaf-outline" size={18} color="#7C7C7C" />
              <Text style={[styles.detailText, isSmallScreen && { fontSize: 13 }]}>Organic: Yes</Text>
            </View>
          </View>

          {/* Description */}
          <View style={[styles.descriptionSection, isSmallScreen && { marginBottom: 20 }]}>
            <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16, marginBottom: 12 }]}>Description</Text>
            <Text style={[styles.description, isSmallScreen && { fontSize: 13, lineHeight: 20 }]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>

          {/* Reviews */}
          <View style={[styles.reviewsSection, isSmallScreen && { marginBottom: 20 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16 }]}>Customer Reviews</Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/reviews', params: { productId: String(product.id), productName: product.name } })}
              >
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingOverview}>
              <Text style={[styles.overviewRating, isSmallScreen && { fontSize: 18 }]}>4.8</Text>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.overviewCount}>(567 reviews)</Text>
            </View>
          </View>

          {/* Related Items */}
          <View style={[styles.relatedSection, isSmallScreen && { marginBottom: 80 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16 }]}>You might also like</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedItemsContainer}>
              {relatedItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.relatedItem, isSmallScreen && { width: 140, padding: 10, marginRight: 12 }]}
                  onPress={() =>
                    router.replace({
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
                  <Image source={typeof item.image === 'number' ? item.image : { uri: item.image }} style={[styles.relatedItemImage, isSmallScreen && { height: 90 }]} />
                  <Text style={[styles.relatedItemName, isSmallScreen && { fontSize: 13 }]}>{item.name}</Text>
                  <View style={styles.relatedItemRating}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.relatedItemRatingText}>{item.rating}</Text>
                  </View>
                  <Text style={[styles.relatedItemPrice, isSmallScreen && { fontSize: 13 }]}>${item.price.toFixed(2)}/{item.unit}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Footer with Add to Cart */}
      <View style={[styles.footer, isSmallScreen && { padding: 16 }] }>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${(Number(product.price) * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addToCartButton, isSmallScreen && { paddingHorizontal: 20, paddingVertical: 14 }]}
          onPress={() => {
            addToCart(
              {
                id: String(product.id),
                name: product.name,
                price: Number(product.price),
                unit: product.unit,
                imageKey: (product as any).imageKey,
              },
              quantity
            );
            router.push('/cart');
          }}
        >
          <Ionicons name="cart" size={20} color="#FFFFFF" style={styles.cartIcon} />
          <Text style={[styles.addToCartText, isSmallScreen && { fontSize: 15 }]}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 16,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 36,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  productInfo: {
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A4D50',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A4D50',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#2A4D50',
    minWidth: 20,
    textAlign: 'center',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A4D50',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#7C7C7C',
    marginLeft: 12,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: '#7C7C7C',
    lineHeight: 22,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
  },
  overviewRating: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A4D50',
    marginRight: 8,
  },
  overviewCount: {
    fontSize: 14,
    color: '#7C7C7C',
    marginLeft: 8,
  },
  relatedSection: {
    marginBottom: 100,
  },
  relatedItemsContainer: {
    paddingVertical: 8,
  },
  relatedItem: {
    width: 150,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedItemImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 8,
  },
  relatedItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A4D50',
    marginBottom: 4,
  },
  relatedItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  relatedItemRatingText: {
    fontSize: 12,
    color: '#7C7C7C',
    marginLeft: 4,
  },
  relatedItemPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A4D50',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
