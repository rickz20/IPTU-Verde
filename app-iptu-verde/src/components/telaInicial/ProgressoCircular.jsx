import { rem } from '../../utils/typography';
import { StyleSheet, Text, View } from 'react-native';
import { CORES } from './tema';

export default function ProgressoCircular({ percentual = 10 }) {
  return (
    <View style={styles.circulo}>
      <View style={styles.circuloInterior}>
        <Text style={styles.porcentagem}>{percentual}%</Text>
        <Text style={styles.textoDesconto}>
          desconto já
          {'\n'}
          garantido
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 9,
    borderColor: CORES.verde,
    borderLeftColor: '#DDDDDD',
    borderTopColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloInterior: {
    alignItems: 'center',
  },
  porcentagem: {
    fontSize: rem(1.625),
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
