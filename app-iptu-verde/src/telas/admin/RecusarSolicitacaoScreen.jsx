import { useState } from 'react';
import { Text, View } from 'react-native';
import AdminIcon from './AdminIcon';
import { Botao, Campo, formatarData, Page, styles, Titulo } from './ui';

export default function RecusarSolicitacaoScreen({ booking, onConfirm, onBack, saving, onLogout }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  async function submit() {
    if (reason.trim().length < 5) {
      setError('Informe um motivo com pelo menos 5 caracteres.');
      return;
    }
    try {
      setError('');
      await onConfirm(reason.trim());
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  if (!booking) return null;
  return (
    <Page onLogout={onLogout}>
      <Titulo title="Recusar solicitação" subtitle="Explique o motivo para que o solicitante possa se reorganizar." />
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <AdminIcon name={booking.modalidade === 'domicilio' ? 'domicilio' : 'localizacao'} />
          <Text style={styles.muted}>{booking.modalidade === 'domicilio' ? 'Coleta em domicílio' : 'Entrega no ponto de coleta'} · Pendente</Text>
        </View>
        <Text style={[styles.body, { marginTop: 12, fontFamily: 'Inter_700Bold' }]}>{formatarData(booking.data)} · {booking.horario}</Text>
        <Text style={[styles.muted, { marginTop: 8 }]}>{booking.endereco}</Text>
      </View>
      <Text style={styles.sectionTitle}>Motivo da recusa *</Text>
      <Text style={styles.muted}>Obrigatório. Este texto será enviado ao solicitante.</Text>
      <Campo label="" value={reason} onChangeText={setReason} multiline placeholder="Explique o motivo da recusa." />
      <Text style={styles.sectionTitle}>Prévia da notificação</Text>
      <View style={styles.card}><Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>Agendamento não aprovado</Text><Text style={[styles.muted, { marginTop: 8 }]}>{reason.trim() || 'O motivo informado será enviado ao solicitante.'}</Text></View>
      <View style={[styles.summary, { backgroundColor: '#FBF1DC' }]}><Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>Confirme antes de enviar</Text><Text style={[styles.muted, { marginTop: 5 }]}>A solicitação passará para “Recusada”.</Text></View>
      {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
      <Botao title={saving ? 'Enviando...' : 'Confirmar recusa e enviar motivo'} onPress={submit} disabled={saving} />
      <Botao title="Voltar sem recusar" outline onPress={onBack} />
    </Page>
  );
}
