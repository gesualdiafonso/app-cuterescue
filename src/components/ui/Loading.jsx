import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const LOGO_SIZE = 150; // Ajuste conforme necessário

export default function Loading() {
  const progress = useSharedValue(LOGO_SIZE); // Começa no fundo (escondido)

  useEffect(() => {
    // Animação infinita de "encher"
    progress.value = withRepeat(
      withTiming(0, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Repetir infinitamente
      false // Não volta, recomeça do zero (ou true para efeito ioiô)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: progress.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* 1. Logo de fundo (Cinza/Opaca) */}
      <Image 
        source={require('../../../assets/logos/LogoTipo.png')} 
        style={[styles.logo, styles.logoBackground]} 
      />

      {/* 2. Máscara que revela a logo colorida */}
      <MaskedView
        style={styles.maskContainer}
        maskElement={
          <Image 
            source={require('../../../assets/logos/LogoTipo.png')} 
            style={styles.logo} 
          />
        }
      >
        {/* O retângulo que sobe e "preenche" a logo */}
        <Animated.View style={[styles.fill, animatedStyle]} />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: 'contain',
  },
  logoBackground: {
    position: 'absolute',
    opacity: 0.2, // Deixa a logo de fundo clarinha
    tintColor: 'gray', // Opcional: força a logo de fundo a ser cinza
  },
  maskContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  fill: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    backgroundColor: '#246B7D', // A cor azul da sua logo ou a cor do "enchimento"
  },
});