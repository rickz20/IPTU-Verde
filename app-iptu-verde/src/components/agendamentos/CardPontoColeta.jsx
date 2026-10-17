import { rem } from '../../utils/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapaPontoColeta from './MapaPontoColeta';
import { CORES } from '../telaInicial/tema';

export default function CardPontoColeta({ ponto, onAgendar = () => {} }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.mapa}>
        <MapaPontoColeta />
      </View>

      <View style={styles.informacoes}>
        <View style={styles.tituloLinha}>
          <Text style={styles.iconeLocalizacao}>●</Text>
          <Text style={styles.nome}>{ponto.nome}</Text>
        </View>

        <Text style={styles.endereco}>{ponto.endereco}</Text>
        <Text style={styles.cidade}>{ponto.cidade}</Text>
        <Text style={styles.referencia}>{ponto.referencia}</Text>

        <Text style={styles.subtituloHorario}>Horários de funcionamento</Text>
        <Text style={styles.horario}>{ponto.horario}</Text>

        <Pressable
          style={styles.botaoAgendar}
          onPress={() => onAgendar(ponto)}
          accessibilityRole="button"
          accessibilityLabel={`Agendar coleta em ${ponto.nome}`}
        >
          <Text style={styles.textoBotao}>Agendar Coleta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    minHeight: 220,
    padding: 12,
    borderRadius: 18,
    backgroundColor: CORES.cinza,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
  },
  mapa: {
    width: '100%',
    height: 170,
    borderWidth: 2,
    borderColor: '#969188',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  informacoes: {
    flex: 1,
    justifyContent: 'center',
  },
  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  iconeLocalizacao: {
    fontSize: rem(1),
    color: CORES.verdeEscuro,
  },
  nome: {
    flex: 1,
    color: '#111111',
    fontSize: rem(1),
    fontFamily: 'Alexandria_700Bold',
  },
  endereco: {
    color: '#111111',
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_700Bold',
  },
  cidade: {
    marginTop: 2,
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  referencia: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  subtituloHorario: {
    marginTop: 5,
    color: '#111111',
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_700Bold',
  },
  horario: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  botaoAgendar: {
    minHeight: 38,
    marginTop: 16,
    borderRadius: 9,
    backgroundColor: CORES.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotao: {
    color: CORES.branco,
    fontSize: rem(1),
    fontFamily: 'Inter_700Bold',
  },
});
