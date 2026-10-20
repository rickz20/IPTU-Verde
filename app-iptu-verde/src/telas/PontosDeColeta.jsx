import { rem } from '../utils/typography';
import { useRef, useState } from 'react';
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import IconeCalendario from '../../assets/Calendar confirmar agendamento.svg';
import CardPontoColeta from '../components/agendamentos/CardPontoColeta';
import BotaoVoltar from '../components/BotaoVoltar';
import EstadoApi from '../components/EstadoApi';
import MenuInferior from '../components/telaInicial/MenuInferior';
import { CORES } from '../components/telaInicial/tema';
import { useApiData } from '../hooks/useApiData';
import { apiRequest } from '../services/api';

const MATERIAIS = ['papel', 'plástico', 'vidro', 'metal'];
const HORARIOS_MANHA = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
];
const HORARIOS_TARDE = ['13:00', '13:30', '14:00', '14:30'];
const TODOS_HORARIOS = [...HORARIOS_MANHA, ...HORARIOS_TARDE];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function PontosDeColeta({
  onVoltar = () => {},
  onSelecionarAba,
  token,
}) {
  const insets = useSafeAreaInsets();
  const {
    data: pontos,
    error,
    loading,
    retry,
  } = useApiData('/pontos-coleta', 'pontos', token);
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [referencia, setReferencia] = useState('');
  const [telefone, setTelefone] = useState('');
  const [modalidade, setModalidade] = useState('ponto');
  const [materiais, setMateriais] = useState([]);
  const [etapaAgendamento, setEtapaAgendamento] = useState('formulario');
  const [mesExibido, setMesExibido] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [erroAgendamento, setErroAgendamento] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [erroDisponibilidade, setErroDisponibilidade] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState('inicio');
  const disponibilidadeRequestId = useRef(0);

  async function consultarDisponibilidade(pontoId, dataConsulta) {
    const requestId = ++disponibilidadeRequestId.current;
    setCarregandoHorarios(true);
    setErroDisponibilidade('');
    setHorariosOcupados([]);

    try {
      const resultado = await apiRequest(
        `/agendamentos/disponibilidade?pontoId=${encodeURIComponent(pontoId)}&data=${encodeURIComponent(dataConsulta)}`,
        { token },
      );
      if (requestId === disponibilidadeRequestId.current) {
        setHorariosOcupados(resultado.horariosOcupados ?? []);
      }
    } catch (error) {
      if (requestId === disponibilidadeRequestId.current) {
        setErroDisponibilidade(error.message);
      }
    } finally {
      if (requestId === disponibilidadeRequestId.current) {
        setCarregandoHorarios(false);
      }
    }
  }

  function fecharFormulario() {
    if (salvando) {
      return;
    }
    disponibilidadeRequestId.current += 1;
    setPontoSelecionado(null);
    setErroAgendamento('');
    setData('');
    setHorario('');
    setHorariosOcupados([]);
    setErroDisponibilidade('');
    setRua('');
    setNumero('');
    setBairro('');
    setReferencia('');
    setTelefone('');
    setModalidade('ponto');
    setMateriais([]);
    setEtapaAgendamento('formulario');
  }

  function abrirAgendamento(ponto) {
    const hoje = new Date();
    setPontoSelecionado(ponto);
    setMesExibido(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    setEtapaAgendamento('formulario');
  }

  function formatarTelefone(valor) {
    const digitos = valor.replace(/\D/g, '').slice(0, 11);
    if (digitos.length <= 2) {
      return digitos ? `(${digitos}` : '';
    }
    if (digitos.length <= 7) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    }
    if (digitos.length <= 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
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

  function continuarParaConfirmacao() {
    setErroAgendamento('');
    const telefoneValido = [10, 11].includes(telefone.replace(/\D/g, '').length);
    if (
      !pontoSelecionado ||
      !data ||
      !horario ||
      horariosOcupados.includes(horario) ||
      materiais.length === 0 ||
      !telefoneValido ||
      (modalidade === 'domicilio' &&
        (!rua.trim() || !numero.trim() || !bairro.trim()))
    ) {
      setErroAgendamento(
        horariosOcupados.includes(horario)
          ? 'Este horário acabou de ser reservado. Escolha outro horário ou dia.'
          : 'Informe telefone, data, horário e ao menos um material. Para coleta em domicílio, preencha rua, número e bairro.',
      );
      return;
    }

    setEtapaAgendamento('revisao');
  }

  async function confirmarAgendamento() {
    setErroAgendamento('');
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
          endereco: [rua, numero, bairro, referencia]
            .filter(Boolean)
            .join(', '),
          telefone: telefone.replace(/\D/g, ''),
        }),
      });
      setEtapaAgendamento('sucesso');
    } catch (requestError) {
      setErroAgendamento(requestError.message);
      if (requestError.message.includes('reservado')) {
        setEtapaAgendamento('formulario');
        setHorario('');
        await consultarDisponibilidade(pontoSelecionado.id, data);
      }
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
                  onAgendar={abrirAgendamento}
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

      <Modal
        visible={Boolean(pontoSelecionado)}
        transparent={false}
        animationType="slide"
        onRequestClose={fecharFormulario}
      >
        <View style={styles.modalConteudo}>
          {etapaAgendamento === 'formulario' ? (
            <SafeAreaView
              edges={[]}
              style={[
                styles.telaFormulario,
                {
                  paddingTop: insets.top,
                  paddingBottom: insets.bottom,
                },
              ]}
            >
            <ScrollView
              style={styles.scrollFormulario}
              contentContainerStyle={styles.conteudoFormulario}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.cabecalhoFormulario}>
                <Pressable
                  style={styles.botaoVoltarFormulario}
                  onPress={fecharFormulario}
                  accessibilityRole="button"
                  accessibilityLabel="Voltar"
                >
                  <Text style={styles.setaVoltar}>‹</Text>
                </Pressable>
                <View style={styles.textosCabecalhoFormulario}>
                  <Text style={styles.tituloModal}>
                    Preencha os dados para agendar uma coleta
                  </Text>
                  <Text style={styles.pontoModal}>
                    Informe os dados da coleta, como de costume.
                  </Text>
                </View>
              </View>

              <Text style={styles.rotuloCampo}>Modalidade da coleta?</Text>
              <View style={styles.opcoesModalidade}>
                {[
                  ['domicilio', 'Coleta em domicílio'],
                  ['ponto', 'Entrega no ponto de coleta'],
                ].map(([value, label]) => (
                  <Pressable
                    key={value}
                    style={[
                      styles.opcaoModalidade,
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

              <Text style={styles.avisoModalidade}>
                {modalidade === 'domicilio'
                  ? 'Uma equipe de coleta irá até sua residência para coletar os resíduos.'
                  : `Você mesmo levará os resíduos até o ponto de coleta que escolheu: ${pontoSelecionado?.nome}.`}
              </Text>

              {modalidade === 'domicilio' ? (
                <>
                  <Text style={styles.rotuloCampo}>Endereço</Text>
                  <TextInput
                    value={rua}
                    onChangeText={setRua}
                    placeholder="Rua"
                    placeholderTextColor={styles.corPlaceholder.color}
                    style={styles.campo}
                    underlineColorAndroid="transparent"
                    accessibilityLabel="Rua"
                  />
                  <TextInput
                    value={numero}
                    onChangeText={setNumero}
                    placeholder="Número"
                    placeholderTextColor={styles.corPlaceholder.color}
                    style={styles.campo}
                    underlineColorAndroid="transparent"
                    accessibilityLabel="Número"
                  />
                  <TextInput
                    value={bairro}
                    onChangeText={setBairro}
                    placeholder="Bairro"
                    placeholderTextColor={styles.corPlaceholder.color}
                    style={styles.campo}
                    underlineColorAndroid="transparent"
                    accessibilityLabel="Bairro"
                  />
                  <TextInput
                    value={referencia}
                    onChangeText={setReferencia}
                    placeholder="Ponto de referência (opcional)"
                    placeholderTextColor={styles.corPlaceholder.color}
                    style={styles.campo}
                    underlineColorAndroid="transparent"
                    accessibilityLabel="Ponto de referência opcional"
                  />
                </>
              ) : null}

              <Text style={styles.rotuloCampo}>Contato</Text>
              <TextInput
                value={telefone}
                onChangeText={(valor) => setTelefone(formatarTelefone(valor))}
                placeholder="Telefone"
                placeholderTextColor={styles.corPlaceholder.color}
                keyboardType="phone-pad"
                style={styles.campo}
                underlineColorAndroid="transparent"
                accessibilityLabel="Telefone para contato"
              />

              <Text style={styles.rotuloCampo}>Data e hora</Text>
              <Text style={styles.instrucaoCalendario}>
                Selecione a data e o horário desejados para a coleta ou entrega
                dos resíduos.
              </Text>
              <View style={styles.calendario}>
                <View style={styles.cabecalhoCalendario}>
                  <Pressable
                    style={styles.navegacaoMes}
                    onPress={() =>
                      setMesExibido(
                        (mes) =>
                          new Date(mes.getFullYear(), mes.getMonth() - 1, 1),
                      )
                    }
                    accessibilityRole="button"
                    accessibilityLabel="Mês anterior"
                  >
                    <Text style={styles.setaMes}>‹</Text>
                  </Pressable>
                  <Text style={styles.mesAno}>
                    {mesExibido.toLocaleDateString('pt-BR', { month: 'short' })}{' '}
                    {mesExibido.getFullYear()}
                  </Text>
                  <Pressable
                    style={styles.navegacaoMes}
                    onPress={() =>
                      setMesExibido(
                        (mes) =>
                          new Date(mes.getFullYear(), mes.getMonth() + 1, 1),
                      )
                    }
                    accessibilityRole="button"
                    accessibilityLabel="Próximo mês"
                  >
                    <Text style={styles.setaMes}>›</Text>
                  </Pressable>
                </View>
                <View style={styles.gradeCalendario}>
                  {DIAS_SEMANA.map((dia, index) => (
                    <Text key={`dia-${index}`} style={styles.diaSemana}>
                      {dia}
                    </Text>
                  ))}
                  {Array.from(
                    { length: new Date(mesExibido.getFullYear(), mesExibido.getMonth(), 1).getDay() },
                    (_, index) => (
                      <View key={`vazio-${index}`} style={styles.diaCalendario} />
                    ),
                  )}
                  {Array.from(
                    {
                      length: new Date(
                        mesExibido.getFullYear(),
                        mesExibido.getMonth() + 1,
                        0,
                      ).getDate(),
                    },
                    (_, index) => {
                      const dia = index + 1;
                      const valorData = formatarDataIso(
                        mesExibido.getFullYear(),
                        mesExibido.getMonth(),
                        dia,
                      );
                      const hojeIso = formatarDataIso(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                      );
                      const selecionado = data === valorData;
                      const desabilitado = valorData < hojeIso;
                      return (
                        <Pressable
                          key={valorData}
                          style={[
                            styles.diaCalendario,
                            selecionado && styles.diaSelecionado,
                            desabilitado && styles.diaDesabilitado,
                          ]}
                          disabled={desabilitado}
                          onPress={() => {
                            setData(valorData);
                            setHorario('');
                            setErroAgendamento('');
                            void consultarDisponibilidade(
                              pontoSelecionado.id,
                              valorData,
                            );
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={`Dia ${dia}`}
                          accessibilityState={{
                            selected: selecionado,
                            disabled: desabilitado,
                          }}
                        >
                          <Text
                            style={[
                              styles.textoDiaCalendario,
                              selecionado && styles.textoDiaSelecionado,
                              desabilitado && styles.textoDiaDesabilitado,
                            ]}
                          >
                            {dia}
                          </Text>
                        </Pressable>
                      );
                    },
                  )}
                </View>
              </View>

              {data ? (
                <View style={styles.estadoDisponibilidade}>
                  {carregandoHorarios ? (
                    <Text style={styles.mensagemDisponibilidade}>
                      Verificando horários disponíveis...
                    </Text>
                  ) : erroDisponibilidade ? (
                    <View>
                      <Text style={styles.erroModal}>
                        Não foi possível carregar os horários. Confira sua
                        conexão e tente novamente.
                      </Text>
                      <Pressable
                        onPress={() =>
                          void consultarDisponibilidade(
                            pontoSelecionado.id,
                            data,
                          )
                        }
                        accessibilityRole="button"
                      >
                        <Text style={styles.tentarNovamente}>
                          Tentar novamente
                        </Text>
                      </Pressable>
                    </View>
                  ) : horariosOcupados.length === TODOS_HORARIOS.length ? (
                    <Text style={styles.mensagemSemHorarios}>
                      Não há mais horários disponíveis para este dia. Escolha
                      outra data para continuar.
                    </Text>
                  ) : null}
                </View>
              ) : (
                <Text style={styles.mensagemDisponibilidade}>
                  Selecione uma data para consultar os horários disponíveis.
                </Text>
              )}

              {[
                ['Manhã', HORARIOS_MANHA],
                ['Tarde', HORARIOS_TARDE],
              ].map(([periodo, horarios]) => (
                <View key={periodo} style={styles.secaoHorarios}>
                  <Text style={styles.periodoHorario}>{periodo}</Text>
                  <View style={styles.gradeHorarios}>
                    {horarios.map((opcaoHorario) => {
                      const ocupado = horariosOcupados.includes(opcaoHorario);
                      const desabilitado =
                        ocupado ||
                        carregandoHorarios ||
                        Boolean(erroDisponibilidade);
                      return (
                        <Pressable
                          key={opcaoHorario}
                          style={[
                            styles.opcaoHorario,
                            horario === opcaoHorario && styles.opcaoSelecionada,
                            ocupado && styles.opcaoHorarioOcupada,
                          ]}
                          onPress={() => setHorario(opcaoHorario)}
                          disabled={desabilitado || !data}
                          accessibilityRole="button"
                          accessibilityState={{
                            selected: horario === opcaoHorario,
                            disabled: desabilitado || !data,
                          }}
                        >
                          <Text
                            style={[
                              styles.textoOpcao,
                              horario === opcaoHorario &&
                                styles.textoOpcaoSelecionada,
                              ocupado && styles.textoHorarioOcupado,
                            ]}
                          >
                            {ocupado ? 'Ocupado' : opcaoHorario}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}

              <Text style={styles.rotuloCampo}>O que será coletado?</Text>
              <Text style={styles.instrucaoCalendario}>
                Escolha aqui quais materiais serão coletados neste dia.
              </Text>
              <View style={styles.opcoesMateriais}>
                {MATERIAIS.map((material) => (
                  <Pressable
                    key={material}
                    style={[
                      styles.opcaoMaterial,
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
                      {material[0].toUpperCase() + material.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {erroAgendamento ? (
                <Text style={styles.erroModal}>{erroAgendamento}</Text>
              ) : null}

              <Pressable
                style={[
                  styles.botaoAgendar,
                  salvando && styles.botaoDesativado,
                ]}
                onPress={continuarParaConfirmacao}
                disabled={salvando}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotaoAgendar}>Agendar Coleta</Text>
              </Pressable>
            </ScrollView>
            </SafeAreaView>
          ) : (
            <SafeAreaView
              style={styles.telaConfirmacao}
              edges={['top', 'right', 'bottom', 'left']}
            >
              <ScrollView
                contentContainerStyle={styles.conteudoConfirmacao}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <IconeCalendario width={48} height={48} />
                <Text style={styles.tituloConfirmacao}>
                  {etapaAgendamento === 'sucesso'
                    ? 'Agendamento confirmado!'
                    : 'Revisar agendamento de coleta'}
                </Text>
                <Text style={styles.subtituloConfirmacao}>
                  {etapaAgendamento === 'sucesso'
                    ? 'Seu agendamento foi confirmado com sucesso.'
                    : 'Confira as informações do agendamento.'}
                </Text>
                {etapaAgendamento === 'revisao' ? (
                  <View style={styles.resumoAgendamento}>
                    <ResumoItem
                      rotulo="Local de coleta"
                      valor={
                        modalidade === 'domicilio'
                          ? 'Coleta em domicílio'
                          : pontoSelecionado?.nome
                      }
                    />
                    <ResumoItem
                      rotulo="Endereço"
                      valor={
                        modalidade === 'domicilio'
                          ? [rua, numero, bairro, referencia]
                              .filter(Boolean)
                              .join(', ')
                          : pontoSelecionado?.endereco
                      }
                    />
                    <ResumoItem
                      rotulo="Data e hora"
                      valor={`${formatarDataExibicao(data)} às ${horario}`}
                    />
                    <ResumoItem
                      rotulo="Modalidade"
                      valor={
                        modalidade === 'domicilio'
                          ? 'Coleta em domicílio'
                          : 'Entrega no ponto de coleta'
                      }
                    />
                    <ResumoItem
                      rotulo="Materiais coletados"
                      valor={materiais.join(' e ')}
                    />
                    <ResumoItem rotulo="Contato" valor={telefone} />
                  </View>
                ) : null}
                {erroAgendamento ? (
                  <Text style={styles.erroModal}>{erroAgendamento}</Text>
                ) : null}
                <View style={styles.acoesModal}>
                  {etapaAgendamento === 'revisao' ? (
                    <>
                      <Pressable
                        style={styles.botaoSecundario}
                        onPress={() => {
                          setErroAgendamento('');
                          setEtapaAgendamento('formulario');
                        }}
                        disabled={salvando}
                        accessibilityRole="button"
                      >
                        <Text style={styles.textoBotaoSecundario}>Voltar</Text>
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
                          {salvando ? 'Confirmando...' : 'Confirmar'}
                        </Text>
                      </Pressable>
                    </>
                  ) : (
                    <Pressable
                      style={styles.botaoPrimario}
                      onPress={fecharFormulario}
                      accessibilityRole="button"
                    >
                      <Text style={styles.textoBotaoPrimario}>Certo!</Text>
                    </Pressable>
                  )}
                </View>
              </ScrollView>
            </SafeAreaView>
          )}
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
  modalConteudo: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  telaFormulario: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  telaConfirmacao: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  conteudoConfirmacao: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  scrollFormulario: {
    flex: 1,
  },
  conteudoFormulario: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 8,
  },
  cabecalhoFormulario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  botaoVoltarFormulario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CORES.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setaVoltar: {
    marginTop: -3,
    color: CORES.branco,
    fontSize: rem(2),
    lineHeight: rem(2),
  },
  textosCabecalhoFormulario: {
    flex: 1,
  },
  tituloModal: {
    color: CORES.texto,
    fontSize: rem(1.25),
    lineHeight: rem(1.5),
    fontFamily: 'Alexandria_700Bold',
  },
  pontoModal: {
    marginTop: 3,
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  rotuloCampo: {
    marginTop: 6,
    color: CORES.texto,
    fontSize: rem(1.25),
    lineHeight: rem(1.5),
    fontFamily: 'Inter_700Bold',
  },
  campo: {
    minHeight: 54,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: CORES.texto,
    fontSize: rem(1.125),
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
  corPlaceholder: {
    color: '#666666',
  },
  opcoesModalidade: {
    flexDirection: 'row',
    gap: 6,
  },
  opcaoModalidade: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: CORES.cinza,
  },
  avisoModalidade: {
    padding: 10,
    borderRadius: 7,
    backgroundColor: '#E1E1E1',
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  instrucaoCalendario: {
    marginTop: -5,
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  calendario: {
    padding: 10,
    borderWidth: 1,
    borderColor: CORES.cinzaMedio,
    borderRadius: 12,
  },
  cabecalhoCalendario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  navegacaoMes: {
    width: 34,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setaMes: {
    color: CORES.texto,
    fontSize: rem(1.5),
  },
  mesAno: {
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_700Bold',
    textTransform: 'capitalize',
  },
  gradeCalendario: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  diaSemana: {
    width: '14.2857%',
    height: 34,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: CORES.textoSecundario,
    fontSize: rem(1),
    fontFamily: 'Inter_400Regular',
  },
  diaCalendario: {
    width: '14.2857%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  diaSelecionado: {
    backgroundColor: CORES.verde,
  },
  diaDesabilitado: {
    opacity: 0.35,
  },
  textoDiaCalendario: {
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Inter_400Regular',
  },
  textoDiaSelecionado: {
    color: CORES.branco,
    fontFamily: 'Inter_700Bold',
  },
  textoDiaDesabilitado: {
    color: CORES.textoSecundario,
  },
  secaoHorarios: {
    gap: 5,
  },
  periodoHorario: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  gradeHorarios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  opcaoHorario: {
    width: '30%',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: CORES.cinza,
  },
  opcaoHorarioOcupada: {
    opacity: 0.45,
  },
  textoHorarioOcupado: {
    textDecorationLine: 'line-through',
  },
  estadoDisponibilidade: {
    paddingVertical: 2,
  },
  mensagemDisponibilidade: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    lineHeight: rem(1.125),
    fontFamily: 'Inter_400Regular',
  },
  mensagemSemHorarios: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF3E0',
    color: '#704800',
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_700Bold',
  },
  tentarNovamente: {
    marginTop: 5,
    color: CORES.verdeEscuro,
    fontSize: rem(0.9375),
    textDecorationLine: 'underline',
    fontFamily: 'Inter_700Bold',
  },
  opcoesMateriais: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  opcaoMaterial: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: CORES.cinza,
  },
  botaoAgendar: {
    minHeight: 56,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: CORES.verde,
  },
  textoBotaoAgendar: {
    color: CORES.branco,
    fontSize: rem(1.125),
    lineHeight: rem(1.375),
    fontFamily: 'Inter_700Bold',
  },
  tituloConfirmacao: {
    marginTop: 14,
    color: CORES.texto,
    fontSize: rem(1.375),
    lineHeight: rem(1.625),
    textAlign: 'center',
    fontFamily: 'Alexandria_700Bold',
  },
  subtituloConfirmacao: {
    marginTop: 4,
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  resumoAgendamento: {
    width: '100%',
    maxWidth: 420,
    gap: 9,
    marginTop: 18,
  },
  itemResumo: {
    alignItems: 'center',
  },
  rotuloResumo: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  valorResumo: {
    color: CORES.texto,
    fontSize: rem(1.125),
    lineHeight: rem(1.375),
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  opcaoSelecionada: {
    backgroundColor: CORES.verde,
  },
  textoOpcao: {
    color: CORES.texto,
    fontSize: rem(0.9375),
    lineHeight: rem(1.125),
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  textoOpcaoSelecionada: {
    color: CORES.branco,
    fontFamily: 'Inter_700Bold',
  },
  erroModal: {
    color: '#9E252C',
    fontSize: rem(1.125),
    lineHeight: rem(1.375),
    fontFamily: 'Inter_400Regular',
  },
  acoesModal: {
    width: '100%',
    maxWidth: 420,
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  botaoSecundario: {
    flex: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: CORES.cinza,
  },
  textoBotaoSecundario: {
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Inter_700Bold',
  },
  botaoPrimario: {
    flex: 1,
    minHeight: 54,
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
    fontSize: rem(1.125),
    fontFamily: 'Inter_700Bold',
  },
});

function formatarDataIso(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function formatarDataExibicao(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return valor;
  }
  const [ano, mes, dia] = valor.split('-');
  return `${dia}/${mes}/${ano}`;
}

function ResumoItem({ rotulo, valor }) {
  return (
    <View style={styles.itemResumo}>
      <Text style={styles.rotuloResumo}>{rotulo}</Text>
      <Text style={styles.valorResumo}>{valor || 'Não informado'}</Text>
    </View>
  );
}
