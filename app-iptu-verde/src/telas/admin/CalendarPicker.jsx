import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from '../../components/telaInicial/tema';

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function toLocalIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function fromIso(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function displayDate(value) {
  if (!value) return '';
  return fromIso(value).toLocaleDateString('pt-BR');
}

export default function CalendarPicker({
  visible,
  value,
  values = [],
  onChange,
  onChangeValues,
  onClose,
  multiple = false,
  title = 'Selecione a data',
}) {
  const initialDate = multiple && values.length
    ? fromIso(values[0])
    : value
      ? fromIso(value)
      : new Date();
  const [month, setMonth] = useState(initialDate.getMonth());
  const [year, setYear] = useState(initialDate.getFullYear());
  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - offset + 1;
      if (dayNumber < 1) {
        return { date: new Date(year, month - 1, previousMonthDays + dayNumber), current: false };
      }
      if (dayNumber > numberOfDays) {
        return { date: new Date(year, month + 1, dayNumber - numberOfDays), current: false };
      }
      return { date: new Date(year, month, dayNumber), current: true };
    });
  }, [month, year]);

  function changeMonth(delta) {
    const next = new Date(year, month + delta, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  }

  function selectDate(date) {
    const iso = toLocalIso(date);
    if (multiple) {
      const selected = new Set(values);
      if (selected.has(iso)) selected.delete(iso);
      else selected.add(iso);
      onChangeValues([...selected].sort());
      return;
    }
    onChange(iso);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.monthRow}>
            <Pressable onPress={() => changeMonth(-1)} style={styles.arrow} accessibilityLabel="Mês anterior"><Text style={styles.arrowText}>‹</Text></Pressable>
            <Text style={styles.month}>{MONTHS[month]} de {year}</Text>
            <Pressable onPress={() => changeMonth(1)} style={styles.arrow} accessibilityLabel="Próximo mês"><Text style={styles.arrowText}>›</Text></Pressable>
          </View>
          <View style={styles.grid}>
            {WEEKDAYS.map((day) => <Text key={day} style={styles.weekday}>{day}</Text>)}
            {days.map(({ date, current }) => {
              const iso = toLocalIso(date);
              const selected = multiple ? values.includes(iso) : iso === value;
              return (
                <Pressable key={iso} onPress={() => selectDate(date)} style={styles.dayCell}>
                  <View style={[styles.dayCircle, selected && styles.selectedDay]}>
                    <Text style={[styles.dayText, !current && styles.outsideMonth, selected && styles.selectedText]}>{date.getDate()}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          {multiple ? (
            <View style={styles.footer}>
              <Pressable onPress={onClose} style={styles.cancel}><Text style={styles.cancelText}>Cancelar</Text></Pressable>
              <Pressable onPress={onClose} style={styles.confirm}><Text style={styles.confirmText}>Confirmar dias</Text></Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

export function InlineCalendar({ values, onChangeValues, initialDate = new Date() }) {
  const [month, setMonth] = useState(initialDate.getMonth());
  const [year, setYear] = useState(initialDate.getFullYear());
  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - offset + 1;
      if (dayNumber < 1) return { date: new Date(year, month - 1, previousMonthDays + dayNumber), current: false };
      if (dayNumber > numberOfDays) return { date: new Date(year, month + 1, dayNumber - numberOfDays), current: false };
      return { date: new Date(year, month, dayNumber), current: true };
    });
  }, [month, year]);
  function changeMonth(delta) {
    const next = new Date(year, month + delta, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  }
  function toggle(date) {
    const value = toLocalIso(date);
    if (value < new Date().toISOString().slice(0, 10)) return;
    onChangeValues(values.includes(value)
      ? values.filter((selected) => selected !== value)
      : [...values, value].sort());
  }
  return (
    <View style={styles.inline}>
      <View style={styles.monthRow}>
        <Pressable onPress={() => changeMonth(-1)} style={styles.arrow} accessibilityLabel="Mês anterior"><Text style={styles.arrowText}>‹</Text></Pressable>
        <Text style={styles.month}>{MONTHS[month]} de {year}</Text>
        <Pressable onPress={() => changeMonth(1)} style={styles.arrow} accessibilityLabel="Próximo mês"><Text style={styles.arrowText}>›</Text></Pressable>
      </View>
      <View style={styles.grid}>
        {WEEKDAYS.map((day) => <Text key={day} style={styles.weekday}>{day}</Text>)}
        {days.map(({ date, current }) => {
          const value = toLocalIso(date);
          const selected = values.includes(value);
          const disabled = value < new Date().toISOString().slice(0, 10);
          return (
            <Pressable key={value} onPress={() => toggle(date)} disabled={disabled} style={styles.dayCell}>
              <View style={[styles.dayCircle, selected && styles.selectedDay]}>
                <Text style={[styles.dayText, !current && styles.outsideMonth, selected && styles.selectedText, disabled && styles.disabledDay]}>{date.getDate()}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.35)' },
  modal: { padding: 18, borderRadius: 18, backgroundColor: CORES.branco },
  inline: { padding: 10, borderWidth: 1, borderColor: '#DCDCDC', borderRadius: 14, backgroundColor: CORES.branco },
  title: { color: CORES.texto, fontSize: 18, fontFamily: 'Alexandria_700Bold' },
  monthRow: { marginTop: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: CORES.texto, fontSize: 26 },
  month: { color: CORES.texto, fontSize: 16, fontFamily: 'Inter_700Bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.2857%', paddingVertical: 8, color: CORES.textoSecundario, textAlign: 'center', fontSize: 12, fontFamily: 'Inter_400Regular' },
  dayCell: { width: '14.2857%', height: 43, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  selectedDay: { backgroundColor: CORES.verde },
  dayText: { color: CORES.texto, fontSize: 14, fontFamily: 'Inter_400Regular' },
  outsideMonth: { color: '#B9B9B9' },
  disabledDay: { color: '#D5D5D5' },
  selectedText: { color: CORES.branco, fontFamily: 'Inter_700Bold' },
  footer: { marginTop: 14, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancel: { paddingHorizontal: 14, paddingVertical: 11 },
  cancelText: { color: CORES.textoSecundario, fontFamily: 'Inter_700Bold' },
  confirm: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 9, backgroundColor: CORES.verde },
  confirmText: { color: CORES.branco, fontFamily: 'Inter_700Bold' },
});
