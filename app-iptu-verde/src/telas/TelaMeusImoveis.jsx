import { rem } from '../utils/typography';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import BotaoVoltar from '../components/BotaoVoltar';
import { CORES } from '../components/telaInicial/tema';

const DADOS_IMOVEL = [
  ['Endereço', 'Rua Exemplo, 123'],
  ['Bairro', 'Centro'],
  ['Cidade', 'Quixadá - CE'],
  ['Inscrição imobiliária', '000000000'],
  ['Tipo de imóvel', 'Residencial'],
];

export default function TelaMeusImoveis({ onVoltar }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Meus imóveis</Text>
        </View>

        <View style={styles.cartao}>
          <View style={styles.iconeCasa}>
            <Svg width={28} height={28} viewBox="0 0 24 24">
              <Path
                d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"
                fill="none"
                stroke={CORES.verdeEscuro}
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.tituloCartao}>Imóvel cadastrado</Text>
          <View style={styles.lista}>
            {DADOS_IMOVEL.map(([rotulo, valor]) => (
              <View key={rotulo} style={styles.item}>
                <Text style={styles.rotulo}>{rotulo}</Text>
                <Text style={styles.valor}>{valor}</Text>
              </View>
            ))}
          </View>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  titulo: {
    color: CORES.texto,
    fontSize: rem(1.25),
    fontFamily: 'Alexandria_700Bold',
  },
  cartao: {
    marginTop: 34,
    padding: 18,
    borderRadius: 16,
    backgroundColor: CORES.cinza,
  },
  iconeCasa: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: CORES.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloCartao: {
    marginTop: 14,
    marginBottom: 16,
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  lista: {
    gap: 14,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: CORES.cinzaMedio,
    paddingBottom: 10,
  },
  rotulo: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    fontFamily: 'Inter_400Regular',
  },
  valor: {
    marginTop: 4,
    color: CORES.texto,
    fontSize: rem(1),
    fontFamily: 'Inter_700Bold',
  },
});
