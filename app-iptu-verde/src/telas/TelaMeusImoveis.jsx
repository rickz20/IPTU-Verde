import { rem } from '../utils/typography';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import BotaoVoltar from '../components/BotaoVoltar';
import EstadoApi from '../components/EstadoApi';
import InformacaoPessoal from '../components/perfil/InformacaoPessoal';
import { CORES } from '../components/telaInicial/tema';
import { useApiData } from '../hooks/useApiData';

export default function TelaMeusImoveis({
  onVoltar,
  onAdicionarImovel,
  token,
}) {
  const {
    data: imoveis,
    error,
    loading,
    retry,
  } = useApiData('/imoveis', 'imoveis', token, Boolean(token));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.titulo}>Meus Imóveis</Text>
        </View>

        <EstadoApi
          loading={loading}
          error={error}
          empty={!loading && !error && imoveis.length === 0}
          onRetry={retry}
          emptyMessage="Não há imóveis vinculados a esta conta."
        />

        {!loading && !error
          ? imoveis.map((imovel) => (
              <CartaoImovel key={imovel.id} imovel={imovel} />
            ))
          : null}

        <Pressable
          style={styles.botaoAdicionar}
          onPress={onAdicionarImovel}
          accessibilityRole="button"
          accessibilityLabel="Adicionar imóvel"
        >
          <Svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke={CORES.verdeEscuro}
            strokeWidth={2}
            strokeLinecap="round"
          >
            <Path d="M12 5v14M5 12h14" />
          </Svg>
          <Text style={styles.textoBotaoAdicionar}>Adicionar imóvel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function CartaoImovel({ imovel }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.tituloCartao}>
        <IconeCasa />
        <Text style={styles.textoTituloCartao}>Dados do imóvel</Text>
      </View>
      <View style={styles.informacoes}>
        <InformacaoPessoal
          titulo="Rua"
          valor={imovel.rua || imovel.endereco || 'Não informado'}
        />
        {imovel.numero ? (
          <InformacaoPessoal titulo="Número" valor={imovel.numero} />
        ) : null}
        {imovel.bairro ? (
          <InformacaoPessoal titulo="Bairro" valor={imovel.bairro} />
        ) : null}
        {imovel.cep ? (
          <InformacaoPessoal titulo="CEP" valor={formatarCep(imovel.cep)} />
        ) : null}
        {imovel.cidade ? (
          <InformacaoPessoal titulo="Cidade" valor={imovel.cidade} />
        ) : null}
        {imovel.complemento ? (
          <InformacaoPessoal titulo="Complemento" valor={imovel.complemento} />
        ) : null}
        {imovel.inscricaoImobiliaria ? (
          <InformacaoPessoal
            titulo="Inscrição"
            valor={imovel.inscricaoImobiliaria}
          />
        ) : null}
        {imovel.vinculo ? (
          <InformacaoPessoal
            titulo="Vínculo"
            valor={formatarVinculo(imovel.vinculo)}
          />
        ) : null}
        {imovel.tipo ? (
          <InformacaoPessoal titulo="Tipo de imóvel" valor={imovel.tipo} />
        ) : null}
      </View>
    </View>
  );
}

function IconeCasa() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={CORES.texto}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityLabel="Dados do imóvel"
    >
      <Path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
    </Svg>
  );
}

function formatarCep(cep) {
  const digits = String(cep).replace(/\D/g, '');
  return digits.length === 8
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : cep;
}

function formatarVinculo(vinculo) {
  const vinculos = {
    proprietario: 'Proprietário',
    inquilino: 'Inquilino',
    residente: 'Residente',
  };
  return vinculos[vinculo] ?? vinculo;
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
    marginBottom: 28,
  },
  titulo: {
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  cartao: {
    marginBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderRadius: 16,
    backgroundColor: CORES.cinza,
  },
  tituloCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  textoTituloCartao: {
    color: CORES.texto,
    fontSize: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  informacoes: {
    paddingLeft: 24,
    gap: 2,
  },
  botaoAdicionar: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: -4,
    marginTop: 0,
    borderWidth: 1,
    borderColor: CORES.verdeEscuro,
    borderRadius: 8,
  },
  textoBotaoAdicionar: {
    color: CORES.texto,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
});
