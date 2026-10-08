import { useState } from 'react';
import {
  Image,
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
  const [tentouTrocar, setTentouTrocar] = useState(false);
  const [mostrarSair, setMostrarSair] = useState(false);
  const [senhaAlterada, setSenhaAlterada] = useState(false);

  const temOitoCaracteres = novaSenha.length >= 8;
  const temLetrasENumeros = /[a-zA-Z]/.test(novaSenha) && /\d/.test(novaSenha);
  const senhasDiferentes = tentouTrocar && novaSenha !== confirmarSenha;

  function tentarTrocarSenha() {
    setTentouTrocar(true);
    if (!temOitoCaracteres || !temLetrasENumeros || novaSenha !== confirmarSenha) {
      return;
    }

    setSenhaAlterada(true);
  }

  function sairSemAlterar() {
    setMostrarSair(false);
    onVoltar?.();
  }

  function concluirAlteracao() {
    setSenhaAlterada(false);
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
          <BotaoVoltar
            onPress={() => setMostrarSair(true)}
            accessibilityLabel="Voltar. A alteração de senha não foi concluída."
          />

          <View style={styles.avatar}>
            <Svg width="100%" height="100%" viewBox="0 0 140 140">
              <Circle cx="70" cy="70" r="70" fill={CORES.verde} />
              <Circle
                cx="70"
                cy="55"
                r="18"
                fill="none"
                stroke={CORES.verdeEscuro}
                strokeWidth="8"
              />
              <Path
                d="M24 126c8-24 26-37 46-37s38 13 46 37"
                fill="none"
                stroke={CORES.verdeEscuro}
                strokeWidth="8"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          <View style={styles.formulario}>
            <Text style={styles.titulo}>Insira a nova senha</Text>
            <Text style={styles.descricao}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>

            <InputCadastro
              placeholder="Nova senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
              hasError={tentouTrocar && (!temOitoCaracteres || !temLetrasENumeros)}
              containerStyle={styles.campoSenha}
            />

            {tentouTrocar && (!temOitoCaracteres || !temLetrasENumeros) && (
              <Text style={styles.erro}>
                A senha deve atender aos requisitos abaixo.
              </Text>
            )}

            <View style={styles.requisitos}>
              <Text style={[styles.requisito, temOitoCaracteres && styles.requisitoAtendido]}>
                {temOitoCaracteres ? '✓' : '○'} Mínimo 8 caracteres
              </Text>
              <Text style={[styles.requisito, temLetrasENumeros && styles.requisitoAtendido]}>
                {temLetrasENumeros ? '✓' : '○'} Deve conter letras e números
              </Text>
            </View>

            <InputCadastro
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
              hasError={senhasDiferentes}
              containerStyle={styles.campoSenha}
            />

            {senhasDiferentes && (
              <Text style={styles.erro}>As senhas não coincidem.</Text>
            )}

            <Pressable
              style={styles.botaoTrocar}
              onPress={tentarTrocarSenha}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotaoTrocar}>Trocar senha</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent
        visible={mostrarSair || senhaAlterada}
        animationType="fade"
        onRequestClose={() => {
          setMostrarSair(false);
          setSenhaAlterada(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {senhaAlterada ? (
              <Text style={styles.iconeSucesso} accessibilityLabel="Sucesso">
                ✓
              </Text>
            ) : (
              <Image
                source={require('../../assets/Log out.png')}
                style={styles.modalIcon}
                resizeMode="contain"
                accessibilityLabel="Sair sem alterar senha"
              />
            )}
            <Text style={styles.modalTitulo}>
              {senhaAlterada ? 'Senha alterada!' : 'Sair sem alterar senha?'}
            </Text>
            <Text style={styles.modalDescricao}>
              {senhaAlterada
                ? 'Sua nova senha foi confirmada.'
                : 'Você não terminou de alterar a sua senha.'}
            </Text>

            <View style={styles.modalBotoes}>
              {senhaAlterada ? (
                <Pressable
                  style={styles.modalBotao}
                  onPress={concluirAlteracao}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalTextoBotao}>Concluir</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    style={styles.modalBotao}
                    onPress={() => setMostrarSair(false)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.modalTextoBotao}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalBotao}
                    onPress={sairSemAlterar}
                    accessibilityRole="button"
                  >
                    <Text style={styles.modalTextoBotao}>Sair</Text>
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
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 32,
  },
  avatar: {
    width: 112,
    height: 112,
    alignSelf: 'center',
    marginTop: 34,
    marginBottom: 48,
    borderRadius: 56,
    overflow: 'hidden',
  },
  formulario: {
    paddingHorizontal: 10,
  },
  titulo: {
    color: CORES.texto,
    fontSize: 16,
    fontFamily: 'Alexandria_700Bold',
  },
  descricao: {
    color: CORES.textoSecundario,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
    marginBottom: 12,
  },
  campoSenha: {
    marginBottom: 0,
  },
  requisitos: {
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
    gap: 2,
  },
  requisito: {
    color: CORES.textoSecundario,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Inter_400Regular',
  },
  requisitoAtendido: {
    color: CORES.verdeEscuro,
  },
  erro: {
    color: '#C93640',
    fontSize: 10,
    marginTop: 4,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  botaoTrocar: {
    height: 46,
    width: '76%',
    alignSelf: 'center',
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: CORES.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoTrocar: {
    color: CORES.branco,
    fontSize: 14,
    fontFamily: 'Alexandria_700Bold',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 13, 13, 0.36)',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: CORES.branco,
    borderRadius: 16,
  },
  modalIcon: {
    width: 34,
    height: 34,
    marginBottom: 14,
  },
  iconeSucesso: {
    height: 34,
    marginBottom: 14,
    color: CORES.verde,
    fontSize: 30,
    lineHeight: 34,
    fontFamily: 'Inter_700Bold',
  },
  modalTitulo: {
    color: CORES.texto,
    fontSize: 16,
    fontFamily: 'Alexandria_700Bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  modalDescricao: {
    color: CORES.textoSecundario,
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBotoes: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
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
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
});
