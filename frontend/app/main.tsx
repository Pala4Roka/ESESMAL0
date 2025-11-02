import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function MainScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(1000)} style={styles.content}>
        <Text style={styles.title}>Добро пожаловать, {user?.username}!</Text>
        <Text style={styles.subtitle}>Уровень допуска: {user?.clearance_level}</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>🎉 ФАЗА 1 ЗАВЕРШЕНА!</Text>
          <Text style={styles.infoText}>✅ Навигация работает</Text>
          <Text style={styles.infoText}>✅ Аутентификация работает</Text>
          <Text style={styles.infoText}>✅ Базовый UI создан</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>ВЫЙТИ</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neonCyan,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: Colors.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 40,
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neonCyan,
    marginBottom: 40,
  },
  infoText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: Colors.neonPink,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: Colors.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  logoutButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});