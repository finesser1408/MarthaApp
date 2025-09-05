import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const safeNavigate = (routeName: string) => {
    // In Expo Router, prefer router navigation
    if (routeName === 'Login') {
      router.push('/login');
      return;
    }
    // Default to tabs/home for now
    router.replace('/(tabs)');

    // Web fallback if needed
    // @ts-ignore
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // @ts-ignore
      window.location.hash = '#/';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.content}>
        {/* App Icon/Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="cart" size={60} color="#4CAF50" />
          </View>
          <Image
            source={{ uri: 'https://placehold.co/200x200/4CAF50/FFFFFF?text=AF' }}
            style={styles.logoImage}
          />
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeTitle}>Welcome to</Text>
        <Text style={styles.appName}>AfroStore</Text>
        <Text style={styles.welcomeSubtitle}>
          Your favorite African groceries, delivered fresh to your doorstep
        </Text>

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
          <View style={[styles.decorativeCircle, styles.circle3]} />
        </View>
      </View>

      {/* Get Started Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => safeNavigate('Login')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    top: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#7C7C7C',
    marginBottom: 8,
    textAlign: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 20,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.2,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#4CAF50',
    top: '15%',
    left: -80,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#FF9800',
    bottom: '20%',
    right: -60,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: '#2196F3',
    top: '50%',
    left: '20%',
  },
  footer: {
    padding: 40,
    paddingBottom: 60,
  },
  getStartedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default WelcomeScreen;
