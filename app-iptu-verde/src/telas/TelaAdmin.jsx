import { useMemo, useState } from 'react';
import { rem } from '../utils/typography';
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
import Svg, { Path, Rect } from 'react-native-svg';
import LogoIptuVerde from '../../assets/logo iptuverde.svg';
import { CORES } from '../components/telaInicial/tema';
import MenuInferior from '../components/telaInicial/MenuInferior';

const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const COLETAS_INICIAIS = [
  {
    id: 'demo-1',
    responsavel: 'Marina Costa',
    modalidade: 'Coleta em domicílio',
    materiais: 'Metal 3,5 kg · Papel 2,5 kg',
    ponto: 'Rua José Juva, 120 · Centro',
    peso: 6,
  },
  {
    id: 'demo-2',
    responsavel: 'João Lima',
    modalidade: 'Entrega no ponto de coleta',
    materiais: 'Vidro 4,0 kg · Plástico 800 g',
    ponto: 'Ponto de coleta 1 · Centro',
    peso: 4.8,
  },
];

const ABAS_ADMIN = [
  { id: 'coletas', titulo: 'Coletas', icone: IconeColetas },
  { id: 'agenda', titulo: 'Agenda', central: true },
  { id: 'solicitacoes', titulo: 'Solicitações', icone: IconeSolicitacoes },
];

