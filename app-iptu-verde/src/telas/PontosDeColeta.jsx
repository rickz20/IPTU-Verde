import { rem } from '../utils/typography';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardPontoColeta from '../components/agendamentos/CardPontoColeta';
import BotaoVoltar from '../components/BotaoVoltar';
import EstadoApi from '../components/EstadoApi';
import MenuInferior from '../components/telaInicial/MenuInferior';
import { CORES } from '../components/telaInicial/tema';
import { useApiData } from '../hooks/useApiData';
import { apiRequest } from '../services/api';

const MATERIAIS = ['papel', 'plástico', 'vidro', 'metal'];

export default function PontosDeColeta({
  onVoltar = () => {},
  onSelecionarAba,
  token,
}) {
  const {
    data: pontos,
    error,
    loading,
    retry,
  } = useApiData('/pontos-coleta', 'pontos', token);
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [enderecoDomicilio, setEnderecoDomicilio] = useState('');
  const [modalidade, setModalidade] = useState('ponto');
  const [materiais, setMateriais] = useState([]);
  const [erroAgendamento, setErroAgendamento] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [abaSelecionada, setAbaSelecionada] = useState('inicio');

  function fecharFormulario() {
    setPontoSelecionado(null);
    setErroAgendamento('');
    setData('');
    setHorario('');
    setEnderecoDomicilio('');
    setModalidade('ponto');
    setMateriais([]);
  }

  function alternarMaterial(material) {
    setMateriais((atuais) =>
      atuais.includes(material)
        ? atuais.filter((item) => item !== material)
        : [...atuais, material],
    );
  }

  function selecionarAba(aba) {
    setAbaSelecionada(aba);
    onSelecionarAba?.(aba);
  }

  async function confirmarAgendamento() {
    setErroAgendamento('');
    if (
      !pontoSelecionado ||
      !data ||
      !horario ||
      materiais.length === 0 ||
      (modalidade === 'domicilio' && !enderecoDomicilio.trim())
    ) {
      setErroAgendamento(
        'Preencha a data, o horário, o endereço para coleta em domicílio e ao menos um material.',
      );
      return;
    }

    setSalvando(true);
    try {
      await apiRequest('/agendamentos', {
        method: 'POST',
        token,
        body: JSON.stringify({
          pontoId: pontoSelecionado.id,
          data,
          horario,
          modalidade,
          materiais,
          endereco: enderecoDomicilio,
        }),
      });
      setSucesso(
        'Agendamento realizado. Você já pode vê-lo em Meus agendamentos.',
      );
      fecharFormulario();
    } catch (requestError) {
      setErroAgendamento(requestError.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={
        onSelecionarAba
          ? ['top', 'left', 'right']
          : ['top', 'right', 'bottom', 'left']
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Locais e agendamento de coletas</Text>
        </View>

        <Text style={styles.descricao}>
          Veja os melhores locais e horários para visitar os nossos pontos de
          coleta ou agende a busca em domicílio.
        </Text>

        <View style={styles.listaPontos}>
          <EstadoApi
            loading={loading}
            error={error}
            empty={!loading && !error && pontos.length === 0}
            onRetry={retry}
            emptyMessage="No momento, não há pontos de coleta cadastrados."
          />
          {!loading && !error
            ? pontos.map((ponto) => (
                <CardPontoColeta
                  key={ponto.id}
                  ponto={ponto}
                  onAgendar={setPontoSelecionado}
                />
              ))
            : null}
        </View>
      </ScrollView>

      {onSelecionarAba ? (
        <MenuInferior
          selecionado={abaSelecionada}
          onSelecionar={selecionarAba}
        />
      ) : null}

      {sucesso ? (
        <View style={styles.avisoSucesso}>
          <Text style={styles.textoSucesso}>{sucesso}</Text>
          <Pressable
            onPress={() => setSucesso('')}
            accessibilityRole="button"
            accessibilityLabel="Fechar mensagem"
          >
            <Text style={styles.fecharSucesso}>×</Text>
          </Pressable>
        </View>
      ) : null}

      <Modal
        visible={Boolean(pontoSelecionado)}
        transparent
        animationType="slide"
        onRequestClose={fecharFormulario}
      >
        <View style={styles.fundoModal}>
          <ScrollView
            style={styles.scrollFormulario}
            contentContainerStyle={styles.cartaoModal}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.tituloModal}>Agendar coleta</Text>
            <Text style={styles.pontoModal}>{pontoSelecionado?.nome}</Text>

            <Text style={styles.rotuloCampo}>Data (AAAA-MM-DD)</Text>
            <TextInput
              value={data}
              onChangeText={setData}
              placeholder="2026-10-30"
              style={styles.campo}
              accessibilityLabel="Data da coleta"
            />

            <Text style={styles.rotuloCampo}>Horário</Text>
            <TextInput
              value={horario}
              onChangeText={setHorario}
              placeholder="10:00 às 10:30"
              style={styles.campo}
              accessibilityLabel="Horário da coleta"
            />

            <Text style={styles.rotuloCampo}>Modalidade</Text>
            <View style={styles.opcoes}>
              {[
                ['ponto', 'Entrega no ponto'],
                ['domicilio', 'Coleta em domicílio'],
              ].map(([value, label]) => (
                <Pressable
                  key={value}
                  style={[
                    styles.opcao,
                    modalidade === value && styles.opcaoSelecionada,
                  ]}
                  onPress={() => setModalidade(value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: modalidade === value }}
                >
                  <Text
                    style={[
                      styles.textoOpcao,
                      modalidade === value && styles.textoOpcaoSelecionada,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {modalidade === 'domicilio' ? (
              <>
                <Text style={styles.rotuloCampo}>Endereço da coleta</Text>
                <TextInput
                  value={enderecoDomicilio}
                  onChangeText={setEnderecoDomicilio}
                  placeholder="Rua, número, bairro e cidade"
                  style={styles.campo}
                  accessibilityLabel="Endereço para coleta em domicílio"
                />
              </>
            ) : null}

            <Text style={styles.rotuloCampo}>Materiais</Text>
            <View style={styles.opcoes}>
              {MATERIAIS.map((material) => (
                <Pressable
                  key={material}
                  style={[
                    styles.opcao,
                    materiais.includes(material) && styles.opcaoSelecionada,
                  ]}
                  onPress={() => alternarMaterial(material)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: materiais.includes(material) }}
                >
                  <Text
                    style={[
                      styles.textoOpcao,
                      materiais.includes(material) &&
                        styles.textoOpcaoSelecionada,
                    ]}
                  >
                    {material}
                  </Text>
                </Pressable>
              ))}
            </View>

            {erroAgendamento ? (
              <Text style={styles.erroModal}>{erroAgendamento}</Text>
            ) : null}

            <View style={styles.acoesModal}>
              <Pressable
                style={styles.botaoSecundario}
                onPress={fecharFormulario}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotaoSecundario}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.botaoPrimario,
                  salvando && styles.botaoDesativado,
                ]}
                onPress={confirmarAgendamento}
                disabled={salvando}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotaoPrimario}>
                  {salvando ? 'Enviando...' : 'Confirmar'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
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
  scroll: {
    flex: 1,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  titulo: {
    flex: 1,
    color: CORES.texto,
    fontSize: rem(1.25),
    lineHeight: rem(1.625),
    fontFamily: 'Alexandria_700Bold',
  },
  descricao: {
    marginTop: 14,
    marginBottom: 28,
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  listaPontos: {
    gap: 10,
  },
  avisoSucesso: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    backgroundColor: '#EAF3D4',
  },
  textoSucesso: {
    flex: 1,
    color: CORES.verdeEscuro,
    fontSize: rem(0.875),
    lineHeight: rem(1.125),
    fontFamily: 'Inter_700Bold',
  },
  fecharSucesso: {
    color: CORES.verdeEscuro,
    fontSize: rem(1.5),
  },
  fundoModal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  cartaoModal: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 20,
    gap: 10,
    borderRadius: 18,
    backgroundColor: CORES.branco,
  },
  scrollFormulario: {
    width: '100%',
    maxHeight: '90%',
  },
  tituloModal: {
    color: CORES.texto,
    fontSize: rem(1.25),
    fontFamily: 'Alexandria_700Bold',
  },
  pontoModal: {
    marginBottom: 8,
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  rotuloCampo: {
    color: CORES.texto,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
  campo: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: CORES.cinzaMedio,
    borderRadius: 10,
    color: CORES.texto,
    fontSize: rem(0.875),
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcao: {
    minHeight: 40,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CORES.cinzaMedio,
    borderRadius: 10,
  },
  opcaoSelecionada: {
    borderColor: CORES.verdeEscuro,
    backgroundColor: '#EEF4D9',
  },
  textoOpcao: {
    color: CORES.texto,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  textoOpcaoSelecionada: {
    color: CORES.verdeEscuro,
    fontFamily: 'Inter_700Bold',
  },
  erroModal: {
    color: '#9E252C',
    fontSize: rem(0.875),
    lineHeight: rem(1.125),
    fontFamily: 'Inter_400Regular',
  },
  acoesModal: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  botaoSecundario: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: CORES.cinza,
  },
  textoBotaoSecundario: {
    color: CORES.texto,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
  botaoPrimario: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: CORES.verde,
  },
  botaoDesativado: {
    opacity: 0.65,
  },
  textoBotaoPrimario: {
    color: CORES.branco,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
});
