import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        router.replace('/main');
      } else {
        Alert.alert('Ошибка входа', 'Неверное имя пользователя или пароль');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo Eternal Sentinels */}
          <Animated.View entering={FadeIn.duration(1000)} style={styles.logoContainer}>
            <Text style={styles.logoText}>ETERNAL</Text>
            <Text style={styles.logoSubText}>SENTINELS</Text>
          </Animated.View>

          {/* MAL0 Logo/Title */}
          <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.mal0Container}>
            <Text style={styles.mal0Title}>MAL0</Text>
            <Text style={styles.mal0Subtitle}>Assistant</Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View entering={FadeInDown.delay(500).duration(800)} style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Имя пользователя"
                placeholderTextColor={Colors.textSecondary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text style={styles.loginButtonText}>ВОЙТИ</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).duration(800)} style={styles.footer}>
            <Text style={styles.footerText}>
              Только для зарегистрированных пользователей сайта
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.neonCyan,
    letterSpacing: 8,
    textShadowColor: Colors.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  logoSubText: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: 6,
    marginTop: 8,
  },
  mal0Container: {
    alignItems: 'center',
    marginBottom: 60,
  },
  mal0Title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: Colors.neonPurple,
    letterSpacing: 4,
    textShadowColor: Colors.neonPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  mal0Subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    letterSpacing: 4,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: Colors.neonCyan,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loginButton: {
    backgroundColor: Colors.neonCyan,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  loginButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});