export default function TelaAdmin({ onSair, usuario }) {
  const [abaSelecionada, setAbaSelecionada] = useState('coletas');
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [coletas, setColetas] = useState(COLETAS_INICIAIS);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [responsavel, setResponsavel] = useState('');
  const [materiais, setMateriais] = useState('');
  const [peso, setPeso] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');

  const diasDoMes = useMemo(() => {
    const ano = dataSelecionada.getFullYear();
    const mes = dataSelecionada.getMonth();
    const inicio = new Date(
      ano,
      mes,
      dataSelecionada.getDate() - ((dataSelecionada.getDay() + 6) % 7),
    );

    return Array.from({ length: 7 }, (_, index) => {
      const dia = new Date(inicio);
      dia.setDate(inicio.getDate() + index);
      return {
        data: dia,
        pertenceAoMes: dia.getMonth() === mes,
        numero: dia.getDate(),
      };
    });
  }, [dataSelecionada]);

  function alterarMes(delta) {
    setDataSelecionada(
      (atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1),
    );
  }

  function registrarColeta() {
    const pesoNumerico = Number(peso.replace(',', '.'));
    if (
      !responsavel.trim() ||
      !materiais.trim() ||
      !Number.isFinite(pesoNumerico) ||
      pesoNumerico <= 0
    ) {
      setErroFormulario('Preencha os campos e informe um peso maior que zero.');
      return;
    }

    setColetas((atuais) => [
      {
        id: `${Date.now()}`,
        responsavel: responsavel.trim(),
        modalidade: 'Entrega no ponto de coleta',
        materiais: materiais.trim(),
        ponto: 'Ponto de coleta 1 · Centro',
        peso: pesoNumerico,
      },
      ...atuais,
    ]);
    setResponsavel('');
    setMateriais('');
    setPeso('');
    setErroFormulario('');
    setMostrarFormulario(false);
  }

  const totalPeso = coletas.reduce((total, coleta) => total + coleta.peso, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <LogoIptuVerde
            style={styles.logo}
            accessibilityLabel="IPTU Verde Quixadá"
          />
          <View style={styles.acoesCabecalho}>
            <View style={styles.seloAdmin}>
              <Text style={styles.textoSeloAdmin}>Administrador</Text>
            </View>
            <Pressable
              onPress={onSair}
              style={styles.botaoSair}
              accessibilityRole="button"
              accessibilityLabel={`Sair da conta de ${usuario?.nome ?? 'administrador'}`}
              hitSlop={8}
            >
              <IconeSair />
            </Pressable>
          </View>
        </View>

        <Text style={styles.tituloPagina}>
          {abaSelecionada === 'coletas'
            ? 'Coletas registradas'
            : abaSelecionada === 'agenda'
              ? 'Agenda de coletas'
              : 'Solicitações'}
        </Text>
        <Text style={styles.subtituloPagina}>
          {abaSelecionada === 'coletas'
            ? 'Ponto de Coleta 01, Centro'
            : 'Ponto de Coleta 01, Centro'}
        </Text>

        {abaSelecionada === 'coletas' ? (
          <>
            <Pressable
              style={styles.botaoRegistrar}
              onPress={() => {
                setErroFormulario('');
                setMostrarFormulario(true);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.mais}>＋</Text>
              <Text style={styles.textoBotaoRegistrar}>Registrar coleta</Text>
            </Pressable>

            <View style={styles.navegacaoCalendario}>
              <Pressable
                onPress={() => alterarMes(-1)}
                style={styles.botaoMes}
                accessibilityRole="button"
                accessibilityLabel="Mês anterior"
              >
                <Text style={styles.setaMes}>‹</Text>
              </Pressable>
              <Text style={styles.mesAtual}>
                {NOMES_MESES[dataSelecionada.getMonth()]} de{' '}
                {dataSelecionada.getFullYear()}
              </Text>
              <Pressable
                onPress={() => alterarMes(1)}
                style={styles.botaoMes}
                accessibilityRole="button"
                accessibilityLabel="Próximo mês"
              >
                <Text style={styles.setaMes}>›</Text>
              </Pressable>
            </View>

            <View style={styles.calendario}>
              {diasDoMes.map(({ data, pertenceAoMes, numero }) => {
                const selecionado =
                  data.toDateString() === dataSelecionada.toDateString();
                return (
                  <Pressable
                    key={data.toISOString()}
                    onPress={() => setDataSelecionada(data)}
                    style={styles.dia}
                    accessibilityRole="button"
                    accessibilityLabel={`${numero} de ${NOMES_MESES[data.getMonth()]}`}
                    accessibilityState={{ selected: selecionado }}
                  >
                    <Text style={styles.nomeDia}>
                      {DIAS_SEMANA[(data.getDay() + 6) % 7]}
                    </Text>
                    <View
                      style={[
                        styles.numeroDia,
                        selecionado && styles.numeroDiaSelecionado,
                        !pertenceAoMes && styles.diaForaDoMes,
                      ]}
                    >
                      <Text
                        style={[
                          styles.textoNumeroDia,
                          selecionado && styles.textoDiaSelecionado,
                        ]}
                      >
                        {numero}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.resumo}>
              <Text style={styles.rotuloResumo}>Resumo do dia</Text>
              <View style={styles.numerosResumo}>
                <View>
                  <Text style={styles.valorResumo}>{coletas.length}</Text>
                  <Text style={styles.descricaoResumo}>coletas</Text>
                </View>
                <View>
                  <Text style={styles.valorResumo}>
                    {formatarPeso(totalPeso)} kg
                  </Text>
                  <Text style={styles.descricaoResumo}>recebidos</Text>
                </View>
              </View>
              <View style={styles.divisorResumo} />
              <Text style={styles.rodapeResumo}>
                {coletas.filter((coleta) => coleta.modalidade.includes('domicílio')).length}{' '}
                em domicílio ·{' '}
                {coletas.filter((coleta) => !coleta.modalidade.includes('domicílio')).length}{' '}
                no ponto de coleta
              </Text>
            </View>

            <View style={styles.cabecalhoLista}>
              <Text style={styles.tituloLista}>
                {formatarData(dataSelecionada)}
              </Text>
              <Text style={styles.totalLista}>
                {coletas.length} coletas · {formatarPeso(totalPeso)} kg
              </Text>
            </View>

            {coletas.map((coleta) => (
              <CartaoColeta key={coleta.id} coleta={coleta} />
            ))}
            <Text style={styles.avisoDemo}>
              Dados demonstrativos: alterações ficam somente nesta sessão.
            </Text>
          </>
        ) : (
          <PainelSecundario aba={abaSelecionada} />
        )}
      </ScrollView>

      <MenuInferior
        selecionado={abaSelecionada}
        onSelecionar={setAbaSelecionada}
        itens={ABAS_ADMIN}
      />

      <Modal
        transparent
        visible={mostrarFormulario}
        animationType="slide"
        onRequestClose={() => setMostrarFormulario(false)}
      >
        <Pressable
          style={styles.fundoModal}
          onPress={() => setMostrarFormulario(false)}
        >
          <Pressable style={styles.modal} onPress={() => {}}>
            <Text style={styles.tituloModal}>Registrar coleta</Text>
            <Text style={styles.rotuloCampo}>Responsável</Text>
            <TextInput
              style={styles.campo}
              value={responsavel}
              onChangeText={(value) => {
                setResponsavel(value);
                setErroFormulario('');
              }}
              placeholder="Nome de quem entregou"
              placeholderTextColor="#85816C"
              autoCapitalize="words"
            />
            <Text style={styles.rotuloCampo}>Materiais coletados</Text>
            <TextInput
              style={styles.campo}
              value={materiais}
              onChangeText={(value) => {
                setMateriais(value);
                setErroFormulario('');
              }}
              placeholder="Ex.: Papel 2 kg · Plástico 1 kg"
              placeholderTextColor="#85816C"
            />
            <Text style={styles.rotuloCampo}>Peso total (kg)</Text>
            <TextInput
              style={styles.campo}
              value={peso}
              onChangeText={(value) => {
                setPeso(value);
                setErroFormulario('');
              }}
              placeholder="Ex.: 3,5"
              placeholderTextColor="#85816C"
              keyboardType="decimal-pad"
            />
            {erroFormulario ? (
              <Text style={styles.erroFormulario} accessibilityRole="alert">
                {erroFormulario}
              </Text>
            ) : null}
            <Pressable
              style={styles.botaoRegistrar}
              onPress={registrarColeta}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotaoRegistrar}>Salvar coleta</Text>
            </Pressable>
            <Pressable
              style={styles.botaoCancelar}
              onPress={() => setMostrarFormulario(false)}
              accessibilityRole="button"
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function CartaoColeta({ coleta }) {
  return (
    <View style={styles.cartaoColeta}>
      <View style={styles.iconeColeta}>
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path
            d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"
            fill="none"
            stroke={CORES.branco}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <Path
            d="m7.5 9.5 4.5-2.5 4.5 2.5-4.5 2.5-4.5-2.5Zm4.5 2.5v5"
            fill="none"
            stroke={CORES.branco}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <View style={styles.detalhesColeta}>
        <View style={styles.linhaColeta}>
          <Text style={styles.nomeResponsavel}>{coleta.responsavel}</Text>
          <Text style={styles.pesoColeta}>{formatarPeso(coleta.peso)} kg</Text>
        </View>
        <View style={styles.etiqueta}>
          <Text style={styles.textoEtiqueta}>{coleta.modalidade}</Text>
        </View>
        <Text style={styles.materiais}>{coleta.materiais}</Text>
        <Text style={styles.endereco}>{coleta.ponto}</Text>
      </View>
    </View>
  );
}

function PainelSecundario({ aba }) {
  const agenda = aba === 'agenda';
  return (
    <View style={styles.painelSecundario}>
      <View style={styles.iconeVazio}>
        {agenda ? <IconeAgenda cor={CORES.verdeEscuro} /> : <IconeSolicitacoes cor={CORES.verdeEscuro} />}
      </View>
      <Text style={styles.tituloVazio}>
        {agenda ? 'Sua agenda de coletas' : 'Solicitações recebidas'}
      </Text>
      <Text style={styles.textoVazio}>
        {agenda
          ? 'Os agendamentos aparecerão aqui quando a integração administrativa estiver disponível.'
          : 'As solicitações dos moradores aparecerão aqui quando a integração administrativa estiver disponível.'}
      </Text>
      <Text style={styles.avisoDemo}>
        Área demonstrativa · Nenhum dado é carregado ou alterado no servidor.
      </Text>
    </View>
  );
}

function IconeColetas({ cor = CORES.branco }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"
        stroke={cor}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="m7.5 9.5 4.5-2.5 4.5 2.5-4.5 2.5-4.5-2.5Zm4.5 2.5v5"
        stroke={cor}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconeAgenda({ cor = CORES.branco }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={5}
        width={18}
        height={16}
        rx={2}
        stroke={cor}
        strokeWidth={2}
      />
      <Path
        d="M16 3v4M8 3v4M3 10h18"
        stroke={cor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function IconeSolicitacoes({ cor = CORES.branco }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10h18l-2-6H5l-2 6Zm2 0v10h14V10M9 20v-6h6v6"
        stroke={cor}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" stroke={cor} strokeWidth={2} />
    </Svg>
  );
}

function IconeSair() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 5H5v14h5m3-11 4 4-4 4m4-4H9"
        stroke={CORES.textoSecundario}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function formatarPeso(peso) {
  return Number.isInteger(peso)
    ? String(peso)
    : peso.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const hoje = new Date();
  const eHoje = data.toDateString() === hoje.toDateString();
  const dataFormatada = `${dia} de ${NOMES_MESES[data.getMonth()].toLowerCase()}`;
  return eHoje ? `Hoje, ${dataFormatada}` : dataFormatada;
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
    paddingTop: 10,
    paddingBottom: 24,
  },
  cabecalho: {
    minHeight: 52,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 150,
    height: 44,
  },
  acoesCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seloAdmin: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F4DF',
  },
  textoSeloAdmin: {
    color: CORES.verdeEscuro,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
  botaoSair: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloPagina: {
    color: CORES.texto,
    fontSize: rem(1.625),
    lineHeight: rem(2),
    fontFamily: 'Alexandria_700Bold',
  },
  subtituloPagina: {
    marginTop: 2,
    marginBottom: 16,
    color: CORES.textoSecundario,
    fontSize: rem(1.0625),
    fontFamily: 'Inter_400Regular',
  },
  botaoRegistrar: {
    minHeight: 46,
    marginBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 9,
    backgroundColor: CORES.verde,
  },
  mais: {
    color: CORES.branco,
    fontSize: rem(1.25),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  textoBotaoRegistrar: {
    color: CORES.branco,
    fontSize: rem(1.0625),
    fontFamily: 'Inter_700Bold',
  },
  navegacaoCalendario: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  botaoMes: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setaMes: {
    color: CORES.texto,
    fontSize: rem(1.5),
    lineHeight: rem(1.5),
  },
  mesAtual: {
    color: CORES.texto,
    fontSize: rem(1.0625),
    fontFamily: 'Inter_700Bold',
  },
  calendario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dia: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  nomeDia: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  numeroDia: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  numeroDiaSelecionado: {
    backgroundColor: CORES.verde,
  },
  diaForaDoMes: {
    opacity: 0.4,
  },
  textoNumeroDia: {
    color: CORES.texto,
    fontSize: rem(1),
    fontFamily: 'Inter_400Regular',
  },
  textoDiaSelecionado: {
    color: CORES.branco,
    fontFamily: 'Inter_700Bold',
  },
  resumo: {
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 15,
    backgroundColor: '#F1F4DF',
  },
  rotuloResumo: {
    color: CORES.verdeEscuro,
    fontSize: rem(0.9375),
    fontFamily: 'Inter_700Bold',
  },
  numerosResumo: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valorResumo: {
    color: CORES.texto,
    fontSize: rem(1.625),
    lineHeight: rem(2),
    fontFamily: 'Alexandria_700Bold',
  },
  descricaoResumo: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  divisorResumo: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
    backgroundColor: '#DDE3C4',
  },
  rodapeResumo: {
    color: CORES.texto,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  cabecalhoLista: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tituloLista: {
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  totalLista: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  cartaoColeta: {
    minHeight: 108,
    marginBottom: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    borderRadius: 14,
    backgroundColor: CORES.cinza,
  },
  iconeColeta: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: CORES.amarelo,
  },
  detalhesColeta: {
    flex: 1,
    gap: 6,
  },
  linhaColeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nomeResponsavel: {
    flex: 1,
    color: CORES.texto,
    fontSize: rem(1.0625),
    fontFamily: 'Alexandria_700Bold',
  },
  pesoColeta: {
    color: CORES.texto,
    fontSize: rem(1.0625),
    fontFamily: 'Alexandria_700Bold',
  },
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#E4E4E4',
  },
  textoEtiqueta: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  materiais: {
    color: CORES.texto,
    fontSize: rem(0.9375),
    fontFamily: 'Inter_400Regular',
  },
  endereco: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    fontFamily: 'Inter_400Regular',
  },
  avisoDemo: {
    marginTop: 4,
    marginBottom: 10,
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  painelSecundario: {
    minHeight: 320,
    marginTop: 24,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: CORES.cinza,
  },
  iconeVazio: {
    width: 62,
    height: 62,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 31,
    backgroundColor: '#F1F4DF',
  },
  tituloVazio: {
    marginBottom: 8,
    color: CORES.texto,
    fontSize: rem(1.375),
    textAlign: 'center',
    fontFamily: 'Alexandria_700Bold',
  },
  textoVazio: {
    color: CORES.textoSecundario,
    fontSize: rem(1.0625),
    lineHeight: rem(1.625),
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  fundoModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modal: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 30,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: CORES.branco,
  },
  tituloModal: {
    marginBottom: 18,
    color: CORES.texto,
    fontSize: rem(1.625),
    fontFamily: 'Alexandria_700Bold',
  },
  rotuloCampo: {
    marginBottom: 6,
    color: CORES.texto,
    fontSize: rem(1.0625),
    fontFamily: 'Inter_700Bold',
  },
  campo: {
    minHeight: 54,
    marginBottom: 14,
    paddingHorizontal: 12,
    borderRadius: 9,
    backgroundColor: CORES.cinza,
    color: CORES.texto,
    fontSize: rem(1.0625),
    fontFamily: 'Inter_400Regular',
  },
  botaoCancelar: {
    minHeight: 42,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCancelar: {
    color: CORES.textoSecundario,
    fontSize: rem(1.0625),
    fontFamily: 'Inter_700Bold',
  },
  erroFormulario: {
    marginBottom: 8,
    color: '#9E252C',
    fontSize: rem(0.9375),
    fontFamily: 'Inter_400Regular',
  },
});
