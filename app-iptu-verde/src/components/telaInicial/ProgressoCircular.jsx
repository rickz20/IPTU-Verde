import { rem } from '../../utils/typography';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CORES } from './tema';

const RAIO = 38;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export default function ProgressoCircular({ percentual = null }) {
  const percentualValido =
    typeof percentual === 'number'
      ? Math.min(100, Math.max(0, percentual))
      : null;

  return (
    <View style={styles.circulo}>
      <Svg width={94} height={94} style={StyleSheet.absoluteFill}>
        <Circle
          cx="47"
          cy="47"
          r={RAIO}
          fill="none"
          stroke="#DDDDDD"
          strokeWidth="9"
        />
        {percentualValido !== null && percentualValido > 0 ? (
          <Circle
            cx="47"
            cy="47"
            r={RAIO}
            fill="none"
            stroke={CORES.verde}
            strokeWidth="9"
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={
              CIRCUNFERENCIA * (1 - percentualValido / 100)
            }
            strokeLinecap="round"
            rotation="-90"
            origin="47, 47"
          />
        ) : null}
      </Svg>
      <View style={styles.circuloInterior}>
        <Text style={styles.porcentagem}>
          {percentualValido === null ? '--%' : `${percentualValido}%`}
        </Text>
        <Text style={styles.textoDesconto}>
          desconto
          {'\n'}
          calculado
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    width: 94,
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloInterior: {
    alignItems: 'center',
  },
  porcentagem: {
    fontSize: rem(1.375),
    color: CORES.texto,
    fontFamily: 'Alexandria_700Bold',
  },
  textoDesconto: {
    fontSize: rem(0.75),
    lineHeight: rem(0.875),
    textAlign: 'center',
    color: CORES.texto,
    fontFamily: 'Inter_400Regular',
  },
});
