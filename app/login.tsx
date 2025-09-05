import { Ionicons } from '@expo/vector-icons';
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
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { isSmallScreen } from '../utils/responsive';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  // Keyboard offset to avoid overlap with header/status bar
  const keyboardOffset = Platform.OS === 'ios' ? 64 : (StatusBar.currentHeight || 0) + 8;

  const safeNavigate = (routeName: string) => {
    if (routeName.toLowerCase() === 'home') {
      router.replace('/(tabs)');
      return;
    }
    if (routeName.toLowerCase() === 'register') {
      router.push('/register'); // Requires a register screen to exist later
      return;
    }
    if (routeName.toLowerCase() === 'login') {
      router.push('/login');
      return;
    }
    // Default fallback
    router.push('/');

    // Web fallback if rendered outside navigator
    if (Platform.OS === 'web') {
      // @ts-ignore
      window.location.hash = '#/';
    }
  };

  const handleLogin = async () => {
    setError('');
    const emailToValidate = email.trim();
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
    const res = await login(emailToValidate, password);
    if (res.ok) {
      router.replace('/(tabs)');
    } else {
      setError(res.error);
    }
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.logoContainer}>
            <View style={[styles.logoWrapper, isSmallScreen && styles.logoWrapperSmall]}>
              <Image
                source={require('../assets/images/logo.jpeg')}
                style={[styles.logo, isSmallScreen && styles.logoSmall]}
              />
            </View>
            <Text style={[styles.appTitle, isSmallScreen && styles.appTitleSmall]}>Daily Grocery Food</Text>
            <Text style={[styles.welcomeText, isSmallScreen && styles.welcomeTextSmall]}>Welcome back!</Text>
          </View>

          <View style={[styles.formContainer, isSmallScreen && styles.formContainerSmall]}>
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
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isSmallScreen && styles.inputSmall]}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.loginButton, isSmallScreen && styles.loginButtonSmall, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Do not have an account? </Text>
              <TouchableOpacity onPress={() => safeNavigate('Register')}>
                <Text style={styles.registerLink}>Register</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    backgroundColor: '#fff',
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 14,
    color: '#718096',
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
  loginButtonText: {
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  registerText: {
    color: '#718096',
    fontSize: 15,
  },
  registerLink: {
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
  },
  inputContainerSmall: {
    height: 44,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputSmall: {
    fontSize: 14,
  },
  loginButtonSmall: {
    height: 44,
    marginBottom: 16,
  },
});

export default LoginScreen;
