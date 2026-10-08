import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import BotaoVoltar from '../components/BotaoVoltar';
import InputCadastro from '../components/InputCadastro';
import { CORES } from '../components/telaInicial/tema';

export default function TelaAlterarSenha({ onVoltar }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tentouAlterar, setTentouAlterar] = useState(false);
  const [mostrarSaida, setMostrarSaida] = useState(false);
  const [alterada, setAlterada] = useState(false);

  const senhaValida =
    novaSenha.length >= 8 && /[a-zA-Z]/.test(novaSenha) && /\d/.test(novaSenha);
  const senhasDiferentes = tentouAlterar && novaSenha !== confirmarSenha;

  function alterarSenha() {
    setTentouAlterar(true);
    if (!senhaValida || novaSenha !== confirmarSenha) return;
    setAlterada(true);
  }

  function sairSemAlterar() {
    setMostrarSaida(false);
    onVoltar?.();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BotaoVoltar onPress={() => setMostrarSaida(true)} />
          <View style={styles.avatar}>
            <Svg width="100%" height="100%" viewBox="0 0 140 140">
              <Circle cx="70" cy="70" r="70" fill={CORES.verde} />
              <Circle cx="70" cy="55" r="18" fill="none" stroke={CORES.verdeEscuro} strokeWidth="8" />
              <Path d="M24 126c8-24 26-37 46-37s38 13 46 37" fill="none" stroke={CORES.verdeEscuro} strokeWidth="8" strokeLinecap="round" />
            </Svg>
          </View>

          <View style={styles.form}>
            <Text style={styles.titulo}>Insira a nova senha</Text>
            <Text style={styles.descricao}>
              Insira uma senha segura para proteger sua conta.
            </Text>
            <InputCadastro
              placeholder="Nova senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
              autoCapitalize="none"
              hasError={tentouAlterar && !senhaValida}
              containerStyle={styles.campo}
            />
            <Text style={[styles.requisito, senhaValida && styles.requisitoAtendido]}>
              {novaSenha.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
            </Text>
            <Text style={[styles.requisito, /[a-zA-Z]/.test(novaSenha) && /\d/.test(novaSenha) && styles.requisitoAtendido]}>
              {/[a-zA-Z]/.test(novaSenha) && /\d/.test(novaSenha) ? '✓' : '○'} Deve conter letras e números
            </Text>
            <InputCadastro
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              autoCapitalize="none"
              hasError={senhasDiferentes}
              containerStyle={styles.campoConfirmacao}
            />
            {senhasDiferentes && (
              <Text style={styles.erro}>As senhas não coincidem.</Text>
            )}
            {tentouAlterar && !senhaValida && (
              <Text style={styles.erro}>
                A senha deve ter pelo menos 8 caracteres e conter letras e números.
              </Text>
            )}
            <Pressable
              style={styles.botao}
              onPress={alterarSenha}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotao}>Trocar senha</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent
        visible={mostrarSaida || alterada}
        animationType="fade"
        onRequestClose={() => {
          setMostrarSaida(false);
          setAlterada(false);
        }}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modal}>
            {alterada ? (
              <Text style={styles.iconeSucesso}>✓</Text>
            ) : (
              <Svg
                width={34}
                height={34}
                viewBox="0 0 24 24"
                fill="none"
                stroke={CORES.verdeEscuro}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                accessibilityLabel="Sair sem alterar senha"
              >
                <Path d="M10 5H5v14h5" />
                <Path d="m13 8 4 4-4 4M17 12H9" />
              </Svg>
            )}
            <Text style={styles.tituloModal}>
              {alterada ? 'Senha alterada!' : 'Sair sem alterar senha?'}
            </Text>
            <Text style={styles.textoModal}>
              {alterada
                ? 'Sua nova senha foi confirmada.'
                : 'Você não terminou de alterar a sua senha.'}
            </Text>
            <View style={styles.acoesModal}>
              {alterada ? (
                <Pressable
                  style={styles.botaoModal}
                  onPress={() => {
                    setAlterada(false);
                    onVoltar?.();
                  }}
                >
                  <Text style={styles.textoBotaoModal}>Concluir</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    style={styles.botaoModal}
                    onPress={() => setMostrarSaida(false)}
                  >
                    <Text style={styles.textoBotaoModal}>Cancelar</Text>
                  </Pressable>
                  <Pressable style={styles.botaoModal} onPress={sairSemAlterar}>
                    <Text style={styles.textoBotaoModal}>Sair</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.branco },
  flex: { flex: 1 },
  conteudo: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 },
  avatar: {
    width: 112, height: 112, alignSelf: 'center', marginTop: 34, marginBottom: 42,
    borderRadius: 56, overflow: 'hidden',
  },
  form: { paddingHorizontal: 4 },
  titulo: { color: CORES.texto, fontSize: 16, fontFamily: 'Alexandria_700Bold' },
  descricao: {
    marginTop: 4, marginBottom: 12, color: CORES.textoSecundario,
    fontSize: 12, lineHeight: 17, fontFamily: 'Inter_400Regular',
  },
  campo: { marginBottom: 2 },
  campoConfirmacao: { marginTop: 8, marginBottom: 0 },
  requisito: {
    marginLeft: 10, color: CORES.textoSecundario, fontSize: 10,
    lineHeight: 15, fontFamily: 'Inter_400Regular',
  },
  requisitoAtendido: { color: CORES.verdeEscuro },
  erro: {
    marginTop: 4, color: '#C93640', fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  botao: {
    width: '76%', height: 46, alignSelf: 'center', marginTop: 16,
    borderRadius: 12, backgroundColor: CORES.verde,
    alignItems: 'center', justifyContent: 'center',
  },
  textoBotao: { color: CORES.branco, fontSize: 14, fontFamily: 'Alexandria_700Bold' },
  modalFundo: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, backgroundColor: 'rgba(13, 13, 13, 0.36)',
  },
  modal: {
    width: '100%', maxWidth: 380, alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 20, paddingBottom: 14,
    borderRadius: 16, backgroundColor: CORES.branco,
  },
  iconeSucesso: {
    height: 34, marginBottom: 14, color: CORES.verde,
    fontSize: 30, lineHeight: 34, fontFamily: 'Inter_700Bold',
  },
  tituloModal: {
    marginBottom: 3, color: CORES.texto, fontSize: 16,
    fontFamily: 'Alexandria_700Bold', textAlign: 'center',
  },
  textoModal: {
    marginBottom: 20, color: CORES.textoSecundario, fontSize: 10,
    fontFamily: 'Inter_400Regular', textAlign: 'center',
  },
  acoesModal: { width: '100%', flexDirection: 'row', gap: 10 },
  botaoModal: {
    flex: 1, height: 42, borderRadius: 12, backgroundColor: CORES.verde,
    alignItems: 'center', justifyContent: 'center',
  },
  textoBotaoModal: { color: CORES.branco, fontSize: 12, fontFamily: 'Inter_700Bold' },
});
