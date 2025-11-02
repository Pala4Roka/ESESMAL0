import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  duration: number;
}

export const AnimatedBackground: React.FC = () => {
  const particles = useRef<Particle[]>([]);
  const fieldOpacity1 = useRef(new Animated.Value(0.3)).current;
  const fieldOpacity2 = useRef(new Animated.Value(0.3)).current;
  const fieldTranslateX1 = useRef(new Animated.Value(0)).current;
  const fieldTranslateY1 = useRef(new Animated.Value(0)).current;
  const fieldTranslateX2 = useRef(new Animated.Value(0)).current;
  const fieldTranslateY2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create 15 particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      const particle: Particle = {
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(height + 100),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0),
        duration: 8000 + Math.random() * 6000,
      };
      newParticles.push(particle);
    }
    particles.current = newParticles;

    // Animate particles
    particles.current.forEach((particle, index) => {
      const animateParticle = () => {
        particle.y.setValue(height + 100);
        particle.opacity.setValue(0);
        particle.scale.setValue(0);

        Animated.sequence([
          Animated.delay(index * 800),
          Animated.parallel([
            Animated.timing(particle.y, {
              toValue: -100,
              duration: particle.duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: particle.duration - 1000,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(particle.scale, {
                toValue: 1,
                duration: particle.duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 0.5,
                duration: particle.duration / 2,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start(() => animateParticle());
      };
      animateParticle();
    });

    // Animate containment fields
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fieldOpacity1, {
            toValue: 0.5,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(fieldTranslateX1, {
            toValue: 40,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(fieldTranslateY1, {
            toValue: -40,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fieldOpacity1, {
            toValue: 0.3,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(fieldTranslateX1, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(fieldTranslateY1, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fieldOpacity2, {
            toValue: 0.6,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(fieldTranslateX2, {
            toValue: -30,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(fieldTranslateY2, {
            toValue: 30,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fieldOpacity2, {
            toValue: 0.3,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(fieldTranslateX2, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(fieldTranslateY2, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Containment Field 1 */}
      <Animated.View
        style={[
          styles.field,
          {
            top: -100,
            left: -100,
            width: 600,
            height: 600,
            opacity: fieldOpacity1,
            transform: [
              { translateX: fieldTranslateX1 },
              { translateY: fieldTranslateY1 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(220, 38, 38, 0.15)', 'transparent']}
          style={styles.fieldGradient}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Containment Field 2 */}
      <Animated.View
        style={[
          styles.field,
          {
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            opacity: fieldOpacity2,
            transform: [
              { translateX: fieldTranslateX2 },
              { translateY: fieldTranslateY2 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(153, 27, 27, 0.2)', 'transparent']}
          style={styles.fieldGradient}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Particles */}
      {particles.current.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  field: {
    position: 'absolute',
    borderRadius: 1000,
  },
  fieldGradient: {
    flex: 1,
    borderRadius: 1000,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(220, 38, 38, 0.6)',
    shadowColor: 'rgba(220, 38, 38, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
});
