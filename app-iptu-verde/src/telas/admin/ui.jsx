import { rem } from '../../utils/typography';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import SimboloIptuVerde from '../../../assets/SIMBOLO.svg';
import { CORES } from '../../components/telaInicial/tema';

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: CORES.branco },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  header: { width: '100%', minHeight: 84, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
  subHeader: { minHeight: 64, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: CORES.amarelo },
  subHeaderText: { flex: 1 },
  subTitle: { color: CORES.texto, fontSize: rem(1.25), fontFamily: 'Alexandria_700Bold' },
  subSubtitle: { marginTop: 2, color: CORES.textoSecundario, fontSize: rem(0.75), fontFamily: 'Inter_400Regular' },
  logo: { width: 84, height: 84 },
  badge: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F1F4DF', flexShrink: 1 },
  badgeText: { color: CORES.verdeEscuro, fontSize: rem(0.75), fontFamily: 'Inter_700Bold' },
  logout: { width: 36, height: 40, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { color: CORES.texto, fontSize: rem(1.5), lineHeight: rem(1.9), fontFamily: 'Alexandria_700Bold' },
  subtitle: { marginTop: 2, marginBottom: 16, color: CORES.textoSecundario, fontSize: rem(0.875), lineHeight: rem(1.25), fontFamily: 'Inter_400Regular' },
  sectionTitle: { marginTop: 16, marginBottom: 6, color: CORES.texto, fontSize: rem(1.0625), fontFamily: 'Alexandria_700Bold' },
  body: { color: CORES.texto, fontSize: rem(0.875), lineHeight: rem(1.3), fontFamily: 'Inter_400Regular' },
  muted: { color: CORES.textoSecundario, fontSize: rem(0.75), lineHeight: rem(1.2), fontFamily: 'Inter_400Regular' },
  card: { marginBottom: 10, padding: 16, borderRadius: 16, backgroundColor: CORES.cinza },
  summary: { marginVertical: 12, padding: 16, borderRadius: 16, backgroundColor: '#F1F4DF' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  button: { minHeight: 46, marginBottom: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9, backgroundColor: CORES.verde },
  buttonText: { color: CORES.branco, fontSize: rem(0.875), fontFamily: 'Inter_700Bold' },
  outlineButton: { minHeight: 44, marginBottom: 10, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CORES.verdeEscuro, borderRadius: 9 },
  outlineText: { color: CORES.verdeEscuro, fontSize: rem(0.875), fontFamily: 'Inter_700Bold' },
  fieldLabel: { marginTop: 10, marginBottom: 6, color: CORES.texto, fontSize: rem(0.75), fontFamily: 'Inter_700Bold' },
  input: { minHeight: 46, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 9, backgroundColor: '#F0F0F0', color: CORES.texto, fontSize: rem(0.875), fontFamily: 'Inter_400Regular' },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  error: { marginBottom: 10, color: '#A52B20', fontSize: rem(0.8), fontFamily: 'Inter_400Regular' },
  empty: { padding: 20, color: CORES.textoSecundario, textAlign: 'center', fontSize: rem(0.875), fontFamily: 'Inter_400Regular' },
  tabs: { flexDirection: 'row', gap: 6, marginVertical: 12 },
  tab: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: CORES.cinza },
  tabSelected: { backgroundColor: CORES.verde },
  tabText: { color: CORES.textoSecundario, fontSize: rem(0.72), fontFamily: 'Inter_700Bold' },
  tabTextSelected: { color: CORES.branco },
});

export function AdminHeader({ onLogout }) {
  return (
    <View style={styles.header}>
      <SimboloIptuVerde width={84} height={84} style={styles.logo} accessibilityLabel="Símbolo IPTU Verde" />
      <View style={styles.headerActions}>
        <View style={styles.badge}><Text style={styles.badgeText} numberOfLines={1}>Administrador</Text></View>
        <Pressable onPress={onLogout} style={styles.logout} accessibilityRole="button" accessibilityLabel="Sair da conta">
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M10 5H5v14h5m3-11 4 4-4 4m4-4H9" stroke={CORES.textoSecundario} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

export function AdminSubHeader({ title, subtitle, onBack }) {
  return (
    <View style={styles.subHeader}>
      <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Voltar">
        <Text style={{ color: CORES.branco, fontSize: 25, lineHeight: 28 }}>‹</Text>
      </Pressable>
      <View style={styles.subHeaderText}>
        <Text style={styles.subTitle}>{title}</Text>
        {subtitle ? <Text style={styles.subSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export function Titulo({ title, subtitle }) {
  return <><Text style={styles.title}>{title}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</>;
}

export function Botao({ title, onPress, outline = false, disabled = false }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" style={[outline ? styles.outlineButton : styles.button, disabled && { opacity: 0.55 }]}>
      <Text style={outline ? styles.outlineText : styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export function Campo({ label, value, onChangeText, placeholder, multiline = false, keyboardType, editable = true }) {
  return (
    <View>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={CORES.textoSecundario}
        multiline={multiline}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
}

export function AdminTabs({ items, selected, onSelect }) {
  return (
    <View style={styles.tabs}>
      {items.map((item) => (
        <Pressable key={item.id} onPress={() => onSelect(item.id)} style={[styles.tab, selected === item.id && styles.tabSelected]} accessibilityRole="button">
          <Text style={[styles.tabText, selected === item.id && styles.tabTextSelected]}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Page({ children, onLogout, headerTitle, headerSubtitle, onBack }) {
  return (
    <View style={styles.page}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {headerTitle ? <AdminSubHeader title={headerTitle} subtitle={headerSubtitle} onBack={onBack} /> : <AdminHeader onLogout={onLogout} />}
        {children}
      </ScrollView>
    </View>
  );
}

export function formatarPeso(value) {
  const peso = Number(value) || 0;
  return Number.isInteger(peso) ? String(peso) : peso.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

export function formatarData(value) {
  if (!value) return '';
  const date = value instanceof Date
    ? value
    : typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : typeof value === 'object' && typeof value._seconds === 'number'
        ? new Date(value._seconds * 1000)
        : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('pt-BR');
}

export function valorMaterial(item) {
  const peso = Number(item?.peso) || 0;
  return item?.unidadePeso === 'g' ? peso / 1000 : peso;
}

export function materiaisDoAgendamento(materiais = []) {
  return materiais.map((material) => {
    if (typeof material === 'string') return material;
    return material.categoria || material.material || material.descricao || 'Material';
  });
}

export function pesoDoAgendamento(materiais = []) {
  return materiais.reduce((total, material) => {
    if (!material || typeof material !== 'object') return total;
    return total + valorMaterial(material);
  }, 0);
}

export function rotuloPeso(material) {
  if (!material || typeof material !== 'object') return '';
  return `${formatarPeso(material.peso)} ${material.unidadePeso || 'kg'}`;
}
