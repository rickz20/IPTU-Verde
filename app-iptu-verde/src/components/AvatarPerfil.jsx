import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { CORES } from './telaInicial/tema';

export default function AvatarPerfil() {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 112,
    height: 112,
    alignSelf: 'center',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
  },
});
