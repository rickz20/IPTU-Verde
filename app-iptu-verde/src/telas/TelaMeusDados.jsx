import { rem } from '../utils/typography';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import BotaoVoltar from '../components/BotaoVoltar';
import EstadoApi from '../components/EstadoApi';
import InformacaoPessoal from '../components/perfil/InformacaoPessoal';
import { CORES } from '../components/telaInicial/tema';
import { useApiData } from '../hooks/useApiData';

export default function TelaMeusDados({
  onVoltar,
  onAlterarDados,
  onAlterarSenha,
  sessao,
  token,
}) {
  const {
    data: usuarioApi,
    error,
    loading,
    retry,
  } = useApiData('/auth/me', 'usuario', token, Boolean(token));
  const usuario = usuarioApi?.id ? usuarioApi : sessao?.usuario;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Meus dados</Text>
        </View>

        <View style={styles.cartao}>
          <View style={styles.tituloCartao}>
            <IconePessoa />
            <Text style={styles.textoTituloCartao}>Dados pessoais</Text>
          </View>

          <View style={styles.informacoes}>
            <InformacaoPessoal
              titulo="Nome"
              valor={usuario?.nome || 'Não informado'}
            />
            <InformacaoPessoal
              titulo="CPF"
              valor={formatarCpf(usuario?.cpf) || 'Não informado'}
            />
            <InformacaoPessoal
              titulo="Estado civil"
              valor={
                usuario?.estadoCivil ??
                usuario?.estado_civil ??
                'Não informado'
              }
            />
            <InformacaoPessoal
              titulo="Telefone"
              valor={formatarTelefone(usuario?.telefone) || 'Não informado'}
            />
          </View>

          {loading || error ? (
            <EstadoApi
              loading={loading}
              error={error}
              onRetry={retry}
            />
          ) : null}

          <AcaoCartao titulo="Alterar dados" onPress={onAlterarDados} />
        </View>

        <View style={styles.cartao}>
          <View style={styles.tituloCartao}>
            <IconeCadeado />
            <Text style={styles.textoTituloCartao}>
              Segurança e privacidade
            </Text>
          </View>

          <View style={styles.informacoes}>
            <InformacaoPessoal
              titulo="E-mail"
              valor={usuario?.email || 'Não informado'}
            />
            <InformacaoPessoal titulo="Senha" valor="********" />
          </View>

          <AcaoCartao titulo="Alterar senha" onPress={onAlterarSenha} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AcaoCartao({ titulo, onPress }) {
  return (
    <Pressable
      style={styles.acao}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titulo}
    >
      <Text style={styles.textoAcao}>{titulo}</Text>
      <Text style={styles.setaAcao}>›</Text>
    </Pressable>
  );
}

function IconePessoa() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={CORES.texto}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityLabel="Dados pessoais"
    >
      <Circle cx="12" cy="8" r="3.5" />
      <Path d="M5 21v-2a7 7 0 0 1 14 0v2" />
    </Svg>
  );
}

function IconeCadeado() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={CORES.texto}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityLabel="Segurança e privacidade"
    >
      <Rect x="4" y="10" width="16" height="11" rx="2" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </Svg>
  );
}

function formatarCpf(cpf) {
  if (typeof cpf !== 'string') return '';
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return '';
  return `***.***.***-${digits.slice(-2)}`;
}

function formatarTelefone(telefone) {
  if (typeof telefone !== 'string') return '';
  const digits = telefone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return telefone;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  titulo: {
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  cartao: {
    marginBottom: 14,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    borderRadius: 16,
    backgroundColor: CORES.cinza,
  },
  tituloCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  textoTituloCartao: {
    flex: 1,
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  informacoes: {
    paddingLeft: 24,
    gap: 2,
  },
  acao: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 36,
    marginTop: 10,
    marginLeft: 24,
  },
  textoAcao: {
    color: CORES.verdeEscuro,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
  setaAcao: {
    color: CORES.verdeEscuro,
    fontSize: rem(1.375),
    lineHeight: rem(1.5),
    fontFamily: 'Inter_400Regular',
  },
});
