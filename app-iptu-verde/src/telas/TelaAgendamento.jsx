import { rem } from '../utils/typography';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import CardPontoColeta from '../components/agendamentos/CardPontoColeta';
import { pontosColeta } from '../components/agendamentos/dadosPontosColeta';
import MenuInferior from '../components/telaInicial/MenuInferior';
import { CORES } from '../components/telaInicial/tema';

export default function TelaAgendamento({ onSelecionarAba }) {
  const [abaSelecionada, setAbaSelecionada] = useState('inicio');

  function selecionarAba(aba) {
    setAbaSelecionada(aba);
    onSelecionarAba?.(aba);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>Locais e agendamento de coletas</Text>
        </View>

        <Text style={styles.descricao}>
          Veja os melhores locais e horários para visitar os nossos pontos de
          coleta ou agende a busca em domicílio.
        </Text>

        <View style={styles.listaPontos}>
          {pontosColeta.map((ponto) => (
            <CardPontoColeta key={ponto.id} ponto={ponto} />
          ))}
        </View>
      </ScrollView>

      <MenuInferior
        selecionado={abaSelecionada}
        onSelecionar={selecionarAba}
      />
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
});
