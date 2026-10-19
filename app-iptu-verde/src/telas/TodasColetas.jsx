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
import EstadoApi from '../components/EstadoApi';
import { CORES } from '../components/telaInicial/tema';
import { useApiData } from '../hooks/useApiData';

export default function TodasColetas({ onVoltar, token }) {
  const {
    data: coletas,
    error,
    loading,
    retry,
  } = useApiData('/coletas', 'coletas', token, Boolean(token));

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
          <EstadoApi
            loading={loading}
            error={error}
            empty={!loading && !error && coletas.length === 0}
            onRetry={retry}
            emptyMessage="Você ainda não tem coletas registradas."
          />
          {!loading && !error
            ? coletas.map((coleta) => (
                <CardTodasColetas key={coleta.id} coleta={coleta} />
              ))
            : null}
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
