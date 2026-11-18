import { Text, View } from 'react-native';
import AdminIcon from './AdminIcon';
import { Botao, formatarData, formatarPeso, Page, pesoDoAgendamento, rotuloPeso, styles, Titulo } from './ui';

export default function AnaliseSolicitacaoScreen({ booking, onAccept, onDecline, onBack, saving, onLogout }) {
  if (!booking) return null;
  const materials = Array.isArray(booking.materiais) ? booking.materiais : [];
  const contactName = booking.solicitante?.nome || booking.nomeContribuinte || 'Solicitante';
  const refused = ['recusado', 'rejected'].includes(booking.status);
  const pending = !['aceito', 'recusado', 'rejected'].includes(booking.status);
  return (
    <Page onLogout={onLogout}>
      <Titulo title="Analisar solicitação" subtitle="Confira o endereço e os materiais antes de aceitar." />
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <AdminIcon name={booking.modalidade === 'domicilio' ? 'domicilio' : 'localizacao'} />
          <Text style={styles.muted}>{booking.modalidade === 'domicilio' ? 'Coleta em domicílio' : 'Entrega no ponto de coleta'}</Text>
        </View>
        <Text style={{ color: refused ? '#D32F2F' : pending ? '#D99A19' : '#6D8C09', fontFamily: 'Inter_700Bold' }}>{booking.coletaId ? 'Coletada' : pending ? 'Pendente' : booking.status === 'aceito' ? 'Aceita' : 'Recusada'}</Text>
      </View>
      <Text style={styles.sectionTitle}>Solicitante</Text>
      <View style={styles.card}><Text style={[styles.body, { fontFamily: 'Alexandria_700Bold' }]}>{contactName}</Text><Text style={[styles.body, { marginTop: 8 }]}>{booking.solicitante?.telefone || booking.telefoneContato || ''}</Text><Text style={[styles.muted, { marginTop: 8 }]}>Solicitação recebida em {formatarData(booking.criadoEm?.toDate?.()?.toISOString?.().slice(0, 10) || booking.data)}</Text></View>
      <Text style={styles.sectionTitle}>Data e horário solicitados</Text>
      <View style={styles.card}><Text style={[styles.body, { fontFamily: 'Alexandria_700Bold' }]}>{formatarData(booking.data)}</Text><Text style={[styles.body, { marginTop: 5 }]}>{booking.horario}</Text></View>
      <Text style={styles.sectionTitle}>Endereço da coleta</Text>
      <View style={styles.card}><Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>{booking.modalidade === 'domicilio' ? `Residência de ${contactName}` : booking.ponto || 'Ponto de coleta'}</Text><Text style={[styles.body, { marginTop: 8 }]}>{booking.endereco || booking.ponto}</Text><Text style={[styles.muted, { marginTop: 8 }]}>{booking.referencia || ''}</Text><Text style={[styles.muted, { marginTop: 8, color: '#6D6500' }]}>A equipe deverá ir a este endereço.</Text></View>
      <Text style={styles.sectionTitle}>Materiais informados</Text>
      <View style={styles.card}>
        <View style={[styles.row, { marginBottom: 8 }]}><Text style={styles.muted}>Material / item</Text><Text style={styles.muted}>Peso</Text></View>
        {materials.length ? materials.map((item, index) => (
          <View key={`${index}-${typeof item === 'string' ? item : item.descricao}`} style={[styles.row, { paddingVertical: 7 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>{typeof item === 'string' ? item : `${item.categoria || item.material || ''}${item.descricao ? ` · ${item.descricao}` : ''}`}</Text>
            </View>
            <Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>
              {typeof item === 'string' ? '' : rotuloPeso(item)}
            </Text>
          </View>
        )) : <Text style={styles.body}>Materiais não detalhados</Text>}
        <View style={{ borderTopWidth: 1, borderTopColor: '#DCDCDC', marginTop: 8, paddingTop: 10 }}>
          <View style={styles.row}><Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>Total estimado</Text><Text style={[styles.body, { color: '#596900', fontFamily: 'Alexandria_700Bold' }]}>{formatarPeso(pesoDoAgendamento(materials))} kg</Text></View>
        </View>
      </View>
      {pending ? <>
        <View style={styles.row}>
          <View style={{ flex: 1 }}><Botao title="Recusar" outline onPress={onDecline} disabled={saving} /></View>
          <View style={{ flex: 1 }}><Botao title={saving ? 'Aguarde...' : 'Aceitar solicitação'} onPress={onAccept} disabled={saving} /></View>
        </View>
        <Text style={styles.muted}>O solicitante será notificado sobre a decisão.</Text>
      </> : booking.status === 'recusado' && booking.motivoRecusa ? <View style={styles.summary}><Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>Motivo da recusa</Text><Text style={[styles.muted, { marginTop: 6 }]}>{booking.motivoRecusa}</Text></View> : null}
      <Botao title="Voltar às solicitações" outline onPress={onBack} />
    </Page>
  );
}
