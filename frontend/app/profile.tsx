import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout: logoutStore } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          onPress: async () => {
            await authService.logout();
            logoutStore();
            router.replace('/');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Личный кабинет</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Имя пользователя:</Text>
            <Text style={styles.value}>{user?.username}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Уровень допуска:</Text>
            <Text style={styles.value}>{user?.clearance_level}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{user?.id}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Назад</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 32,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#dc2626',
    marginBottom: 32,
  },
  infoRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '700',
  },
});