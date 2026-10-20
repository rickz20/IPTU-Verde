import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { CORES } from './telaInicial/tema';

export default function AvatarPerfil({ onEditar = () => {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Svg width="100%" height="100%" viewBox="0 0 140 140">
          <Circle cx="70" cy="70" r="70" fill={CORES.verde} />
          <Circle
            cx="70"
            cy="55"
            r="18"
            fill="none"
            stroke={CORES.verdeEscuro}
            strokeWidth="8"
          />
          <Path
            d="M24 126c8-24 26-37 46-37s38 13 46 37"
            fill="none"
            stroke={CORES.verdeEscuro}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <Pressable
        style={styles.botaoEditar}
        onPress={onEditar}
        accessibilityRole="button"
        accessibilityLabel="Editar foto do perfil"
      >
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path
            d="m4 16.5-.8 4.3 4.3-.8L19.8 7.7a2.1 2.1 0 0 0-3-3L4 16.5Z"
            fill="none"
            stroke={CORES.texto}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="m15.5 6.5 3 3"
            fill="none"
            stroke={CORES.texto}
            strokeWidth="2"
          />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 112,
    height: 112,
    alignSelf: 'center',
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
  },
  botaoEditar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: CORES.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
