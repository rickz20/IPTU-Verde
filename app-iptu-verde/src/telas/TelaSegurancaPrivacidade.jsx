import { rem } from '../utils/typography';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import BotaoVoltar from '../components/BotaoVoltar';
import LogoIptuVerde from '../../assets/logo iptuverde.svg';
import { CORES } from '../components/telaInicial/tema';

function IconeEmail() {
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
      accessibilityLabel="E-mail"
    >
      <Rect x="3" y="5" width="18" height="14" rx="2" />
      <Path d="m3 7 9 6 9-6" />
    </Svg>
  );
}

function IconeSenha() {
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
      accessibilityLabel="Senha"
    >
      <Rect x="4" y="10" width="16" height="11" rx="2" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <Circle cx="12" cy="15" r="1" />
      <Path d="M12 16v2" />
    </Svg>
  );
}

export default function TelaSegurancaPrivacidade({
  onVoltar,
  onAlterarSenha,
  email,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <View style={styles.conteudo}>
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Segurança e privacidade</Text>
        </View>

        <View style={styles.lista}>
          <View style={styles.item}>
            <IconeEmail />
            <View style={styles.textosItem}>
              <Text style={styles.rotulo}>E-mail</Text>
              <Text style={styles.valor}>{email ?? 'Não informado'}</Text>
            </View>
          </View>

          <Pressable
            style={styles.item}
            onPress={onAlterarSenha}
            accessibilityRole="button"
            accessibilityLabel="Alterar senha"
            accessibilityHint="Abre a tela para trocar sua senha"
          >
            <IconeSenha />
            <View style={styles.textosItem}>
              <Text style={styles.rotulo}>Senha</Text>
              <Text style={styles.valor}>••••••••</Text>
            </View>
          </Pressable>
        </View>

        <LogoIptuVerde
          style={styles.logo}
          accessibilityLabel="IPTU Verde"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 26,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titulo: {
    flex: 1,
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Alexandria_700Bold',
  },
  lista: {
    marginTop: 24,
    gap: 18,
  },
  item: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  textosItem: {
    flex: 1,
    gap: 4,
  },
  rotulo: {
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_700Bold',
  },
  valor: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    lineHeight: rem(1.125),
    fontFamily: 'Inter_400Regular',
  },
  logo: {
    width: 120,
    height: 40,
    alignSelf: 'center',
    marginTop: 'auto',
  },
});
