import { rem } from '../utils/typography';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardMeuAgendamento from '../components/agendamentos/CardMeuAgendamento';
import EstadoApi from '../components/EstadoApi';
import MenuInferior from '../components/telaInicial/MenuInferior';
import { CORES } from '../components/telaInicial/tema';
import { useApiData } from '../hooks/useApiData';

export default function MeusAgendamentos({ onSelecionarAba, token }) {
  const [abaSelecionada, setAbaSelecionada] = useState('agendamentos');
  const {
    data: agendamentos,
    error,
    loading,
    retry,
  } = useApiData('/agendamentos', 'agendamentos', token, Boolean(token));

  function selecionarAba(aba) {
    setAbaSelecionada(aba);
    onSelecionarAba?.(aba);
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
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
          <EstadoApi
            loading={loading}
            error={error}
            empty={!loading && !error && agendamentos.length === 0}
            onRetry={retry}
            emptyMessage="Você ainda não tem agendamentos."
          />
          {!loading && !error
            ? agendamentos.map((agendamento) => (
                <CardMeuAgendamento
                  key={agendamento.id}
                  agendamento={{
                    ...agendamento,
                    data: formatarData(agendamento.data),
                    modalidade:
                      agendamento.modalidade === 'domicilio'
                        ? 'Coleta em domicílio'
                        : 'Entrega no ponto de coleta',
                    materiais: Array.isArray(agendamento.materiais)
                      ? agendamento.materiais.join(', ')
                      : agendamento.materiais,
                  }}
                />
              ))
            : null}
        </View>
      </ScrollView>

      <MenuInferior
        selecionado={abaSelecionada}
        onSelecionar={selecionarAba}
      />
    </SafeAreaView>
  );
}

function formatarData(data) {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return data ?? '';
  }

  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
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
    fontSize: rem(1.25),
    lineHeight: rem(1.5),
    fontFamily: 'Alexandria_700Bold',
  },
  descricao: {
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  lista: {
    gap: 8,
  },
});
