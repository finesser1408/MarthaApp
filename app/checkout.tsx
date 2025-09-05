import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Modal, TextInput, Platform, ToastAndroid, Alert } from 'react-native';
import { isSmallScreen } from '../utils/responsive';

export default function CheckoutScreen() {
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ecocash' | 'innbucks' | 'omari'>('ecocash');
  const [ecoModal, setEcoModal] = useState(false);
  const [ecoStep, setEcoStep] = useState<'phone' | 'pin' | 'success'>('phone');
  const [ecoRecipient, setEcoRecipient] = useState('');
  const [ecoSender, setEcoSender] = useState('');
  const [ecoPin, setEcoPin] = useState('');
  const [ecoError, setEcoError] = useState('');
  const [ecoLoading, setEcoLoading] = useState(false);
  const [innModal, setInnModal] = useState(false);
  const [innStep, setInnStep] = useState<'phone' | 'pin' | 'success'>('phone');
  const [innRecipient, setInnRecipient] = useState('');
  const [innSender, setInnSender] = useState('');
  const [innPin, setInnPin] = useState('');
  const [innError, setInnError] = useState('');
  const [innLoading, setInnLoading] = useState(false);
  const [omModal, setOmModal] = useState(false);
  const [omStep, setOmStep] = useState<'phone' | 'pin' | 'success'>('phone');
  const [omRecipient, setOmRecipient] = useState('');
  const [omSender, setOmSender] = useState('');
  const [omPin, setOmPin] = useState('');
  const [omError, setOmError] = useState('');
  const [omLoading, setOmLoading] = useState(false);

  const subtotal = 18.7; // mock
  const delivery = 5.0;
  const discount = 0;
  const total = subtotal + delivery - discount;

  const handlePlaceOrder = async () => {
    if (placing) return;
    setPlacing(true);
    // Simulate processing
    setTimeout(() => {
      setPlacing(false);
      router.replace('/(tabs)');
    }, 1200);
  };

  const showPaymentSuccessToast = (label: string) => {
    const message = `Success: $${total.toFixed(2)} sent to AfroStore Grocery store via ${label}`;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('Payment Successful', message);
    }
  };

  const handleSelectEcocash = () => {
    setPaymentMethod('ecocash');
    setEcoRecipient('');
    setEcoSender('');
    setEcoPin('');
    setEcoError('');
    setEcoStep('phone');
    setEcoModal(true);
  };

  const submitEcoPhone = () => {
    const r = ecoRecipient.replace(/\D/g, '');
    const s = ecoSender.replace(/\D/g, '');
    if (r.length !== 10 || s.length !== 10) {
      setEcoError('Both recipient and sender numbers must be 10 digits.');
      return;
    }
    setEcoError('');
    setEcoStep('pin');
  };

  const submitEcoPin = () => {
    const pinOnly = ecoPin.replace(/\D/g, '');
    if (!pinOnly || pinOnly.length < 4) {
      setEcoError('PIN must be at least 4 digits.');
      return;
    }
    setEcoError('');
    setEcoLoading(true);
    // Simulate EcoCash transaction
    setTimeout(() => {
      setEcoLoading(false);
      setEcoStep('success');
    }, 1000);
  };

  const closeEcoSuccess = () => {
    setEcoModal(false);
    showPaymentSuccessToast('EcoCash');
    // Proceed to finalize order
    handlePlaceOrder();
  };

  // InnBucks flow
  const handleSelectInnbucks = () => {
    setPaymentMethod('innbucks');
    setInnRecipient('');
    setInnSender('');
    setInnPin('');
    setInnError('');
    setInnStep('phone');
    setInnModal(true);
  };

  const submitInnPhone = () => {
    const r = innRecipient.replace(/\D/g, '');
    const s = innSender.replace(/\D/g, '');
    if (r.length !== 10 || s.length !== 10) {
      setInnError('Both recipient and sender numbers must be 10 digits.');
      return;
    }
    setInnError('');
    setInnStep('pin');
  };

  const submitInnPin = () => {
    const pinOnly = innPin.replace(/\D/g, '');
    if (!pinOnly || pinOnly.length < 4) {
      setInnError('PIN must be at least 4 digits.');
      return;
    }
    setInnError('');
    setInnLoading(true);
    setTimeout(() => {
      setInnLoading(false);
      setInnStep('success');
    }, 1000);
  };

  const closeInnSuccess = () => {
    setInnModal(false);
    showPaymentSuccessToast('InnBucks');
    handlePlaceOrder();
  };

  // OMari flow
  const handleSelectOmari = () => {
    setPaymentMethod('omari');
    setOmRecipient('');
    setOmSender('');
    setOmPin('');
    setOmError('');
    setOmStep('phone');
    setOmModal(true);
  };

  const submitOmPhone = () => {
    const r = omRecipient.replace(/\D/g, '');
    const s = omSender.replace(/\D/g, '');
    if (r.length !== 10 || s.length !== 10) {
      setOmError('Both recipient and sender numbers must be 10 digits.');
      return;
    }
    setOmError('');
    setOmStep('pin');
  };

  const submitOmPin = () => {
    const pinOnly = omPin.replace(/\D/g, '');
    if (!pinOnly || pinOnly.length < 4) {
      setOmError('PIN must be at least 4 digits.');
      return;
    }
    setOmError('');
    setOmLoading(true);
    setTimeout(() => {
      setOmLoading(false);
      setOmStep('success');
    }, 1000);
  };

  const closeOmSuccess = () => {
    setOmModal(false);
    showPaymentSuccessToast('OMari');
    handlePlaceOrder();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isSmallScreen && { paddingHorizontal: 16, paddingVertical: 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2A4D50" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isSmallScreen && { fontSize: 16 }]}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, isSmallScreen && { padding: 16, paddingBottom: 110 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Delivery Address */}
        <View style={[styles.card, isSmallScreen && { padding: 14, marginBottom: 10 }]}>
          <View style={[styles.cardHeader, isSmallScreen && { marginBottom: 10 }]}>
            <Text style={[styles.cardTitle, isSmallScreen && { fontSize: 15 }]}>Delivery Address</Text>
            <TouchableOpacity>
              <Text style={styles.edit}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.iconChip}>
              <Ionicons name="home-outline" size={isSmallScreen ? 16 : 18} color="#4CAF50" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.primary, isSmallScreen && { fontSize: 14 }]}>Home</Text>
              <Text style={[styles.secondary, isSmallScreen && { fontSize: 13 }]}>3533 Tynwald North, Harare</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={[styles.card, isSmallScreen && { padding: 14, marginBottom: 10 }]}>
          <View style={[styles.cardHeader, isSmallScreen && { marginBottom: 10 }]}>
            <Text style={[styles.cardTitle, isSmallScreen && { fontSize: 15 }]}>Payment Method</Text>
            <TouchableOpacity>
              <Text style={styles.edit}>Change</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSelectEcocash}
            activeOpacity={0.8}
            style={[styles.row, styles.payRow, isSmallScreen && { padding: 10 }, paymentMethod === 'ecocash' && styles.payRowSelected]}
          >
            <Image source={require('../assets/images/ecocash.jpg')} style={styles.payLogo} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.primary, isSmallScreen && { fontSize: 14 }]}>EcoCash</Text>
              <Text style={[styles.secondary, isSmallScreen && { fontSize: 13 }]}>Mobile wallet</Text>
            </View>
            <Ionicons
              name={paymentMethod === 'ecocash' ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={paymentMethod === 'ecocash' ? '#4CAF50' : '#B0B0B0'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSelectInnbucks}
            activeOpacity={0.8}
            style={[styles.row, styles.payRow, { marginTop: 10 }, isSmallScreen && { padding: 10 }, paymentMethod === 'innbucks' && styles.payRowSelected]}
          >
            <Image source={require('../assets/images/innbucks.webp')} style={styles.payLogo} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.primary, isSmallScreen && { fontSize: 14 }]}>InnBucks</Text>
              <Text style={[styles.secondary, isSmallScreen && { fontSize: 13 }]}>Wallet</Text>
            </View>
            <Ionicons
              name={paymentMethod === 'innbucks' ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={paymentMethod === 'innbucks' ? '#4CAF50' : '#B0B0B0'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSelectOmari}
            activeOpacity={0.8}
            style={[styles.row, styles.payRow, { marginTop: 10 }, isSmallScreen && { padding: 10 }, paymentMethod === 'omari' && styles.payRowSelected]}
          >
            <Image source={require('../assets/images/OMari.webp')} style={styles.payLogo} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.primary, isSmallScreen && { fontSize: 14 }]}>OMari</Text>
              <Text style={[styles.secondary, isSmallScreen && { fontSize: 13 }]}>Wallet</Text>
            </View>
            <Ionicons
              name={paymentMethod === 'omari' ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={paymentMethod === 'omari' ? '#4CAF50' : '#B0B0B0'}
            />
          </TouchableOpacity>
        </View>

        {/* Delivery Time */}
        <View style={[styles.card, isSmallScreen && { padding: 14, marginBottom: 10 }]}>
          <View style={[styles.cardHeader, isSmallScreen && { marginBottom: 10 }]}>
            <Text style={[styles.cardTitle, isSmallScreen && { fontSize: 15 }]}>Delivery Time</Text>
            <TouchableOpacity>
              <Text style={styles.edit}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.iconChip}>
              <Ionicons name="time-outline" size={isSmallScreen ? 16 : 18} color="#4CAF50" />
            </View>
            <Text style={[styles.primary, isSmallScreen && { fontSize: 14 }]}>Today, 10-15 min</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={[styles.card, isSmallScreen && { padding: 14, marginBottom: 80 }]}>
          <Text style={[styles.cardTitle, isSmallScreen && { fontSize: 15 }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.secondary, isSmallScreen && { fontSize: 13 }]}>Subtotal</Text>
            <Text style={[styles.secondary, isSmallScreen && { fontSize: 13 }]}>${subtotal.toFixed(2)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.secondary, { color: '#4CAF50' }, isSmallScreen && { fontSize: 13 }]}>Discount</Text>
              <Text style={[styles.secondary, { color: '#4CAF50' }, isSmallScreen && { fontSize: 13 }]}>-${discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.secondary, isSmallScreen && { fontSize: 13 }]}>Delivery</Text>
            <Text style={[styles.secondary, isSmallScreen && { fontSize: 13 }]}>${delivery.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, isSmallScreen && { fontSize: 15 }]}>Total</Text>
            <Text style={[styles.totalPrice, isSmallScreen && { fontSize: 17 }]}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, isSmallScreen && { padding: 14 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.footerHint, isSmallScreen && { fontSize: 11 }]}>You will be charged</Text>
          <Text style={[styles.footerTotal, isSmallScreen && { fontSize: 18 }]}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={[styles.placeButton, isSmallScreen && { paddingHorizontal: 16, paddingVertical: 12 }]} onPress={handlePlaceOrder} disabled={placing}>
          {placing ? (
            <Text style={styles.placeText}>Placing...</Text>
          ) : (
            <>
              <Ionicons name="bag-check" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={[styles.placeText, isSmallScreen && { fontSize: 15 }]}>Place Order</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* EcoCash Modal */}
      <Modal visible={ecoModal} transparent animationType="slide" onRequestClose={() => setEcoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {ecoStep === 'phone' && (
              <View>
                <Text style={styles.modalTitle}>EcoCash Payment</Text>
                <Text style={styles.modalSubtitle}>Enter recipient and sender mobile numbers (10 digits each)</Text>
                <Text style={styles.fieldLabel}>Recipient number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0771234567"
                  keyboardType="phone-pad"
                  value={ecoRecipient}
                  onChangeText={(v) => setEcoRecipient(v.replace(/\D/g, ''))}
                  maxLength={10}
                />
                <Text style={styles.fieldLabel}>Sender number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0712345678"
                  keyboardType="phone-pad"
                  value={ecoSender}
                  onChangeText={(v) => setEcoSender(v.replace(/\D/g, ''))}
                  maxLength={10}
                />
                {!!ecoError && <Text style={styles.errorText}>{ecoError}</Text>}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    (ecoRecipient.replace(/\D/g, '').length !== 10 || ecoSender.replace(/\D/g, '').length !== 10) && { opacity: 0.6 },
                  ]}
                  onPress={submitEcoPhone}
                  disabled={ecoRecipient.replace(/\D/g, '').length !== 10 || ecoSender.replace(/\D/g, '').length !== 10}
                >
                  <Text style={styles.actionButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {ecoStep === 'pin' && (
              <View>
                <Text style={styles.modalTitle}>Confirm on EcoCash</Text>
                <Text style={styles.modalSubtitle}>Enter your EcoCash PIN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••"
                  keyboardType="number-pad"
                  secureTextEntry
                  value={ecoPin}
                  onChangeText={setEcoPin}
                  maxLength={6}
                />
                {!!ecoError && <Text style={styles.errorText}>{ecoError}</Text>}
                <TouchableOpacity style={[styles.actionButton, ecoLoading && { opacity: 0.6 }]} onPress={submitEcoPin} disabled={ecoLoading}>
                  <Text style={styles.actionButtonText}>{ecoLoading ? 'Processing...' : 'Pay'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {ecoStep === 'success' && (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                <Text style={[styles.modalTitle, { marginTop: 12 }]}>Payment Successful</Text>
                <Text style={styles.modalSubtitle}>Your EcoCash transaction is complete.</Text>
                <TouchableOpacity style={styles.actionButton} onPress={closeEcoSuccess}>
                  <Text style={styles.actionButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* InnBucks Modal */}
      <Modal visible={innModal} transparent animationType="slide" onRequestClose={() => setInnModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {innStep === 'phone' && (
              <View>
                <Text style={styles.modalTitle}>InnBucks Payment</Text>
                <Text style={styles.modalSubtitle}>Enter recipient and sender mobile numbers (10 digits each)</Text>
                <Text style={styles.fieldLabel}>Recipient number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0771234567"
                  keyboardType="phone-pad"
                  value={innRecipient}
                  onChangeText={(v) => setInnRecipient(v.replace(/\D/g, ''))}
                  maxLength={10}
                />
                <Text style={styles.fieldLabel}>Sender number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0712345678"
                  keyboardType="phone-pad"
                  value={innSender}
                  onChangeText={(v) => setInnSender(v.replace(/\D/g, ''))}
                  maxLength={10}
                />
                {!!innError && <Text style={styles.errorText}>{innError}</Text>}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    (innRecipient.replace(/\D/g, '').length !== 10 || innSender.replace(/\D/g, '').length !== 10) && { opacity: 0.6 },
                  ]}
                  onPress={submitInnPhone}
                  disabled={innRecipient.replace(/\D/g, '').length !== 10 || innSender.replace(/\D/g, '').length !== 10}
                >
                  <Text style={styles.actionButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {innStep === 'pin' && (
              <View>
                <Text style={styles.modalTitle}>Confirm on InnBucks</Text>
                <Text style={styles.modalSubtitle}>Enter your InnBucks PIN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••"
                  keyboardType="number-pad"
                  secureTextEntry
                  value={innPin}
                  onChangeText={setInnPin}
                  maxLength={6}
                />
                {!!innError && <Text style={styles.errorText}>{innError}</Text>}
                <TouchableOpacity style={[styles.actionButton, innLoading && { opacity: 0.6 }]} onPress={submitInnPin} disabled={innLoading}>
                  <Text style={styles.actionButtonText}>{innLoading ? 'Processing...' : 'Pay'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {innStep === 'success' && (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                <Text style={[styles.modalTitle, { marginTop: 12 }]}>Payment Successful</Text>
                <Text style={styles.modalSubtitle}>Your InnBucks transaction is complete.</Text>
                <TouchableOpacity style={styles.actionButton} onPress={closeInnSuccess}>
                  <Text style={styles.actionButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* OMari Modal */}
      <Modal visible={omModal} transparent animationType="slide" onRequestClose={() => setOmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {omStep === 'phone' && (
              <View>
                <Text style={styles.modalTitle}>OMari Payment</Text>
                <Text style={styles.modalSubtitle}>Enter recipient and sender mobile numbers (10 digits each)</Text>
                <Text style={styles.fieldLabel}>Recipient number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0771234567"
                  keyboardType="phone-pad"
                  value={omRecipient}
                  onChangeText={(v) => setOmRecipient(v.replace(/\D/g, ''))}
                  maxLength={10}
                />
                <Text style={styles.fieldLabel}>Sender number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0712345678"
                  keyboardType="phone-pad"
                  value={omSender}
                  onChangeText={(v) => setOmSender(v.replace(/\D/g, ''))}
                  maxLength={10}
                />
                {!!omError && <Text style={styles.errorText}>{omError}</Text>}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    (omRecipient.replace(/\D/g, '').length !== 10 || omSender.replace(/\D/g, '').length !== 10) && { opacity: 0.6 },
                  ]}
                  onPress={submitOmPhone}
                  disabled={omRecipient.replace(/\D/g, '').length !== 10 || omSender.replace(/\D/g, '').length !== 10}
                >
                  <Text style={styles.actionButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {omStep === 'pin' && (
              <View>
                <Text style={styles.modalTitle}>Confirm on OMari</Text>
                <Text style={styles.modalSubtitle}>Enter your OMari PIN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••"
                  keyboardType="number-pad"
                  secureTextEntry
                  value={omPin}
                  onChangeText={setOmPin}
                  maxLength={6}
                />
                {!!omError && <Text style={styles.errorText}>{omError}</Text>}
                <TouchableOpacity style={[styles.actionButton, omLoading && { opacity: 0.6 }]} onPress={submitOmPin} disabled={omLoading}>
                  <Text style={styles.actionButtonText}>{omLoading ? 'Processing...' : 'Pay'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {omStep === 'success' && (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                <Text style={[styles.modalTitle, { marginTop: 12 }]}>Payment Successful</Text>
                <Text style={styles.modalSubtitle}>Your OMari transaction is complete.</Text>
                <TouchableOpacity style={styles.actionButton} onPress={closeOmSuccess}>
                  <Text style={styles.actionButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F7F8', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#2A4D50' },
  content: { padding: 20, paddingBottom: 120 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2A4D50' },
  edit: { color: '#4CAF50', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center' },
  payRow: { padding: 12, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, backgroundColor: '#FFF' },
  payRowSelected: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  iconChip: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  payLogo: { width: 34, height: 34, borderRadius: 6, backgroundColor: '#FFF', marginRight: 10 },
  primary: { fontSize: 15, fontWeight: '600', color: '#2A4D50' },
  secondary: { fontSize: 14, color: '#7C7C7C' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#2A4D50' },
  totalPrice: { fontSize: 18, fontWeight: '700', color: '#4CAF50' },
  footer: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  footerHint: { fontSize: 12, color: '#7C7C7C' },
  footerTotal: { fontSize: 20, fontWeight: '700', color: '#2A4D50' },
  placeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 },
  placeText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#2A4D50' },
  modalSubtitle: { fontSize: 14, color: '#7C7C7C', marginTop: 6, marginBottom: 12 },
  fieldLabel: { fontSize: 13, color: '#2A4D50', marginTop: 8, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#2A4D50' },
  errorText: { color: '#D32F2F', marginTop: 8 },
  actionButton: { marginTop: 14, backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  actionButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
