import { useCallback, useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiRequest } from '../services/api';
import AgendaScreen from './admin/AgendaScreen';
import AnaliseSolicitacaoScreen from './admin/AnaliseSolicitacaoScreen';
import ColetasScreen from './admin/ColetasScreen';
import ConfigurarAgendaScreen from './admin/ConfigurarAgendaScreen';
import MenuAdmin from './admin/MenuAdmin';
import RecusarSolicitacaoScreen from './admin/RecusarSolicitacaoScreen';
import RegistrarColetaScreen from './admin/RegistrarColetaScreen';
import SolicitacoesScreen from './admin/SolicitacoesScreen';
import { CORES } from '../components/telaInicial/tema';

export default function TelaAdmin({ onSair, usuario, sessao }) {
  const [screen, setScreen] = useState('coletas');
  const [previousTab, setPreviousTab] = useState('coletas');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [coletas, setColetas] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const token = sessao?.token;

  const loadData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError('Faça login novamente para acessar os dados administrativos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [collectionResult, bookingResult, pointResult] = await Promise.all([
        apiRequest('/admin/coletas', { token }),
        apiRequest('/admin/agendamentos', { token }),
        apiRequest('/admin/pontos-coleta', { token }),
      ]);
      setColetas(collectionResult.coletas);
      setAgendamentos(bookingResult.agendamentos);
      setPontos(pointResult.pontos);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 0);
    return () => clearTimeout(timer);
  }, [loadData, attempt]);

  const selectTab = (tab) => setScreen(tab);
  const openSubscreen = (nextScreen) => {
    setPreviousTab(screen);
    setScreen(nextScreen);
  };
  const backToTab = (tab = previousTab) => setScreen(tab);

  async function saveCollection(payload) {
    setSaving(true);
    try {
      const result = await apiRequest('/admin/coletas', {
        method: 'POST',
        token: sessao.token,
        body: JSON.stringify(payload),
      });
      setColetas((current) => [result.coleta, ...current]);
      if (result.coleta.agendamentoId) {
        setAgendamentos((current) => current.map((booking) => (
          booking.id === result.coleta.agendamentoId
            ? { ...booking, coletaId: result.coleta.id }
            : booking
        )));
      }
      setScreen('coletas');
    } finally {
      setSaving(false);
    }
  }

  async function decideBooking(status, motivo = '') {
    if (!selectedBooking) return;
    setSaving(true);
    try {
      const result = await apiRequest(`/admin/agendamentos/${encodeURIComponent(selectedBooking.id)}/decisao`, {
        method: 'PATCH',
        token: sessao.token,
        body: JSON.stringify({ status, motivo }),
      });
      setAgendamentos((current) => current.map((booking) => booking.id === result.agendamento.id ? { ...booking, ...result.agendamento } : booking));
      setSelectedBooking(result.agendamento);
      setScreen('solicitacoes');
    } finally {
      setSaving(false);
    }
  }

  const loadSchedule = useCallback(async (pontoId) => {
    const result = await apiRequest(`/admin/agenda/configuracao?pontoId=${encodeURIComponent(pontoId)}`, { token });
    return result.configuracao;
  }, [token]);

  async function saveSchedule(config) {
    setSaving(true);
    try {
      await apiRequest('/admin/agenda/configuracao', {
        method: 'PUT',
        token: sessao.token,
        body: JSON.stringify(config),
      });
    } finally {
      setSaving(false);
    }
  }

  const retry = () => setAttempt((value) => value + 1);
  const sharedProps = { onLogout: onSair };
  let content;

  if (screen === 'registrarColeta') {
    content = <RegistrarColetaScreen {...sharedProps} pontos={pontos} agendamentos={agendamentos} saving={saving} onCancel={() => backToTab('coletas')} onSave={saveCollection} />;
  } else if (screen === 'configurarAgenda') {
    content = <ConfigurarAgendaScreen {...sharedProps} pontos={pontos} saving={saving} onCancel={() => backToTab('agenda')} onLoadConfiguration={loadSchedule} onSave={saveSchedule} />;
  } else if (screen === 'analisarSolicitacao') {
    content = <AnaliseSolicitacaoScreen {...sharedProps} booking={selectedBooking} saving={saving} onAccept={() => decideBooking('aceito')} onDecline={() => setScreen('recusarSolicitacao')} onBack={() => backToTab('solicitacoes')} />;
  } else if (screen === 'recusarSolicitacao') {
    content = <RecusarSolicitacaoScreen {...sharedProps} booking={selectedBooking} saving={saving} onConfirm={(reason) => decideBooking('recusado', reason)} onBack={() => setScreen('analisarSolicitacao')} />;
  } else if (screen === 'agenda') {
    content = <AgendaScreen {...sharedProps} agendamentos={agendamentos} pontos={pontos} loading={loading} error={error} onRetry={retry} onLoadConfiguration={loadSchedule} onConfigure={() => openSubscreen('configurarAgenda')} onOpenBooking={(booking) => { setSelectedBooking(booking); openSubscreen('analisarSolicitacao'); }} />;
  } else if (screen === 'solicitacoes') {
    content = <SolicitacoesScreen {...sharedProps} agendamentos={agendamentos} loading={loading} error={error} onRetry={retry} onOpen={(booking) => { setSelectedBooking(booking); openSubscreen('analisarSolicitacao'); }} />;
  } else {
    content = <ColetasScreen {...sharedProps} coletas={coletas} pontos={pontos} loading={loading} error={error} onRetry={retry} onRegistrar={() => openSubscreen('registrarColeta')} />;
  }

  const showMenu = ['coletas', 'agenda', 'solicitacoes'].includes(screen);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: CORES.branco }}
      edges={showMenu ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />
      <View style={{ flex: 1 }}>{content}</View>
      {showMenu ? <MenuAdmin selected={screen} onSelect={selectTab} /> : null}
    </SafeAreaView>
  );
}
