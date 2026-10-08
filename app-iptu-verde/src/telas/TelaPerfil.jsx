import { useState } from 'react';
import {
  Modal,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
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
  onAlterarSenha,
}) {
  const router = useRouter();
  const [abaSelecionada, setAbaSelecionada] = useState('perfil');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function selecionarAba(aba) {
    setAbaSelecionada(aba);
    onSelecionarAba?.(aba);
  }

  function handleSair() {
    setShowLogoutModal(false);
    router.replace('/');
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
              onPress={
                opcao.id === 'meus-dados'
                  ? onMeusDados
                  : opcao.id === 'meus-imoveis'
                    ? onMeusImoveis
                    : opcao.id === 'alterar-senha'
                      ? onAlterarSenha
                    : opcao.id === 'sair'
                      ? () => setShowLogoutModal(true)
                      : undefined
              }
            />
          ))}
        </View>
      </ScrollView>

      <MenuInferior
        selecionado={abaSelecionada}
        onSelecionar={selecionarAba}
      />

      <Modal transparent visible={showLogoutModal} animationType="fade">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowLogoutModal(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalIcon}>
              <Image
                source={require('../../assets/Log out.png')}
                style={styles.modalIconImage}
                resizeMode="contain"
                accessibilityLabel="Sair da conta"
              />
            </View>

            <Text style={styles.modalTitle}>Sair da conta?</Text>
            <Text style={styles.modalText}>
              {"Tem certeza de que deseja sair da sua conta?\nVocê poderá voltar sempre que quiser."}
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.primaryButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.primaryButton} onPress={handleSair}>
                <Text style={styles.primaryButtonText}>Sair</Text>
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
    fontSize: 16,
    fontFamily: 'Alexandria_700Bold',
  },
  opcoes: {
    gap: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 13, 13, 0.25)',
  },
  modalCard: {
    width: '82%',
    maxWidth: 380,
    backgroundColor: CORES.branco,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
  },
  modalIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F4F0E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  modalIconImage: {
    width: 36,
    height: 36,
  },
  modalTitle: {
    fontSize: 22,
    color: CORES.texto,
    fontFamily: 'Alexandria_700Bold',
    marginBottom: 8,
  },
  modalText: {
    color: CORES.texto,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    marginBottom: 20,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 14,
  },
  primaryButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: CORES.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: CORES.branco,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
