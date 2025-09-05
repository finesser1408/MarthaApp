import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
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

const RegisterScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    setError('');
    const emailToValidate = email.trim();
    if (!fullName.trim() || !emailToValidate || !password || !confirmPassword || !homeAddress.trim() || !workAddress.trim()) {
      setError('All fields are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(emailToValidate)) {
      setError('Please enter a valid email address (e.g., name@gmail.com).');
      return;
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setError('Password must be at least 8 characters and include upper, lower, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const res = await register(fullName, emailToValidate, password, homeAddress, workAddress);
    if (res.ok) {
      router.replace('/(tabs)');
    } else {
      setError(res.error);
    }
  };

  // Keyboard offset to avoid overlap with status bar/header
  const keyboardOffset = Platform.OS === 'ios' ? 64 : (StatusBar.currentHeight || 0) + 8;

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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#2d3748" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.logoContainer}>
            <View style={[styles.logoWrapper, isSmallScreen && styles.logoWrapperSmall]}>
              <Image
                source={require('../assets/images/logo.jpeg')}
                style={[styles.logo, isSmallScreen && styles.logoSmall]}
              />
            </View>
            <Text style={[styles.appTitle, isSmallScreen && styles.appTitleSmall]}>Daily Grocery Food</Text>
            <Text style={[styles.welcomeText, isSmallScreen && styles.welcomeTextSmall]}>Create your account</Text>
          </View>

          <View style={[styles.formContainer, isSmallScreen && styles.formContainerSmall]}>
            <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall]}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall]}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall]}>
              <Ionicons name="home-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Home Address"
                placeholderTextColor="#999"
                value={homeAddress}
                onChangeText={setHomeAddress}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
            </View>

            <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall]}>
              <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Work Address"
                placeholderTextColor="#999"
                value={workAddress}
                onChangeText={setWorkAddress}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
            </View>

            <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall]}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall]}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.registerButton, isSmallScreen && styles.registerButtonSmall, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: isSmallScreen ? 8 : 12 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoWrapper: {
    backgroundColor: '#fff',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#718096',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#2d3748',
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#e53e3e',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#718096',
    fontSize: 15,
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 15,
  },
  // Small-screen overrides
  scrollContainerSmall: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  logoWrapperSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  logoSmall: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  appTitleSmall: {
    fontSize: 20,
    marginBottom: 4,
  },
  welcomeTextSmall: {
    fontSize: 12,
  },
  formContainerSmall: {
    maxWidth: 360,
    alignSelf: 'center',
  },
  inputContainerSmall: {
    height: 48,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputSmall: {
    fontSize: 14,
  },
  registerButtonSmall: {
    height: 48,
    marginBottom: 16,
  },
});

export default RegisterScreen;
