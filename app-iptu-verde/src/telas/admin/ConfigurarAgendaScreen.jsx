import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { InlineCalendar, toLocalIso } from './CalendarPicker';
import AdminIcon from './AdminIcon';
import { Botao, Campo, Page, styles } from './ui';

const DEFAULT = {
  datas: [],
  diasSemana: [],
  abertura: '08:00',
  encerramento: '16:00',
  inicioPausa: '12:00',
  fimPausa: '13:00',
  duracaoMinutos: 30,
  modalidades: ['domicilio', 'ponto'],
};

function nextDates() {
  const today = new Date();
  return [1, 2, 3].map((offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    return toLocalIso(date);
  });
}

function capacity(config) {
  const minute = (value) => {
    const [hour, minutes] = value.split(':').map(Number);
    return hour * 60 + minutes;
  };
  const open = minute(config.abertura);
  const close = minute(config.encerramento);
  const pauseStart = minute(config.inicioPausa);
  const pauseEnd = minute(config.fimPausa);
  const duration = Number(config.duracaoMinutos);
  if (!duration || close <= open || pauseEnd <= pauseStart) return 0;
  return Math.floor((pauseStart - open) / duration) + Math.floor((close - pauseEnd) / duration);
}

export default function ConfigurarAgendaScreen({
  pontos,
  onLoadConfiguration,
  onSave,
  onCancel,
  saving,
  onLogout,
}) {
  const [pointId, setPointId] = useState(pontos[0]?.id || '');
  const [config, setConfig] = useState(DEFAULT);
  const [error, setError] = useState('');
  const [loadedPointId, setLoadedPointId] = useState('');
  const [pointsVisible, setPointsVisible] = useState(false);
  const loading = Boolean(pointId) && loadedPointId !== pointId;

  useEffect(() => {
    let active = true;
    if (!pointId) return () => { active = false; };
    onLoadConfiguration(pointId)
      .then((result) => {
        if (active) {
          setError('');
          setConfig({
            ...DEFAULT,
            ...(result || {}),
            datas: result?.datas?.length ? result.datas : nextDates(),
          });
          setLoadedPointId(pointId);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
          setLoadedPointId(pointId);
        }
      });
    return () => { active = false; };
  }, [onLoadConfiguration, pointId]);

  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }));
  const toggleMode = (mode) => setConfig((current) => ({
    ...current,
    modalidades: current.modalidades.includes(mode)
      ? current.modalidades.filter((value) => value !== mode)
      : [...current.modalidades, mode],
  }));
  const selectedPoint = pontos.find((point) => point.id === pointId);
  const slotCount = capacity(config);

  async function submit() {
    if (!config.datas.length) {
      setError('Selecione pelo menos um dia de atendimento.');
      return;
    }
    try {
      setError('');
      const diasSemana = [...new Set(config.datas.map((date) => new Date(`${date}T00:00:00.000Z`).getUTCDay()))];
      await onSave({ ...config, pontoId: pointId, diasSemana, duracaoMinutos: Number(config.duracaoMinutos) });
      onCancel();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <Page
      headerTitle="Configurar atendimento"
      headerSubtitle="Defina os dias, horários e vagas para novos agendamentos."
      onBack={onCancel}
    >
      <Text style={styles.sectionTitle}>Ponto de coleta atendido</Text>
      <Text style={styles.fieldLabel}>Local para entrega *</Text>
      <Pressable style={styles.input} onPress={() => setPointsVisible(true)}>
        <Text style={styles.body}>{selectedPoint?.nome || 'Selecione um ponto  ⌄'}</Text>
      </Pressable>
      {selectedPoint ? <Text style={[styles.muted, { marginTop: 8 }]}>{selectedPoint.endereco}{selectedPoint.cidade ? `, ${selectedPoint.cidade}` : ''}</Text> : <Text style={styles.error}>Cadastre um ponto de coleta antes de configurar a agenda.</Text>}

      <Text style={styles.sectionTitle}>Dias da semana</Text>
      <Text style={styles.muted}>Selecione as datas em que haverá atendimento.</Text>
      <View style={{ marginTop: 12 }}>
        <InlineCalendar
          key={loadedPointId}
          values={config.datas}
          onChangeValues={(values) => update('datas', values)}
          initialDate={config.datas.length ? new Date(`${config.datas[0]}T00:00:00`) : new Date()}
        />
      </View>
      <Text style={[styles.muted, { marginTop: 8 }]}>{config.datas.length} data(s) selecionada(s).</Text>

      <Text style={styles.sectionTitle}>Horários de funcionamento</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}><Campo label="Abertura *" value={config.abertura} onChangeText={(value) => update('abertura', value)} /></View>
        <View style={{ flex: 1 }}><Campo label="Encerramento *" value={config.encerramento} onChangeText={(value) => update('encerramento', value)} /></View>
      </View>
      <View style={{ height: 1, marginVertical: 12, backgroundColor: '#DCDCDC' }} />
      <Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>Intervalo sem atendimento</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}><Campo label="Início da pausa *" value={config.inicioPausa} onChangeText={(value) => update('inicioPausa', value)} /></View>
        <View style={{ flex: 1 }}><Campo label="Fim da pausa *" value={config.fimPausa} onChangeText={(value) => update('fimPausa', value)} /></View>
      </View>
      <Text style={[styles.muted, { marginTop: 8 }]}>Nenhuma vaga será oferecida durante a pausa.</Text>

      <Text style={styles.sectionTitle}>Duração e capacidade</Text>
      <Campo label="Duração de cada horário (minutos) *" value={String(config.duracaoMinutos)} onChangeText={(value) => update('duracaoMinutos', value)} keyboardType="numeric" />
      <Text style={styles.sectionTitle}>Modalidades atendidas</Text>
      <View style={styles.row}>
        {['domicilio', 'ponto'].map((mode) => (
          <Pressable key={mode} onPress={() => toggleMode(mode)} style={[styles.card, { flex: 1, minHeight: 76, justifyContent: 'center', backgroundColor: config.modalidades.includes(mode) ? '#95B509' : '#F3F3F3' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AdminIcon name={mode === 'domicilio' ? 'domicilio' : 'localizacao'} />
              <Text style={[styles.body, config.modalidades.includes(mode) && { color: '#fff' }]}>{mode === 'domicilio' ? 'Coleta em domicílio' : 'Ponto de coleta'}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View style={styles.summary}>
        <Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>{slotCount} horários · {config.datas.length * slotCount} vagas no período selecionado</Text>
        <Text style={[styles.muted, { marginTop: 6 }]}>
          {loading ? 'Carregando configuração...' : `Atendimento das ${config.abertura} às ${config.inicioPausa} e das ${config.fimPausa} às ${config.encerramento}.`}
        </Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Botao title={saving ? 'Salvando...' : 'Salvar configuração'} onPress={submit} disabled={saving || loading || !pointId} />
      <Botao title="Cancelar" outline onPress={onCancel} />

      <Modal visible={pointsVisible} transparent animationType="slide" onRequestClose={() => setPointsVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View style={{ padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18, backgroundColor: '#fff' }}>
            <Text style={styles.sectionTitle}>Ponto de coleta atendido</Text>
            {pontos.map((point) => (
              <Pressable key={point.id} onPress={() => { setPointId(point.id); setPointsVisible(false); }} style={[styles.card, pointId === point.id && { borderWidth: 1, borderColor: '#95B509' }]}>
                <Text style={styles.body}>{point.nome}</Text><Text style={styles.muted}>{point.endereco}</Text>
              </Pressable>
            ))}
            <Botao title="Cancelar" outline onPress={() => setPointsVisible(false)} />
          </View>
        </View>
      </Modal>
    </Page>
  );
}
