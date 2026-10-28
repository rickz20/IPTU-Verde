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
import BotaoVoltar from '../components/BotaoVoltar';
import EstadoApi from '../components/EstadoApi';
import InputCadastro from '../components/InputCadastro';
import { CORES } from '../components/telaInicial/tema';
import { useApiData } from '../hooks/useApiData';
import { apiRequest } from '../services/api';

const OPCOES_ESTADO_CIVIL = [
  'Solteiro(a)',
  'Casado(a)',
  'União estável',
  'Separado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'Prefiro não informar',
];

export default function TelaEditarDados({ onVoltar, token }) {
  const {
    data: usuario,
    error,
    loading,
    retry,
  } = useApiData('/auth/me', 'usuario', token, Boolean(token));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Alterar dados</Text>
        </View>

        <Text style={styles.descricao}>
          Atualize seu nome, estado civil e telefone de contato.
        </Text>

        {loading || error ? (
          <EstadoApi
            loading={loading}
            error={error}
            onRetry={retry}
          />
        ) : usuario?.id ? (
          <FormularioEdicao
            key={usuario.id}
            usuario={usuario}
            token={token}
            onVoltar={onVoltar}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function FormularioEdicao({ usuario, token, onVoltar }) {
  const [nome, setNome] = useState(usuario.nome ?? '');
  const [estadoCivil, setEstadoCivil] = useState(
    usuario.estadoCivil ?? usuario.estado_civil ?? '',
  );
  const [mostrarOpcoesEstadoCivil, setMostrarOpcoesEstadoCivil] =
    useState(false);
  const [telefone, setTelefone] = useState(usuario.telefone ?? '');
  const [erroFormulario, setErroFormulario] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvarDados() {
    setErroFormulario('');
    if (nome.trim().length < 2 || nome.trim().length > 120) {
      setErroFormulario('Informe um nome válido.');
      return;
    }

    const telefoneDigits = telefone.replace(/\D/g, '');
    if (![10, 11].includes(telefoneDigits.length)) {
      setErroFormulario('Informe um telefone válido com DDD.');
      return;
    }

    setSalvando(true);
    try {
      await apiRequest('/auth/me', {
        method: 'PATCH',
        token,
        body: JSON.stringify({
          nome: nome.trim(),
          estadoCivil: estadoCivil.trim(),
          telefone: telefone.trim(),
        }),
      });
      onVoltar?.();
    } catch (requestError) {
      setErroFormulario(requestError.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.formulario}>
      <Text style={styles.rotulo}>Nome</Text>
      <InputCadastro
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
        hasError={
          Boolean(erroFormulario) &&
          (nome.trim().length < 2 || nome.trim().length > 120)
        }
        containerStyle={styles.campo}
      />
      <Text style={styles.rotulo}>Estado civil</Text>
      <Pressable
        style={styles.seletorEstadoCivil}
        onPress={() => setMostrarOpcoesEstadoCivil(true)}
        accessibilityRole="button"
        accessibilityLabel={`Estado civil: ${estadoCivil || 'não selecionado'}`}
        accessibilityHint="Abre a lista de opções de estado civil"
      >
        <Text
          style={[
            styles.textoSeletor,
            !estadoCivil && styles.placeholderSeletor,
          ]}
        >
          {estadoCivil || 'Selecione'}
        </Text>
        <Text style={styles.setaSeletor}>⌄</Text>
      </Pressable>
      <Text style={styles.rotulo}>Telefone</Text>
      <InputCadastro
        placeholder="Telefone com DDD"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
        hasError={
          Boolean(erroFormulario) &&
          ![10, 11].includes(telefone.replace(/\D/g, '').length)
        }
        containerStyle={styles.campo}
      />
      {erroFormulario ? (
        <Text style={styles.erro}>{erroFormulario}</Text>
      ) : null}
      <Pressable
        style={[styles.botao, salvando && styles.botaoDesabilitado]}
        onPress={salvarDados}
        disabled={salvando}
        accessibilityRole="button"
        accessibilityState={{ disabled: salvando }}
      >
        <Text style={styles.textoBotao}>
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </Text>
      </Pressable>
      <Modal
        transparent
        visible={mostrarOpcoesEstadoCivil}
        animationType="fade"
        onRequestClose={() => setMostrarOpcoesEstadoCivil(false)}
      >
        <Pressable
          style={styles.fundoModal}
          onPress={() => setMostrarOpcoesEstadoCivil(false)}
        >
          <Pressable style={styles.listaEstadoCivil} onPress={() => {}}>
            <Text style={styles.tituloModal}>Estado civil</Text>
            {OPCOES_ESTADO_CIVIL.map((opcao) => (
              <Pressable
                key={opcao}
                style={styles.opcaoEstadoCivil}
                onPress={() => {
                  setEstadoCivil(opcao);
                  setMostrarOpcoesEstadoCivil(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: estadoCivil === opcao }}
              >
                <Text
                  style={[
                    styles.textoOpcaoEstadoCivil,
                    estadoCivil === opcao && styles.opcaoSelecionada,
                  ]}
                >
                  {opcao}
                </Text>
                {estadoCivil === opcao ? (
                  <Text style={styles.marcaSelecionada}>✓</Text>
                ) : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
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
  },
  titulo: {
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  descricao: {
    marginTop: 24,
    marginBottom: 20,
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  formulario: {
    gap: 8,
  },
  rotulo: {
    color: CORES.texto,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
  campo: {
    marginBottom: 12,
  },
  seletorEstadoCivil: {
    minHeight: 52,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textoSeletor: {
    color: '#333333',
    fontSize: rem(1),
    fontFamily: 'Inter_400Regular',
  },
  placeholderSeletor: {
    color: '#777777',
  },
  setaSeletor: {
    color: CORES.textoSecundario,
    fontSize: rem(1.375),
    lineHeight: rem(1.5),
  },
  fundoModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(13, 13, 13, 0.36)',
  },
  listaEstadoCivil: {
    width: '100%',
    maxWidth: 380,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: CORES.branco,
  },
  tituloModal: {
    marginBottom: 8,
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  opcaoEstadoCivil: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E2E2',
  },
  textoOpcaoEstadoCivil: {
    color: CORES.texto,
    fontSize: rem(1),
    fontFamily: 'Inter_400Regular',
  },
  opcaoSelecionada: {
    color: CORES.verdeEscuro,
    fontFamily: 'Inter_700Bold',
  },
  marcaSelecionada: {
    color: CORES.verdeEscuro,
    fontSize: rem(1),
    fontFamily: 'Inter_700Bold',
  },
  erro: {
    color: '#9E252C',
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  botao: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: CORES.verde,
  },
  botaoDesabilitado: {
    opacity: 0.65,
  },
  textoBotao: {
    color: CORES.branco,
    fontSize: rem(1),
    fontFamily: 'Inter_700Bold',
  },
});
