import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { isSmallScreen, screen } from '../utils/responsive';
const { width } = screen;

// Local image resolver for items with imageKey
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
};

// Payment methods
const paymentMethods = [
  { id: '1', name: 'EcoCash', icon: 'phone-portrait-outline', selected: true, color: '#1E88E5' },
  { id: '2', name: 'InnBucks', icon: 'cash-outline', selected: false, color: '#2E7D32' },
  { id: '3', name: 'OMari', icon: 'wallet-outline', selected: false, color: '#8E24AA' },
];

// Delivery addresses
const deliveryAddresses = [
  {
    id: '1',
    name: 'Home',
    address: '3533 Tynwald North, Harare',
    selected: true,
  },
  {
    id: '2',
    name: 'Work',
    address: '638 ChurchHill Road, Harare',
    selected: false,
  },
];

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal } = useCart();
  const { logout } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods);
  const [addresses, setAddresses] = useState(deliveryAddresses);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const selectPaymentMethod = (id: string) => {
    setPaymentMethod(paymentMethods.map((method) => ({ ...method, selected: method.id === id })));
  };

  const selectAddress = (id: string) => {
    setAddresses(addresses.map((address) => ({ ...address, selected: address.id === id })));
  };

  const getSubtotalLocal = () => getSubtotal();

  const getDeliveryFee = () => 5.0; // Fixed delivery fee

  const getDiscount = () => (promoCode === 'FRUIT20' ? getSubtotalLocal() * 0.2 : 0);

  const getTotal = () => getSubtotalLocal() + getDeliveryFee() - getDiscount();

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image 
        source={
          (item as any).imageKey && imageMap[(item as any).imageKey]
            ? imageMap[(item as any).imageKey]
            : (typeof (item as any).image === 'number' 
                ? (item as any).image 
                : { uri: (item as any).image })
        } 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}/{item.unit}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <Ionicons name="remove" size={16} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <Ionicons name="add" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPaymentMethod = ({ item }: any) => (
    <TouchableOpacity style={[styles.paymentMethod, item.selected && styles.selectedPayment]} onPress={() => selectPaymentMethod(item.id)}>
      <View style={[styles.paymentIconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={20} color="#FFF" />
      </View>
      <Text style={[styles.paymentText, item.selected && styles.selectedPaymentText]}>{item.name}</Text>
      {item.selected && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />}
    </TouchableOpacity>
  );

  const renderAddress = ({ item }: any) => (
    <TouchableOpacity style={[styles.addressCard, item.selected && styles.selectedAddress]} onPress={() => selectAddress(item.id)}>
      <View style={styles.addressHeader}>
        <View style={[styles.addressIcon, item.selected && styles.selectedAddressIcon]}>
          <Ionicons name={item.name === 'Home' ? 'home-outline' : 'business-outline'} size={16} color={item.selected ? '#FFF' : '#4CAF50'} />
        </View>
        <Text style={styles.addressName}>{item.name}</Text>
      </View>
      <Text style={styles.addressText}>{item.address}</Text>
      {item.selected && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.addressCheckIcon} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAF8" />

      {/* Custom Header */}
      <View style={[styles.header, isSmallScreen && { paddingHorizontal: 16, paddingVertical: 12 }] }>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2A4D50" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isSmallScreen && { fontSize: 16 }]}>Shopping Cart</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={async () => {
            await logout();
            router.replace('/login');
          }}
          accessibilityLabel="Log out"
        >
          <Ionicons name="log-out-outline" size={20} color="#2A4D50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Cart Items Section */}
        <View style={[styles.section, isSmallScreen && { padding: 16 }] }>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16 }]}>Cart Items ({items.length})</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {items.length > 0 ? (
            <FlatList
              data={items}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyCart}>
              <View style={styles.emptyCartIcon}>
                <Ionicons name="cart-outline" size={64} color="#E0E0E0" />
              </View>
              <Text style={[styles.emptyCartText, isSmallScreen && { fontSize: 16 }]}>Your cart is empty</Text>
              <Text style={[styles.emptyCartSubtext, isSmallScreen && { fontSize: 13 }]}>Add items to get started</Text>
              <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)')}>
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Promo Code Section */}
        <View style={[styles.section, isSmallScreen && { padding: 16 }] }>
          <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16 }]}>Promo Code</Text>
          <View style={[styles.promoContainer, isSmallScreen && { gap: 8 }]}>
            <TextInput
              style={[styles.promoInput, isSmallScreen && { padding: 10, fontSize: 14, marginRight: 8 }]}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              placeholderTextColor="#9E9E9E"
              returnKeyType="done"
            />
            <TouchableOpacity style={[styles.applyButton, isSmallScreen && { paddingHorizontal: 14, paddingVertical: 10 }]}>
              <Text style={[styles.applyButtonText, isSmallScreen && { fontSize: 14 }]}>Apply</Text>
            </TouchableOpacity>
          </View>
          {promoCode === 'FRUIT20' && (
            <View style={styles.promoSuccess}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.promoSuccessText}>20% discount applied!</Text>
            </View>
          )}
        </View>

        {/* Delivery Address Section */}
        <View style={[styles.section, isSmallScreen && { padding: 16 }] }>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16 }]}>Delivery Address</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={addresses}
            renderItem={renderAddress}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.addressList, isSmallScreen && { paddingBottom: 4 }]}
          />
          <TouchableOpacity style={[styles.addAddressButton, isSmallScreen && { padding: 14, marginTop: 10 }]}>
            <Ionicons name="add" size={20} color="#4CAF50" />
            <Text style={styles.addAddressText}>Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Note Section */}
        <View style={[styles.section, isSmallScreen && { padding: 16 }] }>
          <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16 }]}>Delivery Note (Optional)</Text>
          <TextInput
            style={[styles.noteInput, isSmallScreen && { padding: 10, minHeight: 90, fontSize: 14 }]}
            placeholder="Add special instructions for delivery"
            value={deliveryNote}
            onChangeText={setDeliveryNote}
            multiline
            placeholderTextColor="#9E9E9E"
          />
        </View>

        {/* Payment Method Section */}
        <View style={[styles.section, isSmallScreen && { padding: 16 }] }>
          <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16 }]}>Payment Method</Text>
          <FlatList
            data={paymentMethod}
            renderItem={renderPaymentMethod}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.paymentSeparator} />}
          />
        </View>

        {/* Order Summary Section */}
        <View style={[styles.summarySection, isSmallScreen && { padding: 16 }]}>
          <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 16 }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryText, isSmallScreen && { fontSize: 14 }]}>Subtotal</Text>
            <Text style={[styles.summaryText, isSmallScreen && { fontSize: 14 }]}>${getSubtotal().toFixed(2)}</Text>
          </View>

          {getDiscount() > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.discountText}>Discount</Text>
              <Text style={styles.discountText}>-${getDiscount().toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryText, isSmallScreen && { fontSize: 14 }]}>Delivery Fee</Text>
            <Text style={[styles.summaryText, isSmallScreen && { fontSize: 14 }]}>${getDeliveryFee().toFixed(2)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, isSmallScreen && { fontSize: 16 }]}>Total</Text>
            <Text style={[styles.totalPrice, isSmallScreen && { fontSize: 18 }]}>${getTotal().toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      {items.length > 0 && (
        <View style={[styles.footer, isSmallScreen && { padding: 16 }] }>
          <View style={styles.footerContent}>
            <View style={styles.totalContainer}>
              <Text style={[styles.footerLabel, isSmallScreen && { fontSize: 12 }]}>Total Amount</Text>
              <Text style={[styles.footerTotalText, isSmallScreen && { fontSize: 18 }]}>${getTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={[styles.checkoutButton, isSmallScreen && { paddingHorizontal: 16, paddingVertical: 12 }]} onPress={() => router.push('/checkout')}>
              <Text style={[styles.checkoutButtonText, isSmallScreen && { fontSize: 15 }]}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.checkoutIcon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A4D50',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    backgroundColor: '#FFF',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summarySection: {
    padding: 20,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A4D50',
  },
  editText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  separator: {
    height: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A4D50',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#2A4D50',
  },
  itemTotal: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A4D50',
  },
  removeButton: {
    padding: 4,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyCartIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2A4D50',
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  shopButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  promoSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  promoSuccessText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontWeight: '500',
  },
  addressList: {
    paddingBottom: 8,
  },
  addressCard: {
    width: width - 80,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedAddress: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedAddressIcon: {
    backgroundColor: '#4CAF50',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A4D50',
  },
  addressText: {
    fontSize: 14,
    color: '#7C7C7C',
    lineHeight: 20,
  },
  addressCheckIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 16,
    marginTop: 12,
  },
  addAddressText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPayment: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    color: '#2A4D50',
  },
  selectedPaymentText: {
    color: '#2A4D50',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  paymentSeparator: {
    height: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  discountText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2A4D50',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 4,
  },
  footerTotalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A4D50',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  checkoutIcon: {
    marginLeft: 4,
  },
});
