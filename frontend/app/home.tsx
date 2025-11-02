import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  PanResponder,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { AnimatedBackground } from '../components/AnimatedBackground';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const videoFiles = [
  require('../assets/videos/video1.mp4'),
  require('../assets/videos/video2.mp4'),
  require('../assets/videos/video3.mp4'),
  require('../assets/videos/video4.mp4'),
  require('../assets/videos/video5.mp4'),
  require('../assets/videos/video6.mp4'),
  require('../assets/videos/video7.mp4'),
  require('../assets/videos/video8.mp4'),
  require('../assets/videos/video9.mp4'),
  require('../assets/videos/video10.mp4'),
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { messages, addMessage, isLoading: chatLoading } = useChatStore();
  const videoRef = useRef<Video>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPressingFingerprint, setIsPressingFingerprint] = useState(false);
  const [inputText, setInputText] = useState('');
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Animations
  const scanRing1 = useSharedValue(1);
  const scanOpacity1 = useSharedValue(0);
  const fingerprintScale = useSharedValue(1);
  const menuTranslateX = useSharedValue(-300);
  const chatTranslateY = useSharedValue(height);

  // Scanning animation for fingerprint button - reduced to single ring
  useEffect(() => {
    // Ring 1
    scanRing1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(1.8, { duration: 2000, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
    scanOpacity1.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 100 }),
        withTiming(0, { duration: 1900, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // Animated styles
  const scanRing1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scanRing1.value }],
    opacity: scanOpacity1.value,
  }));

  const fingerprintStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fingerprintScale.value }],
  }));

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: menuTranslateX.value }],
  }));

  const chatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chatTranslateY.value }],
  }));

  // Handle fingerprint press
  const handleFingerprintPressIn = () => {
    setIsPressingFingerprint(true);
    fingerprintScale.value = withSpring(0.95);
    
    // Long press timer - 1.5 seconds
    longPressTimer.current = setTimeout(() => {
      openChat();
    }, 1500);
  };

  const handleFingerprintPressOut = () => {
    setIsPressingFingerprint(false);
    fingerprintScale.value = withSpring(1);
    
    // Clear timer if released early
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Open chat at 1/4 screen height
  const openChat = () => {
    setChatVisible(true);
    chatTranslateY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
  };

  // Close chat
  const closeChat = () => {
    chatTranslateY.value = withSpring(height, {
      damping: 20,
      stiffness: 90,
    });
    setTimeout(() => {
      setChatVisible(false);
    }, 300);
  };

  // Toggle menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    menuTranslateX.value = withSpring(!menuVisible ? 0 : -300, {
      damping: 20,
      stiffness: 90,
    });
  };

  // Pan responder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && !menuVisible) {
          toggleMenu();
        } else if (gestureState.dx < -50 && menuVisible) {
          toggleMenu();
        }
      },
    })
  ).current;

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleSend = async () => {
    if (!inputText.trim() || chatLoading) return;

    const userMessage = inputText.trim();
    setInputText('');

    // Add user message
    await addMessage(userMessage);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatVisible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, chatVisible]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
        style={styles.gradient}
      >
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Menu Button */}
        <TouchableOpacity
          style={[styles.menuButton, { top: insets.top + 10 }]}
          onPress={toggleMenu}
        >
          <Ionicons name="menu" size={32} color="#dc2626" />
        </TouchableOpacity>

        {/* MAL0 Label - positioned at top */}
        <View style={[styles.mal0LabelContainer, { top: insets.top + 80 }]}>
          <Text style={styles.mal0Label}>MAL0</Text>
        </View>

        {/* Video Container - large centered window */}
        <View style={styles.videoContainer}>
          <View style={styles.videoWrapper}>
            <Video
              ref={videoRef}
              source={videoFiles[currentVideoIndex]}
              style={styles.video}
              isLooping
              shouldPlay
              resizeMode={ResizeMode.CONTAIN}
              isMuted={false}
              volume={0.5}
            />
          </View>
        </View>

        {/* Fingerprint Button - positioned at bottom */}
        <View style={[styles.fingerprintContainer, { bottom: insets.bottom + 40 }]}>
          {/* Single Scanning Ring */}
          <Animated.View style={[styles.scanRing, scanRing1Style]} />
          
          <TouchableOpacity
            style={styles.fingerprintButton}
            onPressIn={handleFingerprintPressIn}
            onPressOut={handleFingerprintPressOut}
            activeOpacity={0.9}
          >
            <Animated.View style={fingerprintStyle}>
              <MaterialCommunityIcons
                name="fingerprint"
                size={50}
                color="#dc2626"
              />
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.fingerprintHint}>
            Удержите для чата
          </Text>
        </View>
      </LinearGradient>

      {/* Slide Menu */}
      <Animated.View style={[styles.slideMenu, menuStyle]}>
        <LinearGradient
          colors={['#1a1a2e', '#0a0a0a']}
          style={styles.menuGradient}
        >
          <View style={[styles.menuHeader, { paddingTop: insets.top + 10 }]}>
            <Text style={styles.menuTitle}>МЕНЮ</Text>
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="close" size={28} color="#dc2626" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push('/profile' as any);
              }}
            >
              <Ionicons name="person" size={24} color="#dc2626" />
              <Text style={styles.menuItemText}>Личный кабинет</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="link" size={24} color="#dc2626" />
              <Text style={styles.menuItemText}>Подключённые приложения</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="settings" size={24} color="#dc2626" />
              <Text style={styles.menuItemText}>Настройки</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle" size={24} color="#dc2626" />
              <Text style={styles.menuItemText}>Помощь</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={24} color="#ff006e" />
              <Text style={[styles.menuItemText, { color: '#ff006e' }]}>
                Выйти
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.menuFooter}>
            <Text style={styles.menuFooterText}>v0.02 ESMAL0</Text>
            <Text style={styles.menuFooterText}>SCP-1471 | Объект 0051</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Chat Modal - 1/4 Screen */}
      {chatVisible && (
        <Animated.View style={[styles.chatModal, chatStyle]}>
          <LinearGradient
            colors={['#1a1a2e', '#0a0a0a']}
            style={styles.chatGradient}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.chatKeyboardView}
            >
              {/* Chat Header with Close Button */}
              <View style={styles.chatHeader}>
                <View style={styles.chatHeaderContent}>
                  <Text style={styles.chatTitle}>MAL0 Ассистент</Text>
                  <Text style={styles.chatSubtitle}>Онлайн • Готова помочь</Text>
                </View>
                <TouchableOpacity
                  onPress={closeChat}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={28} color="#dc2626" />
                </TouchableOpacity>
              </View>

              {/* Chat Messages */}
              <ScrollView
                ref={scrollViewRef}
                style={styles.chatMessages}
                contentContainerStyle={styles.chatMessagesContent}
              >
                {messages.length === 0 ? (
                  <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>Привет, {user?.username}!</Text>
                    <Text style={styles.welcomeText}>
                      Я MAL0, твой ассистент. Чем могу помочь?
                    </Text>
                  </View>
                ) : (
                  messages.map((message, index) => (
                    <View
                      key={index}
                      style={[
                        styles.messageBubble,
                        message.role === 'user'
                          ? styles.userBubble
                          : styles.assistantBubble,
                      ]}
                    >
                      <Text style={styles.messageText}>{message.content}</Text>
                      <Text style={styles.messageTime}>
                        {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  ))
                )}
                {chatLoading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#dc2626" size="small" />
                    <Text style={styles.loadingText}>MAL0 печатает...</Text>
                  </View>
                )}
              </ScrollView>

              {/* Chat Input */}
              <View style={[styles.chatInputContainer, { paddingBottom: insets.bottom }]}>
                <TouchableOpacity style={styles.voiceButton}>
                  <Ionicons name="mic" size={24} color="#dc2626" />
                </TouchableOpacity>
                <TextInput
                  style={styles.chatInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Напишите сообщение..."
                  placeholderTextColor="#666"
                  multiline
                  maxLength={500}
                  editable={!chatLoading}
                />
                <TouchableOpacity
                  style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                  onPress={handleSend}
                  disabled={!inputText.trim() || chatLoading}
                >
                  <Ionicons name="send" size={24} color={inputText.trim() ? "#dc2626" : "#666"} />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Backdrop for menu */}
      {menuVisible && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleMenu}
          activeOpacity={1}
        />
      )}

      {/* Backdrop for chat */}
      {chatVisible && (
        <TouchableOpacity
          style={[styles.backdrop, { zIndex: 149 }]}
          onPress={closeChat}
          activeOpacity={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mal0LabelContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 5,
  },
  mal0Label: {
    fontSize: Math.min(width * 0.12, 48),
    fontWeight: '900',
    color: '#dc2626',
    textShadowColor: '#dc2626',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 6,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrapper: {
    width: width * 0.92,
    height: height * 0.65,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#dc2626',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fingerprintContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },
  scanRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  fingerprintButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 2,
    borderColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintHint: {
    color: '#a0a0a0',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  slideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: Math.min(width * 0.8, 300),
    zIndex: 100,
  },
  menuGradient: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(220, 38, 38, 0.2)',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: 2,
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    marginVertical: 12,
    marginHorizontal: 20,
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 255, 0.2)',
    alignItems: 'center',
  },
  menuFooterText: {
    color: '#666',
    fontSize: 12,
    marginVertical: 2,
  },
  chatModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.4,
    zIndex: 150,
  },
  chatGradient: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  chatKeyboardView: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.2)',
  },
  chatHeaderContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#00d4ff',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: '#dc2626',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  welcomeText: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.4)',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    color: '#666',
    fontSize: 10,
    marginTop: 6,
    textAlign: 'right',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingText: {
    color: '#a0a0a0',
    fontSize: 12,
    marginLeft: 8,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 255, 0.2)',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  chatInput: {
    flex: 1,
    maxHeight: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
});