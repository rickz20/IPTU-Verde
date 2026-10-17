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

const DADOS_PESSOAIS = [
  ['Nome', 'Cecílio Alencar'],
  ['CPF', '*********00-05'],
  ['Estado civil', 'Casado'],
  ['E-mail', 'emaildefulano@gmail.com'],
  ['Telefone', '(00) 00000-0000'],
];

export default function TelaMeusDados({ onVoltar }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Meus dados</Text>
        </View>
        <Text style={styles.tituloSecao}>Dados pessoais</Text>
        <View style={styles.lista}>
          {DADOS_PESSOAIS.map(([rotulo, valor]) => (
            <View key={rotulo} style={styles.item}>
              <Text style={styles.rotulo}>{rotulo}</Text>
              <Text style={styles.valor}>{valor}</Text>
            </View>
          ))}
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
  tituloSecao: {
    marginTop: 38,
    marginBottom: 16,
    color: CORES.texto,
    fontSize: rem(1.25),
    fontFamily: 'Alexandria_700Bold',
  },
  lista: {
    gap: 12,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: CORES.cinza,
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
