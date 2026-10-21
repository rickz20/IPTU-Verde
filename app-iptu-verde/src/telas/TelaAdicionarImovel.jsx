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
import InputCadastro from '../components/InputCadastro';
import { CORES } from '../components/telaInicial/tema';
import { apiRequest } from '../services/api';

export default function TelaAdicionarImovel({
  onVoltar,
  onAdicionado,
  token,
}) {
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [complemento, setComplemento] = useState('');
  const [inscricaoImobiliaria, setInscricaoImobiliaria] = useState('');
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [erroServidor, setErroServidor] = useState('');
  const [salvando, setSalvando] = useState(false);

  const cepValido = cep.replace(/\D/g, '').length === 8;
  const formularioValido =
    rua.trim().length >= 2 &&
    numero.trim().length > 0 &&
    bairro.trim().length >= 2 &&
    cepValido &&
    inscricaoImobiliaria.trim().length > 0;

  async function salvarImovel() {
    setTentouSalvar(true);
    setErroServidor('');
    if (!formularioValido) return;

    setSalvando(true);
    try {
      await apiRequest('/imoveis', {
        method: 'POST',
        token,
        body: JSON.stringify({
          rua: rua.trim(),
          numero: numero.trim(),
          bairro: bairro.trim(),
          cep: cep.replace(/\D/g, ''),
          complemento: complemento.trim(),
          inscricaoImobiliaria: inscricaoImobiliaria.trim(),
        }),
      });
      onAdicionado?.();
    } catch (error) {
      setErroServidor(error.message);
    } finally {
      setSalvando(false);
    }
  }

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
          <Text style={styles.titulo}>Adicionar imóvel</Text>
        </View>

        <Text style={styles.descricao}>
          Preencha os dados do imóvel para vinculá-lo à sua conta.
        </Text>

        <View style={styles.formulario}>
          <CampoImovel
            titulo="Rua"
            placeholder="Nome da rua"
            value={rua}
            onChangeText={setRua}
            hasError={tentouSalvar && (rua.trim().length < 2 || rua.trim().length > 120)}
          />
          <CampoImovel
            titulo="Número"
            placeholder="Número"
            value={numero}
            onChangeText={setNumero}
            hasError={tentouSalvar && (!numero.trim() || numero.trim().length > 20)}
          />
          <CampoImovel
            titulo="Bairro"
            placeholder="Nome do bairro"
            value={bairro}
            onChangeText={setBairro}
            hasError={
              tentouSalvar &&
              (bairro.trim().length < 2 || bairro.trim().length > 80)
            }
          />
          <CampoImovel
            titulo="CEP"
            placeholder="00000-000"
            value={cep}
            onChangeText={atualizarCep(setCep)}
            keyboardType="numeric"
            hasError={tentouSalvar && !cepValido}
          />
          <CampoImovel
            titulo="Complemento"
            placeholder="Apartamento, bloco etc. (opcional)"
            value={complemento}
            onChangeText={setComplemento}
            hasError={tentouSalvar && complemento.trim().length > 120}
          />
          <CampoImovel
            titulo="Inscrição imobiliária"
            placeholder="Número de inscrição"
            value={inscricaoImobiliaria}
            onChangeText={setInscricaoImobiliaria}
            hasError={
              tentouSalvar &&
              (!inscricaoImobiliaria.trim() ||
                inscricaoImobiliaria.trim().length > 40)
            }
          />
        </View>

        {tentouSalvar && !formularioValido && !erroServidor ? (
          <Text style={styles.erro}>
            Confira os campos obrigatórios e informe um CEP válido.
          </Text>
        ) : null}
        {erroServidor ? <Text style={styles.erro}>{erroServidor}</Text> : null}

        <Pressable
          style={[styles.botao, salvando && styles.botaoDesabilitado]}
          onPress={salvarImovel}
          disabled={salvando}
          accessibilityRole="button"
          accessibilityState={{ disabled: salvando }}
        >
          <Text style={styles.textoBotao}>
            {salvando ? 'Salvando...' : 'Salvar imóvel'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function CampoImovel({
  titulo,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  hasError,
}) {
  return (
    <View style={styles.grupoCampo}>
      <Text style={styles.rotulo}>{titulo}</Text>
      <InputCadastro
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        hasError={hasError}
        containerStyle={styles.campo}
      />
    </View>
  );
}

function atualizarCep(setCep) {
  return (valor) => {
    const digits = valor.replace(/\D/g, '').slice(0, 8);
    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
  };
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
  grupoCampo: {
    gap: 4,
  },
  rotulo: {
    color: CORES.texto,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
  campo: {
    marginBottom: 6,
  },
  erro: {
    marginTop: 8,
    color: '#9E252C',
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  botao: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
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
