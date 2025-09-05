import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import { isSmallScreen } from '../utils/responsive';

const AddressScreen: React.FC = () => {
  const { user, updateAddresses } = useAuth();
  const [homeAddress, setHomeAddress] = useState<string>(user?.homeAddress || '');
  const [workAddress, setWorkAddress] = useState<string>(user?.workAddress || '');
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const keyboardOffset = Platform.OS === 'ios' ? 64 : (StatusBar.currentHeight || 0) + 8;

  const handleSave = async () => {
    setError('');
    if (!homeAddress.trim() || !workAddress.trim()) {
      setError('Both Home and Work addresses are required.');
      return;
    }
    setSaving(true);
    const res = await updateAddresses(homeAddress, workAddress);
    setSaving(false);
    if (res.ok) router.back();
    else setError(res.error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            isSmallScreen && styles.scrollContainerSmall,
            { paddingBottom: isSmallScreen ? 24 : 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#2d3748" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Addresses</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={[styles.formContainer, isSmallScreen && styles.formContainerSmall]}>
            <Text style={styles.sectionLabel}>Home Address</Text>
            <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall]}>
              <Ionicons name="home-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Enter your home address"
                placeholderTextColor="#999"
                value={homeAddress}
                onChangeText={setHomeAddress}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
            </View>

            <Text style={styles.sectionLabel}>Work Address</Text>
            <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall]}>
              <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Enter your work address"
                placeholderTextColor="#999"
                value={workAddress}
                onChangeText={setWorkAddress}
                autoCapitalize="sentences"
                returnKeyType="done"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.saveButton, isSmallScreen && styles.saveButtonSmall, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardAvoid: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2d3748' },
  formContainer: { width: '100%' },
  sectionLabel: { fontSize: 13, color: '#718096', marginBottom: 6, marginLeft: 4, fontWeight: '600' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    marginBottom: 16, paddingHorizontal: 16, height: 56, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, borderWidth: 1, borderColor: '#e2e8f0',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 16, color: '#2d3748' },
  saveButton: {
    backgroundColor: '#4CAF50', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center',
    marginTop: 8, marginBottom: 24, shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
    shadowRadius: 4.65, elevation: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  errorText: { color: '#e53e3e', marginBottom: 12, textAlign: 'center', fontWeight: '600' },
  // Small-screen overrides
  scrollContainerSmall: { paddingHorizontal: 12, paddingVertical: 12 },
  formContainerSmall: { maxWidth: 360, alignSelf: 'center' },
  inputContainerSmall: { height: 48, marginBottom: 12, paddingHorizontal: 12 },
  inputSmall: { fontSize: 14 },
  saveButtonSmall: { height: 48, marginBottom: 16 },
});

export default AddressScreen;
