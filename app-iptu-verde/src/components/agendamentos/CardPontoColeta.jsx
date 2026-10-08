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
    minHeight: 200,
    padding: 12,
    borderRadius: 18,
    backgroundColor: CORES.cinza,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  mapa: {
    flex: 1,
    minHeight: 164,
    borderWidth: 2,
    borderColor: '#969188',
    borderRadius: 8,
    overflow: 'hidden',
  },
  informacoes: {
    flex: 1.05,
    justifyContent: 'center',
  },
  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  iconeLocalizacao: {
    fontSize: 15,
    color: CORES.verdeEscuro,
  },
  nome: {
    flex: 1,
    color: '#111111',
    fontSize: 14,
    fontFamily: 'Alexandria_700Bold',
  },
  endereco: {
    color: '#111111',
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Inter_700Bold',
  },
  cidade: {
    marginTop: 2,
    color: CORES.textoSecundario,
    fontSize: 9,
    lineHeight: 11,
    fontFamily: 'Inter_400Regular',
  },
  referencia: {
    color: CORES.textoSecundario,
    fontSize: 9,
    lineHeight: 11,
    fontFamily: 'Inter_400Regular',
  },
  subtituloHorario: {
    marginTop: 5,
    color: '#111111',
    fontSize: 10,
    lineHeight: 13,
    fontFamily: 'Inter_700Bold',
  },
  horario: {
    color: CORES.textoSecundario,
    fontSize: 9,
    lineHeight: 12,
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
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
