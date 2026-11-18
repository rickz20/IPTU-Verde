import { rem } from '../../utils/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CORES } from '../../components/telaInicial/tema';

const ABAS = [
  { id: 'coletas', title: 'Coletas', icon: 'box' },
  { id: 'agenda', title: 'Agenda', icon: 'calendar' },
  { id: 'solicitacoes', title: 'Solicitações', icon: 'inbox' },
];

function Icone({ name }) {
  if (name === 'calendar') {
    return <><Rect x={3} y={5} width={18} height={16} rx={2} stroke="#fff" strokeWidth={2} /><Path d="M16 3v4M8 3v4M3 10h18" stroke="#fff" strokeWidth={2} strokeLinecap="round" /></>;
  }
  if (name === 'inbox') {
    return <Path d="M3 10h18l-2-6H5l-2 6Zm2 0v10h14V10M9 20v-6h6v6" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />;
  }
  return <><Path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" stroke="#fff" strokeWidth={2} strokeLinejoin="round" /><Path d="m7.5 9.5 4.5-2.5 4.5 2.5-4.5 2.5-4.5-2.5Zm4.5 2.5v5" stroke="#fff" strokeWidth={1.7} strokeLinejoin="round" /></>;
}

export default function MenuAdmin({ selected, onSelect }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.menu, { paddingBottom: Math.max(8, insets.bottom) }]}>
      {ABAS.map(({ id, title, icon }) => (
        <Pressable key={id} onPress={() => onSelect(id)} style={styles.item} accessibilityRole="button" accessibilityState={{ selected: selected === id }}>
          <View style={[styles.icon, selected === id && styles.selected]}><Svg width={23} height={23} viewBox="0 0 24 24" fill="none"><Icone name={icon} /></Svg></View>
          <Text style={[styles.text, selected === id && styles.bold]}>{title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { minHeight: 66, paddingTop: 5, paddingHorizontal: 8, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: CORES.verde },
  item: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', gap: 2 },
  icon: { width: 48, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  selected: { backgroundColor: '#7F9C08' },
  text: { color: '#fff', fontSize: rem(0.75), fontFamily: 'Inter_400Regular' },
  bold: { fontFamily: 'Inter_700Bold' },
});
