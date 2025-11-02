import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import authService from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { AnimatedBackground } from '../components/AnimatedBackground';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser, setAuthenticated } = useAuthStore();

  // Multi-color neon glow animations
  const glowOpacityRed = useSharedValue(0.6);
  const glowOpacityBlue = useSharedValue(0.6);
  const glowOpacityWhite = useSharedValue(0.6);

  useEffect(() => {
    // Red glow animation
    glowOpacityRed.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.4, { duration: 1200 })
      ),
      -1,
      false
    );

    // Blue glow animation (slightly offset)
    setTimeout(() => {
      glowOpacityBlue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0.4, { duration: 1500 })
        ),
        -1,
        false
      );
    }, 400);

    // White glow animation (more offset)
    setTimeout(() => {
      glowOpacityWhite.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1800 }),
          withTiming(0.4, { duration: 1800 })
        ),
        -1,
        false
      );
    }, 800);
  }, []);

  const glowStyleRed = useAnimatedStyle(() => ({
    opacity: glowOpacityRed.value,
  }));

  const glowStyleBlue = useAnimatedStyle(() => ({
    opacity: glowOpacityBlue.value,
  }));

  const glowStyleWhite = useAnimatedStyle(() => ({
    opacity: glowOpacityWhite.value,
  }));

  // Check if already authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await authService.isAuthenticated();
    if (isAuth) {
      const user = await authService.getUser();
      if (user) {
        setUser(user);
        setAuthenticated(true);
        router.replace('/home');
      }
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(username.trim(), password);
      setUser(response.user);
      setAuthenticated(true);
      
      // Navigate to home
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Ошибка входа', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
      style={styles.container}
    >
      {/* Animated Background */}
      <AnimatedBackground />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Eternal Sentinels Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ETERNAL</Text>
            <Text style={styles.logoText}>SENTINELS</Text>
          </View>

          {/* MAL0 Neon Logo with Multi-color Glow */}
          <View style={styles.mal0Container}>
            {/* Red Neon Glow */}
            <Animated.View style={[styles.neonGlowRed, glowStyleRed]} />
            {/* Blue Neon Glow */}
            <Animated.View style={[styles.neonGlowBlue, glowStyleBlue]} />
            {/* White Neon Glow */}
            <Animated.View style={[styles.neonGlowWhite, glowStyleWhite]} />
            
            <View style={styles.logoImageContainer}>
              <Image
                source={require('../assets/images/mal0-original.jpg')}
                style={styles.mal0Image}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.assistantText}>Голосовой ассистент MAL0</Text>
            <Text style={styles.subtitleText}>SCP-1471 | Объект 0051</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Имя пользователя</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#666"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Пароль</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>ВОЙТИ</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.infoText}>
              Доступ только для зарегистрированных сотрудников
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Math.max(width * 0.06, 24),
    paddingVertical: Math.max(height * 0.05, 40),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Math.max(height * 0.04, 30),
  },
  logoText: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
    textShadowColor: '#dc2626',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  mal0Container: {
    alignItems: 'center',
    marginBottom: Math.max(height * 0.05, 40),
    position: 'relative',
  },
  neonGlowRed: {
    position: 'absolute',
    width: Math.min(width * 0.5, 200),
    height: Math.min(width * 0.5, 200),
    borderRadius: Math.min(width * 0.25, 100),
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#ff006e',
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  neonGlowBlue: {
    position: 'absolute',
    width: Math.min(width * 0.5, 200),
    height: Math.min(width * 0.5, 200),
    borderRadius: Math.min(width * 0.25, 100),
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 35,
    elevation: 18,
  },
  neonGlowWhite: {
    position: 'absolute',
    width: Math.min(width * 0.5, 200),
    height: Math.min(width * 0.5, 200),
    borderRadius: Math.min(width * 0.25, 100),
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 16,
  },
  logoImageContainer: {
    width: Math.min(width * 0.5, 200),
    height: Math.min(width * 0.5, 200),
    borderRadius: Math.min(width * 0.25, 100),
    overflow: 'hidden',
    marginBottom: 20,
  },
  mal0Image: {
    width: '100%',
    height: '100%',
  },
  assistantText: {
    fontSize: Math.min(width * 0.05, 20),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  infoText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});
