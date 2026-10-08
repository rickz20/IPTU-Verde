import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BotaoVoltar from '../components/BotaoVoltar';
import IconePerfil from '../components/IconePerfil';
import InformacaoPessoal from '../components/perfil/InformacaoPessoal';
import { CORES } from '../components/telaInicial/tema';

const DADOS_PESSOAIS = [
  { titulo: 'Nome', valor: 'Cecílio Alencar' },
  { titulo: 'CPF', valor: '*********00-05' },
  { titulo: 'Estado civil', valor: 'Casado' },
  { titulo: 'E-mail', valor: 'emaildefulano@gmail.com' },
  { titulo: 'Telefone', valor: '(00) 00000-0000' },
];

export default function TelaMeusDados({ onVoltar }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <BotaoVoltar onPress={onVoltar} />
          <Text style={styles.tituloCabecalho}>Meus dados</Text>
        </View>

        <View style={styles.secao}>
          <View style={styles.tituloSecao}>
            <IconePerfil nome="usuario" cor={CORES.texto} tamanho={20} />
            <Text style={styles.textoTituloSecao}>Dados pessoais</Text>
          </View>

          <View style={styles.listaDados}>
            {DADOS_PESSOAIS.map((dado) => (
              <InformacaoPessoal
                key={dado.titulo}
                titulo={dado.titulo}
                valor={dado.valor}
              />
            ))}
          </View>
        </View>

        <Image
          source={require('../../assets/logo-iptu-verde.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="IPTU Verde Quixadá"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 24,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tituloCabecalho: {
    color: CORES.texto,
    fontSize: 18,
    fontFamily: 'Alexandria_700Bold',
  },
  secao: {
    marginTop: 38,
    marginLeft: 10,
  },
  tituloSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textoTituloSecao: {
    color: CORES.texto,
    fontSize: 17,
    fontFamily: 'Alexandria_700Bold',
  },
  listaDados: {
    marginTop: 8,
    marginLeft: 24,
    gap: 8,
  },
  logo: {
    width: 92,
    height: 50,
    alignSelf: 'center',
    marginTop: 'auto',
  },
});
