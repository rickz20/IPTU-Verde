import { rem } from '../utils/typography';
import { useState } from 'react';
import {
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
          Atualize seu nome e telefone de contato.
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
        body: JSON.stringify({ nome: nome.trim(), telefone }),
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
