import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AdminIcon from './AdminIcon';
import { Botao, formatarPeso, Page, rotuloPeso, styles, Titulo, valorMaterial } from './ui';

function diaISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function alterarMes(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export default function ColetasScreen({ coletas, pontos, loading, error, onRetry, onRegistrar, onLogout }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dias = useMemo(() => {
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - ((selectedDate.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }, [selectedDate]);
  const key = diaISO(selectedDate);
  const doDia = coletas.filter((coleta) => coleta.data === key);
  const total = (list) => list.reduce((sum, item) => sum + (Number(item.pesoTotal) || (item.materiais || []).reduce((value, material) => value + valorMaterial(material), 0)), 0);
  const domicilios = doDia.filter((item) => item.modalidade === 'domicilio').length;
  const firstPoint = pontos[0];
  const monthLabel = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <Page onLogout={onLogout}>
      <Titulo title="Coletas registradas" subtitle={firstPoint ? `${firstPoint.nome}, ${firstPoint.cidade || ''}` : 'Acompanhe os materiais recebidos.'} />
      <Botao title="+   Registrar coleta" onPress={onRegistrar} />
      <View style={[styles.row, { minHeight: 52, marginTop: 8, marginBottom: 4 }]}>
        <Pressable
          onPress={() => setSelectedDate((date) => alterarMes(date, -1))}
          style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F4DF', alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Mês anterior"
          hitSlop={4}
        >
          <Text style={{ color: '#6D8C09', fontSize: 36, lineHeight: 40 }}>‹</Text>
        </Pressable>
        <Text style={[styles.body, { flex: 1, textAlign: 'center', textTransform: 'capitalize', fontFamily: 'Inter_700Bold' }]}>{monthLabel}</Text>
        <Pressable
          onPress={() => setSelectedDate((date) => alterarMes(date, 1))}
          style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F4DF', alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Próximo mês"
          hitSlop={4}
        >
          <Text style={{ color: '#6D8C09', fontSize: 36, lineHeight: 40 }}>›</Text>
        </Pressable>
      </View>
      <View style={[styles.row, { marginTop: 4, marginBottom: 12 }]}>
        {dias.map((date) => {
          const chosen = date.toDateString() === selectedDate.toDateString();
          return <Pressable key={date.toISOString()} onPress={() => setSelectedDate(date)} style={{ alignItems: 'center', flex: 1, paddingVertical: 6 }}>
            <Text style={styles.muted}>{date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</Text>
            <View style={{ marginTop: 6, width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: chosen ? '#95B509' : 'transparent' }}>
              <Text style={[styles.body, chosen && { color: '#fff' }]}>{date.getDate()}</Text>
            </View>
          </Pressable>;
        })}
      </View>
      <View style={styles.summary}>
        <Text style={styles.muted}>Resumo do dia</Text>
        <View style={[styles.row, { marginTop: 8 }]}>
          <View><Text style={styles.title}>{doDia.length}</Text><Text style={styles.muted}>coletas</Text></View>
          <View><Text style={styles.title}>{formatarPeso(total(doDia))} kg</Text><Text style={styles.muted}>recebidos</Text></View>
        </View>
        <View style={{ height: 1, backgroundColor: '#DDE3C4', marginVertical: 10 }} />
        <Text style={styles.body}>{domicilios} em domicílio · {doDia.length - domicilios} no ponto de coleta</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>{selectedDate.toDateString() === new Date().toDateString() ? 'Hoje, ' : ''}{selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</Text>
        <Text style={styles.muted}>{doDia.length} coletas · {formatarPeso(total(doDia))} kg</Text>
      </View>
      {loading ? <Text style={styles.empty}>Carregando coletas...</Text> : error ? <><Text style={styles.error}>{error}</Text><Botao title="Tentar novamente" outline onPress={onRetry} /></> : doDia.length === 0 ? <Text style={styles.empty}>Nenhuma coleta registrada nesta data.</Text> : doDia.map((item) => {
        const weight = Number(item.pesoTotal) || (item.materiais || []).reduce((sum, material) => sum + valorMaterial(material), 0);
        const materials = (item.materiais || []).map((material) => `${material.categoria} ${rotuloPeso(material)}`).join(' · ');
        return <View style={styles.card} key={item.id}>
          <View style={styles.row}><Text style={[styles.body, { fontFamily: 'Alexandria_700Bold' }]}>{item.nomeContribuinte || item.responsavel || 'Contribuinte'}</Text><Text style={[styles.body, { fontFamily: 'Alexandria_700Bold' }]}>{formatarPeso(weight)} kg</Text></View>
          <View style={[styles.row, { marginVertical: 8, justifyContent: 'flex-start', gap: 6 }]}>
            <AdminIcon name={item.modalidade === 'domicilio' ? 'domicilio' : 'localizacao'} />
            <Text style={styles.muted}>{item.modalidade === 'domicilio' ? 'Coleta em domicílio' : 'Entrega no ponto de coleta'}</Text>
          </View>
          <Text style={styles.body}>{materials || item.material || 'Materiais não detalhados'}</Text>
          <Text style={[styles.muted, { marginTop: 8 }]}>{item.endereco || item.ponto || ''}</Text>
        </View>;
      })}
    </Page>
  );
}
