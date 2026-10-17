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
import CardTodasColetas from '../components/telaInicial/CardTodasColetas';
import { todasColetas } from '../components/telaInicial/dados';
import { CORES } from '../components/telaInicial/tema';

export default function TodasColetas({ onVoltar }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <View style={styles.textosCabecalho}>
            <Text style={styles.titulo}>Todas as coletas</Text>
            <Text style={styles.subtitulo}>
              Veja os dados das suas últimas coletas realizadas
            </Text>
          </View>
        </View>

        <View style={styles.lista}>
          {todasColetas.map((coleta) => (
            <CardTodasColetas key={coleta.id} coleta={coleta} />
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
  scroll: {
    flex: 1,
  },
  conteudo: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  cabecalho: {
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textosCabecalho: {
    flex: 1,
  },
  titulo: {
    color: CORES.texto,
    fontSize: rem(1.125),
    lineHeight: rem(1.5),
    fontFamily: 'Alexandria_700Bold',
  },
  subtitulo: {
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  lista: {
    gap: 8,
  },
});
