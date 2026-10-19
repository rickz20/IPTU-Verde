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
import EstadoApi from '../components/EstadoApi';
import { CORES } from '../components/telaInicial/tema';
import { useApiData } from '../hooks/useApiData';

export default function TelaMeusDados({ onVoltar, token }) {
  const {
    data: usuario,
    error,
    loading,
    retry,
  } = useApiData('/auth/me', 'usuario', token, Boolean(token));
  const dados = usuario?.id
    ? [
        ['Nome', usuario.nome],
        ['CPF', formatarCpf(usuario.cpf)],
        ['E-mail', usuario.email],
        ['Telefone', usuario.telefone],
      ]
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Meus dados</Text>
        </View>
        <Text style={styles.tituloSecao}>Dados pessoais</Text>
        <EstadoApi
          loading={loading}
          error={error}
          empty={!loading && !error && dados.length === 0}
          onRetry={retry}
          emptyMessage="Não foi possível carregar seus dados."
        />
        <View style={styles.lista}>
          {!loading && !error
            ? dados.map(([rotulo, valor]) => (
                <View key={rotulo} style={styles.item}>
                  <Text style={styles.rotulo}>{rotulo}</Text>
                  <Text style={styles.valor}>{valor || 'Não informado'}</Text>
                </View>
              ))
            : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatarCpf(cpf) {
  if (typeof cpf !== 'string') return '';
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return `***.***.***-${digits.slice(-2)}`;
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
