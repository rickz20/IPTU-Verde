import { rem } from '../utils/typography';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AvatarPerfil from '../components/AvatarPerfil';
import OpcaoPerfil from '../components/OpcaoPerfil';
import MenuInferior from '../components/telaInicial/MenuInferior';
import { CORES } from '../components/telaInicial/tema';

const OPCOES_PERFIL = [
  { id: 'meus-dados', titulo: 'Meus dados', icone: 'usuario' },
  { id: 'meus-imoveis', titulo: 'Meus imóveis', icone: 'imoveis' },
  {
    id: 'seguranca-privacidade',
    titulo: 'Segurança e privacidade',
    icone: 'seguranca',
  },
  { id: 'ajuda-suporte', titulo: 'Ajuda e suporte', icone: 'ajuda' },
  { id: 'alterar-senha', titulo: 'Alterar senha', icone: 'senha', destaque: true },
  { id: 'sair', titulo: 'Sair', icone: 'sair', destaque: true },
];

export default function TelaPerfil({
  onSelecionarAba,
  onMeusDados,
  onMeusImoveis,
  onSeguranca,
  onAjuda,
  onAlterarSenha,
  onSair,
}) {
  const [abaSelecionada, setAbaSelecionada] = useState('perfil');
  const [mostrarConfirmacaoSaida, setMostrarConfirmacaoSaida] = useState(false);

  function selecionarAba(aba) {
    setAbaSelecionada(aba);
    onSelecionarAba?.(aba);
  }

  function selecionarOpcao(id) {
    const acoes = {
      'meus-dados': onMeusDados,
      'meus-imoveis': onMeusImoveis,
      'seguranca-privacidade': onSeguranca,
      'ajuda-suporte': onAjuda,
      'alterar-senha': onAlterarSenha,
    };

    if (id === 'sair') {
      setMostrarConfirmacaoSaida(true);
      return;
    }

    acoes[id]?.();
  }

  function confirmarSaida() {
    setMostrarConfirmacaoSaida(false);
    onSair?.();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.perfil}>
          <AvatarPerfil />
          <Text style={styles.nome}>Fulano da Silva</Text>
        </View>

        <View style={styles.opcoes}>
          {OPCOES_PERFIL.map((opcao) => (
            <OpcaoPerfil
              key={opcao.id}
              titulo={opcao.titulo}
              icone={opcao.icone}
              destaque={opcao.destaque}
              onPress={() => selecionarOpcao(opcao.id)}
            />
          ))}
        </View>
      </ScrollView>

      <MenuInferior
        selecionado={abaSelecionada}
        onSelecionar={selecionarAba}
      />

      <Modal
        transparent
        visible={mostrarConfirmacaoSaida}
        animationType="fade"
        onRequestClose={() => setMostrarConfirmacaoSaida(false)}
      >
        <Pressable
          style={styles.modalFundo}
          onPress={() => setMostrarConfirmacaoSaida(false)}
        >
          <Pressable style={styles.modalCartao} onPress={() => {}}>
            <Svg
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              stroke={CORES.verdeEscuro}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={styles.modalIcone}
              accessibilityLabel="Sair da conta"
            >
              <Path d="M10 5H5v14h5" />
              <Path d="m13 8 4 4-4 4M17 12H9" />
            </Svg>
            <Text style={styles.modalTitulo}>Sair da conta?</Text>
            <Text style={styles.modalDescricao}>
              Tem certeza de que deseja sair da sua conta?
            </Text>
            <View style={styles.modalAcoes}>
              <Pressable
                style={styles.modalBotao}
                onPress={() => setMostrarConfirmacaoSaida(false)}
                accessibilityRole="button"
              >
                <Text style={styles.modalTextoBotao}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.modalBotao}
                onPress={confirmarSaida}
                accessibilityRole="button"
              >
                <Text style={styles.modalTextoBotao}>Sair</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    paddingTop: 18,
    paddingBottom: 24,
  },
  perfil: {
    alignItems: 'center',
    marginTop: 96,
    marginBottom: 64,
  },
  nome: {
    marginTop: 16,
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  opcoes: {
    gap: 8,
  },
  modalFundo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(13, 13, 13, 0.36)',
  },
  modalCartao: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    borderRadius: 18,
    backgroundColor: CORES.branco,
  },
  modalIcone: {
    width: 36,
    height: 36,
    marginBottom: 14,
  },
  modalTitulo: {
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
    marginBottom: 5,
  },
  modalDescricao: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalAcoes: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  modalBotao: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: CORES.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTextoBotao: {
    color: CORES.branco,
    fontSize: rem(1),
    fontFamily: 'Inter_700Bold',
  },
});
