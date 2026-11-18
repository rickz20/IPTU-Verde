import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AdminIcon from './AdminIcon';
import { AdminTabs, Botao, formatarData, formatarPeso, materiaisDoAgendamento, Page, pesoDoAgendamento, styles, Titulo } from './ui';

const TABS = [
  { id: 'pendente', title: 'Pendentes' },
  { id: 'aceito', title: 'Aceitas' },
  { id: 'recusado', title: 'Recusadas' },
];

export default function SolicitacoesScreen({ agendamentos, loading, error, onRetry, onOpen, onLogout }) {
  const [status, setStatus] = useState('pendente');
  const [mode, setMode] = useState('todas');
  const requests = useMemo(() => agendamentos.filter((item) => {
    const pending = !['aceito', 'recusado'].includes(item.status);
    const matchesStatus = status === 'pendente' ? pending : item.status === status;
    const matchesMode = mode === 'todas' || item.modalidade === mode;
    return matchesStatus && matchesMode;
  }), [agendamentos, mode, status]);
  const pending = agendamentos.filter((item) => !['aceito', 'recusado'].includes(item.status));
  const homeCount = pending.filter((item) => item.modalidade === 'domicilio').length;
  const pointCount = pending.length - homeCount;

  return (
    <Page onLogout={onLogout}>
      <Titulo title="Solicitações de agendamento" subtitle="Analise os pedidos antes de confirmar uma vaga." />
      <AdminTabs items={TABS.map((tab) => {
        const count = tab.id === 'pendente'
          ? pending.length
          : agendamentos.filter((item) => item.status === tab.id).length;
        return { ...tab, title: `${tab.title} ${count}` };
      })} selected={status} onSelect={setStatus} />
      <Text style={styles.sectionTitle}>Modalidade</Text>
      <View style={[styles.row, { flexWrap: 'wrap', justifyContent: 'flex-start', marginVertical: 8 }]}>
        {[['todas', 'Todas'], ['domicilio', 'Coleta em domicílio'], ['ponto', 'Entrega no ponto de coleta']].map(([value, title]) => (
          <Pressable key={value} onPress={() => setMode(value)} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 16, backgroundColor: mode === value ? '#F1F4DF' : '#F3F3F3' }}><Text style={styles.muted}>{title}</Text></Pressable>
        ))}
      </View>
      {status === 'pendente' ? <View style={[styles.summary, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}><AdminIcon name="informacao" size={20} /><View><Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>{pending.length} solicitações aguardando análise</Text><Text style={[styles.muted, { marginTop: 4 }]}>{homeCount} coletas em domicílio · {pointCount} entrega no ponto de coleta.</Text></View></View> : null}
      {loading ? <Text style={styles.empty}>Carregando solicitações...</Text> : error ? <><Text style={styles.error}>{error}</Text><Botao title="Tentar novamente" outline onPress={onRetry} /></> : requests.length === 0 ? <Text style={styles.empty}>Nenhuma solicitação nesta categoria.</Text> : requests.map((booking) => (
        <Pressable key={booking.id} onPress={() => onOpen(booking)} style={styles.card}>
          <View style={styles.row}><Text style={[styles.body, { fontFamily: 'Alexandria_700Bold' }]}>{booking.solicitante?.nome || 'Solicitante'}</Text><Text style={{ color: status === 'pendente' ? '#D99A19' : '#6D8C09', fontFamily: 'Inter_700Bold' }}>{booking.coletaId ? 'Coletada' : status === 'pendente' ? 'Pendente' : status === 'aceito' ? 'Aceita' : 'Recusada'}</Text></View>
          <View style={[styles.row, { justifyContent: 'flex-start', gap: 6, marginVertical: 10 }]}>
            <AdminIcon name={booking.modalidade === 'domicilio' ? 'domicilio' : 'localizacao'} />
            <Text style={styles.muted}>{booking.modalidade === 'domicilio' ? 'Coleta em domicílio' : 'Entrega no ponto de coleta'}</Text>
          </View>
          <Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>{formatarData(booking.data)} · {booking.horario}</Text>
          <Text style={[styles.muted, { marginTop: 7 }]}>{booking.endereco}</Text>
          <Text style={[styles.body, { marginTop: 8 }]}>
            {materiaisDoAgendamento(Array.isArray(booking.materiais) ? booking.materiais : []).join(' e ')}
            {pesoDoAgendamento(booking.materiais || []) > 0 ? ` · ${formatarPeso(pesoDoAgendamento(booking.materiais))} kg` : ''}
          </Text>
          <Text style={{ marginTop: 8, color: '#758E00', textAlign: 'right', fontSize: 20 }}>›</Text>
        </Pressable>
      ))}
    </Page>
  );
}
