import { useRef, useState } from 'react';
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
import BotaoVoltar from '../components/BotaoVoltar';
import IlustracaoDica from '../components/reciclagem/IlustracaoDica';
import { dicasReciclagem } from '../components/reciclagem/dadosDicasReciclagem';
import { CORES } from '../components/telaInicial/tema';

export default function TelaComoReciclar({ onVoltar }) {
  const [dicaSelecionada, setDicaSelecionada] = useState(null);
  const [passoAtual, setPassoAtual] = useState(0);
  const [larguraCarrossel, setLarguraCarrossel] = useState(0);
  const carrosselRef = useRef(null);

  function voltar() {
    if (dicaSelecionada) {
      setDicaSelecionada(null);
      setPassoAtual(0);
      return;
    }

    onVoltar();
  }

  function selecionarDica(dica) {
    setPassoAtual(0);
    setDicaSelecionada(dica);
  }

  function selecionarPasso(index) {
    setPassoAtual(index);
    carrosselRef.current?.scrollTo({
      x: index * larguraCarrossel,
      animated: true,
    });
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        dicaSelecionada && styles.containerTutorial,
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      {dicaSelecionada ? (
        <>
          <View style={styles.cabecalhoTutorial}>
            <BotaoVoltar onPress={voltar} />
            <View style={styles.textosCabecalho}>
              <Text style={styles.titulo}>{dicaSelecionada.titulo}</Text>
              <Text style={styles.subtitulo}>{dicaSelecionada.descricao}</Text>
            </View>
          </View>

          <ScrollView
            key={dicaSelecionada.id}
            ref={carrosselRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            style={styles.carrossel}
            onLayout={(event) =>
              setLarguraCarrossel(event.nativeEvent.layout.width)
            }
            onMomentumScrollEnd={(event) => {
              const largura = event.nativeEvent.layoutMeasurement.width;
              if (largura > 0) {
                setPassoAtual(
                  Math.round(event.nativeEvent.contentOffset.x / largura),
                );
              }
            }}
          >
            {dicaSelecionada.paginas.map((pagina, index) => (
              <View
                key={pagina.titulo}
                style={[
                  styles.pagina,
                  { width: larguraCarrossel || '100%' },
                ]}
              >
                <View style={styles.areaImagem}>
                  <IlustracaoDica tipo={pagina.ilustracao} />
                </View>

                <View style={styles.painelDica}>
                  <Text style={styles.tituloDica}>{pagina.titulo}</Text>
                  <Text style={styles.descricaoDica}>{pagina.descricao}</Text>

                  <View style={styles.indicadores}>
                    {dicaSelecionada.paginas.map((item, indicadorIndex) => (
                      <Pressable
                        key={item.titulo}
                        onPress={() => selecionarPasso(indicadorIndex)}
                        accessibilityRole="button"
                        accessibilityLabel={`Ir para a dica ${indicadorIndex + 1} de ${dicaSelecionada.paginas.length}`}
                        accessibilityState={{
                          selected: passoAtual === indicadorIndex,
                        }}
                        style={[
                          styles.indicador,
                          passoAtual === indicadorIndex &&
                            styles.indicadorSelecionado,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cabecalho}>
            <BotaoVoltar onPress={voltar} />
            <View style={styles.textosCabecalho}>
              <Text style={styles.titulo}>Dicas de reciclagem</Text>
              <Text style={styles.subtitulo}>
                Aprenda, pratique e faça a diferença
              </Text>
            </View>
          </View>

          <View style={styles.lista}>
            {dicasReciclagem.map((dica) => (
              <Pressable
                key={dica.id}
                style={styles.cartao}
                onPress={() => selecionarDica(dica)}
                accessibilityRole="button"
                accessibilityLabel={`${dica.titulo}. ${dica.descricao}`}
              >
                <View style={styles.ilustracaoCartao}>
                  <Text style={styles.iconeReciclagem}>♻</Text>
                </View>
                <View style={styles.textosCartao}>
                  <Text style={styles.tituloCartao}>{dica.titulo}</Text>
                  <Text style={styles.descricaoCartao}>{dica.descricao}</Text>
                </View>
                <Text style={styles.setaCartao}>›</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  containerTutorial: {
    backgroundColor: CORES.verde,
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
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cabecalhoTutorial: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: CORES.branco,
  },
  carrossel: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  pagina: {
    flex: 1,
  },
  areaImagem: {
    flex: 1.5,
    minHeight: 120,
    overflow: 'hidden',
    backgroundColor: CORES.branco,
  },
  painelDica: {
    flex: 1,
    minHeight: 205,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: CORES.verde,
  },
  tituloDica: {
    marginBottom: 14,
    color: CORES.branco,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    textAlign: 'center',
    fontFamily: 'Alexandria_700Bold',
  },
  descricaoDica: {
    maxWidth: 330,
    color: CORES.branco,
    fontSize: rem(0.875),
    lineHeight: rem(1.125),
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  indicadores: {
    marginTop: 'auto',
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  indicador: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#78930A',
  },
  indicadorSelecionado: {
    backgroundColor: CORES.branco,
  },
  textosCabecalho: {
    flex: 1,
  },
  titulo: {
    color: CORES.texto,
    fontSize: rem(1.25),
    lineHeight: rem(1.5),
    fontFamily: 'Alexandria_700Bold',
  },
  subtitulo: {
    color: CORES.texto,
    fontSize: rem(0.875),
    lineHeight: rem(1.125),
    fontFamily: 'Inter_400Regular',
  },
  lista: {
    gap: 10,
  },
  cartao: {
    minHeight: 82,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 17,
    backgroundColor: CORES.cinza,
  },
  ilustracaoCartao: {
    width: '40%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: CORES.amarelo,
  },
  iconeReciclagem: {
    color: '#F2C75F',
    fontSize: rem(2.5),
  },
  textosCartao: {
    flex: 1,
    gap: 3,
  },
  tituloCartao: {
    color: CORES.texto,
    fontSize: rem(0.875),
    lineHeight: rem(1.125),
    fontFamily: 'Alexandria_700Bold',
  },
  descricaoCartao: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    lineHeight: rem(1.125),
    fontFamily: 'Inter_400Regular',
  },
  setaCartao: {
    alignSelf: 'flex-start',
    marginTop: -4,
    color: '#C55B1E',
    fontSize: rem(1.75),
    lineHeight: rem(1.75),
  },
});
