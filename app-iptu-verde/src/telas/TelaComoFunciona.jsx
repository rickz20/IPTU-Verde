import { rem } from '../utils/typography';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoVoltar from '../components/BotaoVoltar';
import { CORES } from '../components/telaInicial/tema';

const ETAPAS = [
  {
    numero: '1',
    titulo: 'Agende sua coleta',
    descricao:
      'Escolha um ponto de coleta, a data e o horário disponíveis no aplicativo.',
  },
  {
    numero: '2',
    titulo: 'Separe os materiais',
    descricao:
      'Informe os materiais que serão entregues e leve-os limpos e separados.',
  },
  {
    numero: '3',
    titulo: 'Acompanhe seu progresso',
    descricao:
      'Após a coleta ser registrada e o peso informado, os dados entram no seu progresso anual.',
  },
];

const FAIXAS = [
  { percentual: '3%', requisito: '2 coletas e 20 kg' },
  { percentual: '6%', requisito: '4 coletas e 50 kg' },
  { percentual: '9%', requisito: '6 coletas e 100 kg' },
  { percentual: '12%', requisito: '8 coletas e 180 kg' },
  { percentual: '15%', requisito: '10 coletas e 300 kg' },
];

export default function TelaComoFunciona({ onVoltar }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Como funciona?</Text>
        </View>

        <Text style={styles.introducao}>
          O IPTU Verde ajuda você a acompanhar suas coletas de materiais
          recicláveis e o progresso para alcançar as faixas de desconto.
        </Text>

        <Text style={styles.tituloSecao}>Faça assim</Text>
        <View style={styles.listaEtapas}>
          {ETAPAS.map((etapa) => (
            <View key={etapa.numero} style={styles.cartaoEtapa}>
              <View style={styles.numeroEtapa}>
                <Text style={styles.textoNumero}>{etapa.numero}</Text>
              </View>
              <View style={styles.textoEtapa}>
                <Text style={styles.tituloEtapa}>{etapa.titulo}</Text>
                <Text style={styles.descricao}>{etapa.descricao}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.tituloSecao}>Faixas de progresso</Text>
        <Text style={styles.descricaoFaixas}>
          Cada faixa exige que você alcance os dois requisitos no mesmo ano:
          quantidade de coletas e peso total.
        </Text>
        <View style={styles.listaFaixas}>
          {FAIXAS.map((faixa) => (
            <View key={faixa.percentual} style={styles.linhaFaixa}>
              <Text style={styles.percentual}>{faixa.percentual}</Text>
              <Text style={styles.requisito}>{faixa.requisito}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.aviso}>
          O percentual exibido no aplicativo representa o progresso calculado
          com base nas coletas registradas. A concessão de desconto no IPTU
          depende da regulamentação e validação oficial do município.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  titulo: {
    color: CORES.texto,
    fontSize: rem(1.25),
    fontFamily: 'Alexandria_700Bold',
  },
  introducao: {
    marginBottom: 24,
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.5),
    fontFamily: 'Inter_400Regular',
  },
  tituloSecao: {
    marginBottom: 12,
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  listaEtapas: {
    gap: 12,
    marginBottom: 26,
  },
  cartaoEtapa: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: CORES.cinza,
  },
  numeroEtapa: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CORES.verde,
  },
  textoNumero: {
    color: CORES.branco,
    fontSize: rem(1),
    fontFamily: 'Alexandria_700Bold',
  },
  textoEtapa: {
    flex: 1,
    gap: 4,
  },
  tituloEtapa: {
    color: CORES.texto,
    fontSize: rem(1),
    fontFamily: 'Alexandria_700Bold',
  },
  descricao: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  descricaoFaixas: {
    marginBottom: 12,
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  listaFaixas: {
    gap: 8,
    marginBottom: 18,
  },
  linhaFaixa: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: CORES.cinza,
  },
  percentual: {
    width: 44,
    color: CORES.verdeEscuro,
    fontSize: rem(1),
    fontFamily: 'Alexandria_700Bold',
  },
  requisito: {
    flex: 1,
    color: CORES.texto,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  aviso: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFF8E8',
    color: CORES.textoSecundario,
    fontSize: rem(0.75),
    lineHeight: rem(1.125),
    fontFamily: 'Inter_400Regular',
  },
});
