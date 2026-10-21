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

export default function TelaAjudaSuporte({ onVoltar }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Ajuda e suporte</Text>
        </View>

        <View style={styles.opcoes}>
          <CartaoAjuda
            titulo="Perguntas frequentes"
            descricao="Acesse nossa central de dúvidas."
            tipo="perguntas"
          />
          <CartaoAjuda
            titulo="Canais de atendimento"
            descricao="Fale com um de nossos atendentes."
            tipo="atendimento"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CartaoAjuda({ titulo, descricao, tipo }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.linhaTitulo}>
        {tipo === 'perguntas' ? <IconePergunta /> : <IconeTelefone />}
        <Text style={styles.tituloCartao}>{titulo}</Text>
        <Text style={styles.seta}>›</Text>
      </View>
      <Text style={styles.descricaoCartao}>{descricao}</Text>
    </View>
  );
}

function IconePergunta() {
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
      accessibilityLabel="Perguntas frequentes"
    >
      <Path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
    </Svg>
  );
}

function IconeTelefone() {
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
      accessibilityLabel="Canais de atendimento"
    >
      <Path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </Svg>
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
  opcoes: {
    gap: 14,
  },
  cartao: {
    minHeight: 82,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: CORES.cinza,
  },
  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tituloCartao: {
    flex: 1,
    color: CORES.texto,
    fontSize: rem(1.0625),
    fontFamily: 'Alexandria_700Bold',
  },
  seta: {
    color: CORES.textoSecundario,
    fontSize: rem(1.5),
    lineHeight: rem(1.5),
    fontFamily: 'Inter_400Regular',
  },
  descricaoCartao: {
    marginTop: 4,
    marginLeft: 28,
    color: CORES.textoSecundario,
    fontSize: rem(0.75),
    lineHeight: rem(1),
    fontFamily: 'Inter_400Regular',
  },
});
