import { rem } from '../../utils/typography';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { CORES } from './tema';

function IconeReciclagem() {
  return (
    <View style={styles.iconeContainer}>
      <Svg width={25} height={25} viewBox="0 0 24 24" fill="none">
        <Path
          d="m12 3 7.5 4.3v9.4L12 21l-7.5-4.3V7.3L12 3Z"
          stroke={CORES.branco}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <Path
          d="m4.8 7.5 7.2 4.2 7.2-4.2M12 12v8.5"
          stroke={CORES.branco}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function IconeLocalizacao() {
  return (
    <Svg width={12} height={15} viewBox="0 0 12 15" fill="none">
      <Path
        d="M6 14s5-5.1 5-8.4A5 5 0 0 0 1 5.6C1 8.9 6 14 6 14Z"
        fill={CORES.verdeEscuro}
      />
      <Circle cx="6" cy="5.5" r="1.7" fill={CORES.branco} />
    </Svg>
  );
}

export default function CardTodasColetas({ coleta }) {
  return (
    <View style={styles.card}>
      <IconeReciclagem />

      <View style={styles.detalhes}>
        <Text style={styles.titulo}>
          {coleta.quantidade} de {coleta.material} coletados!
        </Text>
        <Text style={styles.informacao}>
          Entrega por <Text style={styles.destaque}>{coleta.entregador}</Text>
        </Text>
        <Text style={styles.informacao}>
          Coleta realizada por{' '}
          <Text style={styles.destaque}>{coleta.responsavel}</Text>
        </Text>
        <View style={styles.linhaEndereco}>
          <IconeLocalizacao />
          <Text style={styles.endereco}>{coleta.endereco}</Text>
        </View>
      </View>

      <View style={styles.data}>
        <Text style={styles.textoData}>{coleta.data}</Text>
        <Text style={styles.textoData}>{coleta.horario}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 102,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 17,
    backgroundColor: CORES.cinza,
  },
  iconeContainer: {
    width: 28,
    height: 28,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: CORES.amarelo,
  },
  detalhes: {
    flex: 1,
    paddingTop: 2,
  },
  titulo: {
    marginBottom: 5,
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Alexandria_700Bold',
  },
  informacao: {
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  destaque: {
    fontFamily: 'Inter_700Bold',
  },
  linhaEndereco: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  endereco: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  data: {
    minWidth: 52,
    alignItems: 'flex-end',
  },
  textoData: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
});
