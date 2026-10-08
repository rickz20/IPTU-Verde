import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CardMeuAgendamento from '../components/agendamentos/CardMeuAgendamento';
import { meusAgendamentos } from '../components/agendamentos/dadosMeusAgendamentos';
import MenuInferior from '../components/telaInicial/MenuInferior';
import { CORES } from '../components/telaInicial/tema';

export default function MeusAgendamentos({ onSelecionarAba }) {
  const [abaSelecionada, setAbaSelecionada] = useState('agendamentos');

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
          <Text style={styles.titulo}>Meus agendamentos</Text>
          <Text style={styles.descricao}>
            Acompanhe por aqui seus agendamentos futuros
          </Text>
        </View>

        <View style={styles.lista}>
          {meusAgendamentos.map((agendamento) => (
            <CardMeuAgendamento
              key={agendamento.id}
              agendamento={agendamento}
            />
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
    paddingTop: 42,
    paddingBottom: 24,
  },
  cabecalho: {
    marginBottom: 24,
  },
  titulo: {
    color: CORES.texto,
    fontSize: 19,
    lineHeight: 24,
    fontFamily: 'Alexandria_700Bold',
  },
  descricao: {
    color: CORES.texto,
    fontSize: 9,
    lineHeight: 13,
    fontFamily: 'Inter_400Regular',
  },
  lista: {
    gap: 8,
  },
});
