import Constants from 'expo-constants';

// Get backend URL from environment
export const API_BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 'https://mal0-assistant-1.preview.emergentagent.com';

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
  CHAT: '/api/chat',
  CHAT_HISTORY: '/api/chat/history',
};

export const VIDEO_EMOTIONS = {
  calm: require('../assets/videos/video1.mp4'),
  joy: require('../assets/videos/video2.mp4'),
  playful: require('../assets/videos/video3.mp4'),
  sad: require('../assets/videos/video4.mp4'),
  tired: require('../assets/videos/video5.mp4'),
};

export const COLORS = {
  primary: '#FF00FF',      // Neon pink
  secondary: '#00FFFF',    // Neon cyan
  background: '#0A0A0F',   // Dark background
  cardBg: '#1A1A2E',      // Card background
  text: '#FFFFFF',         // White text
  textSecondary: '#A0A0B0', // Gray text
  neonGlow: '#FF00FF',     // Glow effect
};
