import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AdminIcon from './AdminIcon';
import { Botao, Page, styles, Titulo } from './ui';
import { toLocalIso } from './CalendarPicker';

const LEGACY_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
];

function monthOffset(date, offset) {
  const first = new Date(date.getFullYear(), date.getMonth() + offset, 1);
  const day = Math.min(date.getDate(), new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate());
  return new Date(first.getFullYear(), first.getMonth(), day);
}

function getDailyCapacity(schedule) {
  if (!schedule) return LEGACY_SLOTS.length;
  const minute = (value) => {
    const [hour, mins] = value.split(':').map(Number);
    return hour * 60 + mins;
  };
  const duration = Number(schedule.duracaoMinutos);
  if (!duration) return 0;
  const morning = Math.max(0, minute(schedule.inicioPausa) - minute(schedule.abertura));
  const afternoon = Math.max(0, minute(schedule.encerramento) - minute(schedule.fimPausa));
  return Math.floor(morning / duration) + Math.floor(afternoon / duration);
}

export default function AgendaScreen({
  agendamentos,
  pontos,
  loading,
  error,
  onRetry,
  onConfigure,
  onLoadConfiguration,
  onOpenBooking,
  onLogout,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState(null);
  const [scheduleError, setScheduleError] = useState('');
  const [loadedPointId, setLoadedPointId] = useState('');
  const activePointId = pontos[0]?.id || '';
  const scheduleLoading = Boolean(activePointId) && activePointId !== loadedPointId;
  const week = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - ((selectedDate.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  useEffect(() => {
    let active = true;
    if (!activePointId) return () => { active = false; };
    onLoadConfiguration(activePointId)
      .then((result) => {
        if (active) {
          setSchedule(result);
          setScheduleError('');
          setLoadedPointId(activePointId);
        }
      })
      .catch((requestError) => {
        if (active) {
          setScheduleError(requestError.message);
          setLoadedPointId(activePointId);
        }
      });
    return () => { active = false; };
  }, [activePointId, onLoadConfiguration]);

  const date = toLocalIso(selectedDate);
  const selectedPoint = pontos.find((point) => point.id === activePointId);
  const scheduledForDate = !schedule
    ? true
    : Array.isArray(schedule.datas)
      ? schedule.datas.includes(date)
      : (schedule.diasSemana || []).includes(selectedDate.getDay());
  const pointBookings = agendamentos.filter((item) =>
    item.data === date &&
    item.pontoId === activePointId &&
    !['recusado', 'rejected'].includes(item.status),
  );
  const todayBookings = agendamentos
    .filter((item) =>
      item.data === date &&
      (!activePointId || item.pontoId === activePointId) &&
      !['recusado', 'rejected'].includes(item.status),
    )
    .sort((a, b) => String(a.horario).localeCompare(String(b.horario)));
  const accepted = todayBookings.filter((item) => item.status === 'aceito').length;
  const pending = todayBookings.filter((item) => !['aceito', 'recusado', 'rejected'].includes(item.status)).length;
  const dailyCapacity = getDailyCapacity(schedule);
  const free = scheduledForDate ? Math.max(0, dailyCapacity - pointBookings.length) : 0;
  const month = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <Page onLogout={onLogout}>
      <Titulo title="Agenda de atendimento" subtitle="Organize os horários e acompanhe as vagas." />
      <Botao title="☷  Configurar atendimento" onPress={onConfigure} />
      <View style={styles.row}>
        <Pressable onPress={() => setSelectedDate((current) => monthOffset(current, -1))} accessibilityLabel="Mês anterior"><Text style={styles.title}>‹</Text></Pressable>
        <Text style={[styles.body, { textTransform: 'capitalize', fontFamily: 'Inter_700Bold' }]}>{month}</Text>
        <Pressable onPress={() => setSelectedDate((current) => monthOffset(current, 1))} accessibilityLabel="Próximo mês"><Text style={styles.title}>›</Text></Pressable>
      </View>
      <View style={[styles.row, { marginTop: 8, marginBottom: 12 }]}>
        {week.map((day) => {
          const chosen = day.toDateString() === selectedDate.toDateString();
          return (
            <Pressable key={toLocalIso(day)} onPress={() => setSelectedDate(day)} style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }} accessibilityRole="button" accessibilityState={{ selected: chosen }}>
              <Text style={styles.muted}>{day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</Text>
              <View style={{ marginTop: 6, width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: chosen ? '#95B509' : 'transparent' }}>
                <Text style={[styles.body, chosen && { color: '#fff' }]}>{day.getDate()}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.summary}>
        <Text style={styles.muted}>Resumo do dia</Text>
        <Text style={[styles.body, { marginTop: 8, fontFamily: 'Alexandria_700Bold' }]}>{selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</Text>
        <View style={[styles.row, { marginTop: 10 }]}>
          <View><Text style={styles.title}>{accepted}</Text><Text style={styles.muted}>aceita</Text></View>
          <View><Text style={styles.title}>{pending}</Text><Text style={styles.muted}>pendentes</Text></View>
          <View><Text style={styles.title}>{scheduleLoading ? '…' : free}</Text><Text style={styles.muted}>vagas livres</Text></View>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Próximas coletas do dia</Text>
      <Text style={styles.muted}>Organizadas cronologicamente.</Text>
      {selectedPoint ? <Text style={[styles.muted, { marginTop: 6 }]}>{selectedPoint.nome} · {selectedPoint.cidade || selectedPoint.endereco}</Text> : null}
      {scheduleError ? <Text style={styles.error}>{scheduleError}</Text> : null}
      {loading || scheduleLoading ? <Text style={styles.empty}>Carregando agenda...</Text> : error ? <><Text style={styles.error}>{error}</Text><Botao title="Tentar novamente" outline onPress={onRetry} /></> : todayBookings.length === 0 ? <Text style={styles.empty}>{scheduledForDate ? 'Nenhuma coleta agendada nesta data.' : 'Não há atendimento nesta data.'}</Text> : todayBookings.map((booking) => (
        <Pressable key={booking.id} onPress={() => onOpenBooking(booking)} style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.body, { fontFamily: 'Alexandria_700Bold' }]}>{booking.solicitante?.nome || 'Solicitante'} · #{booking.id.slice(0, 4)}</Text>
            <Text style={{ color: booking.coletaId ? '#596900' : booking.status === 'aceito' ? '#737373' : '#D99A19', fontFamily: 'Inter_700Bold' }}>{booking.coletaId ? 'Coletada' : booking.status === 'aceito' ? 'Aceita' : 'Pendente'}</Text>
          </View>
          <View style={[styles.row, { justifyContent: 'flex-start', gap: 6, marginTop: 8 }]}>
            <AdminIcon name="horario" />
            <Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>{booking.horario}</Text>
          </View>
          <View style={[styles.row, { justifyContent: 'flex-start', gap: 6, marginTop: 5 }]}>
            <AdminIcon name="localizacao" />
            <Text style={styles.muted}>{booking.ponto || booking.endereco}{booking.ponto && selectedPoint?.cidade ? ` · ${selectedPoint.cidade}` : ''}</Text>
          </View>
        </Pressable>
      ))}
    </Page>
  );
}
