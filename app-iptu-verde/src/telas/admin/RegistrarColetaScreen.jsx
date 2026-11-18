import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import CalendarPicker, { displayDate } from './CalendarPicker';
import AdminIcon from './AdminIcon';
import { Botao, Campo, Page, styles } from './ui';

const MATERIAL_OPTIONS = ['Papel', 'Plástico', 'Vidro', 'Metal'];
const EMPTY_MATERIAL = {
  categoria: '',
  descricao: '',
  peso: '',
  unidadePeso: 'kg',
};
const localDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

function Choice({ selected, icon, children, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, minWidth: 0, minHeight: 62, padding: 10, justifyContent: 'center', borderRadius: 10, borderWidth: selected ? 1 : 0, borderColor: selected ? '#95B509' : 'transparent', backgroundColor: selected ? '#95B509' : '#F3F3F3' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
        <AdminIcon name={icon} />
        <Text style={{ flex: 1, flexShrink: 1, color: selected ? '#fff' : '#666', fontSize: 13, fontFamily: selected ? 'Inter_700Bold' : 'Inter_400Regular' }}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default function RegistrarColetaScreen({ pontos, agendamentos, onCancel, onSave, saving, onLogout }) {
  const [form, setForm] = useState({
    data: localDate(),
    horario: new Date().toTimeString().slice(0, 5),
    agendamentoId: '',
    nomeContribuinte: '',
    telefone: '',
    modalidade: 'domicilio',
    pontoId: pontos[0]?.id || '',
    enderecoAgendamento: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: 'CE',
    referencia: '',
  });
  const [materials, setMaterials] = useState([{ ...EMPTY_MATERIAL }]);
  const [error, setError] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [pointsVisible, setPointsVisible] = useState(false);
  const [bookingsVisible, setBookingsVisible] = useState(false);
  const [materialPickerIndex, setMaterialPickerIndex] = useState(null);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const availableBookings = agendamentos.filter(
    (booking) => booking.status === 'aceito' && !booking.coletaId,
  );
  const selectedBooking = agendamentos.find((booking) => booking.id === form.agendamentoId);
  const updateMaterial = (index, key, value) =>
    setMaterials((current) =>
      current.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );

  function selectBooking(booking) {
    if (!booking) {
      update('agendamentoId', '');
      update('enderecoAgendamento', '');
      update('nomeContribuinte', '');
      update('telefone', '');
      setMaterials([{ ...EMPTY_MATERIAL }]);
      setBookingsVisible(false);
      return;
    }

    const bookingMaterials = Array.isArray(booking.materiais)
      ? booking.materiais.filter((item) => typeof item === 'string' && item.trim())
      : [];
    setForm((current) => ({
      ...current,
      agendamentoId: booking.id,
      data: booking.data || current.data,
      horario: booking.horario?.match(/\d{2}:\d{2}/)?.[0] || current.horario,
      nomeContribuinte: booking.solicitante?.nome || '',
      telefone: booking.telefoneContato || booking.solicitante?.telefone || '',
      modalidade: booking.modalidade || 'domicilio',
      pontoId: booking.pontoId || current.pontoId,
      enderecoAgendamento: booking.endereco || '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: 'CE',
      referencia: '',
    }));
    setMaterials(
      bookingMaterials.length
        ? bookingMaterials.map((material) => ({
            ...EMPTY_MATERIAL,
            categoria:
              MATERIAL_OPTIONS.find(
                (category) => category.toLowerCase() === material.toLowerCase(),
                ) || '',
              descricao: MATERIAL_OPTIONS.find(
                (category) => category.toLowerCase() === material.toLowerCase(),
              ) || '',
          }))
        : [{ ...EMPTY_MATERIAL }],
    );
    setError('');
    setBookingsVisible(false);
  }

  async function submit() {
    const materialPayload = materials.map((item) => ({
      ...item,
      peso: Number(item.peso.replace(',', '.')),
    }));
    const endereco = [
      form.rua,
      form.numero,
      form.complemento,
      form.bairro,
      form.cidade,
      form.uf,
      form.cep,
      form.referencia,
    ]
      .filter(Boolean)
      .join(', ');
    if (
      !form.nomeContribuinte.trim() ||
      ![10, 11].includes(form.telefone.replace(/\D/g, '').length) ||
      !materials.every(
        (item) =>
          item.descricao.trim() && Number(item.peso.replace(',', '.')) > 0,
      ) ||
      (form.modalidade === 'domicilio' &&
        (form.agendamentoId
          ? !form.enderecoAgendamento.trim()
          : (!form.cep || form.cep.replace(/\D/g, '').length !== 8 || !form.rua.trim() || !form.numero.trim() || !form.bairro.trim() || !form.cidade.trim() || form.uf.trim().length !== 2)))
    ) {
      setError('Preencha os campos obrigatórios e informe o peso de cada material.');
      return;
    }
    if (form.modalidade === 'ponto' && !form.pontoId) {
      setError('Cadastre ou selecione um ponto de coleta.');
      return;
    }
    try {
      setError('');
      await onSave({
        ...form,
        endereco: form.modalidade === 'domicilio' && form.agendamentoId
          ? form.enderecoAgendamento.trim()
          : endereco,
        materiais: materialPayload,
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const selectedPoint = pontos.find((point) => point.id === form.pontoId);
  return (
    <Page
      headerTitle="Registrar coleta"
      headerSubtitle="Informe os dados e o peso real dos materiais recebidos."
      onBack={onCancel}
    >
      <Text style={styles.muted}>* Campos obrigatórios</Text>
      <Text style={styles.sectionTitle}>Agendamento do usuário</Text>
      <Pressable style={styles.input} onPress={() => setBookingsVisible(true)}>
        <Text style={styles.body}>
          {selectedBooking
            ? `${selectedBooking.solicitante?.nome || 'Solicitante'} · ${displayDate(selectedBooking.data)} · ${selectedBooking.horario}`
            : 'Selecionar agendamento confirmado (opcional)  ⌄'}
        </Text>
      </Pressable>
      <Text style={[styles.muted, { marginTop: 8 }]}>
        Ao selecionar, os dados do usuário e do agendamento serão preenchidos automaticamente.
      </Text>
      <Text style={styles.sectionTitle}>Data e horário da coleta</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>Data *</Text>
          <Pressable style={styles.input} onPress={() => setCalendarVisible(true)}>
            <Text style={styles.body}>{displayDate(form.data)}</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          <Campo
            label="Horário *"
            value={form.horario}
            onChangeText={(value) => update('horario', value)}
            placeholder="09:34"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Contato</Text>
      <Campo label="Nome do contribuinte *" value={form.nomeContribuinte} onChangeText={(value) => update('nomeContribuinte', value)} />
      <Campo label="Telefone *" value={form.telefone} onChangeText={(value) => update('telefone', value)} keyboardType="phone-pad" />

      <Text style={styles.sectionTitle}>Modalidade da coleta *</Text>
      <View style={styles.row}>
        <Choice icon="domicilio" selected={form.modalidade === 'domicilio'} onPress={() => !form.agendamentoId && update('modalidade', 'domicilio')}>Coleta em domicílio</Choice>
        <Choice icon="localizacao" selected={form.modalidade === 'ponto'} onPress={() => !form.agendamentoId && update('modalidade', 'ponto')}>Entrega no ponto de coleta</Choice>
      </View>
      <Text style={[styles.muted, { marginTop: 10 }]}>
        {form.agendamentoId ? 'Modalidade preenchida pelo agendamento.' : 'Selecione onde os materiais foram recebidos.'}
      </Text>

      {form.modalidade === 'domicilio' ? (
        <>
          <Text style={styles.sectionTitle}>Endereço da coleta em domicílio</Text>
          {form.agendamentoId ? (
            <Campo label="Endereço do agendamento *" value={form.enderecoAgendamento} onChangeText={(value) => update('enderecoAgendamento', value)} />
          ) : (
            <>
              <Text style={styles.muted}>Preencha com o endereço do contribuinte</Text>
              <Campo label="CEP *" value={form.cep} onChangeText={(value) => update('cep', value)} keyboardType="numeric" />
              <Campo label="Rua *" value={form.rua} onChangeText={(value) => update('rua', value)} />
              <View style={styles.row}>
                <View style={{ flex: 1 }}><Campo label="Número *" value={form.numero} onChangeText={(value) => update('numero', value)} /></View>
                <View style={{ flex: 2 }}><Campo label="Complemento" value={form.complemento} onChangeText={(value) => update('complemento', value)} /></View>
              </View>
              <Campo label="Bairro *" value={form.bairro} onChangeText={(value) => update('bairro', value)} />
              <View style={styles.row}>
                <View style={{ flex: 2 }}><Campo label="Cidade *" value={form.cidade} onChangeText={(value) => update('cidade', value)} /></View>
                <View style={{ flex: 1 }}><Campo label="UF *" value={form.uf} onChangeText={(value) => update('uf', value)} /></View>
              </View>
              <Campo label="Ponto de referência" value={form.referencia} onChangeText={(value) => update('referencia', value)} />
            </>
          )}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Local para entrega no ponto</Text>
          <Text style={styles.muted}>Usado apenas ao escolher entrega no ponto de coleta.</Text>
          <Text style={styles.fieldLabel}>Ponto de coleta *</Text>
          <Pressable style={styles.input} onPress={() => setPointsVisible(true)}>
            <Text style={styles.body}>{selectedPoint?.nome || 'Selecione um ponto  ⌄'}</Text>
          </Pressable>
          {selectedPoint ? (
            <View style={[styles.row, { justifyContent: 'flex-start', gap: 6, marginTop: 8 }]}>
              <AdminIcon name="localizacao" />
              <Text style={styles.muted}>{selectedPoint.endereco}{selectedPoint.cidade ? `, ${selectedPoint.cidade}` : ''}</Text>
            </View>
          ) : null}
        </>
      )}

      <Text style={styles.sectionTitle}>Materiais recebidos</Text>
      <Text style={styles.muted}>Informe o peso medido. Use kg ou g para cada item.</Text>
      {materials.map((item, index) => (
        <View key={`material-${index}`} style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>{item.categoria || `Material ${index + 1}`}</Text>
            {materials.length > 1 ? (
              <Pressable onPress={() => setMaterials((current) => current.filter((_, i) => i !== index))}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <AdminIcon name="remover" />
                  <Text style={{ color: '#A84300', fontFamily: 'Inter_700Bold' }}>Remover</Text>
                </View>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.fieldLabel}>Item / material *</Text>
          <Pressable style={styles.input} onPress={() => setMaterialPickerIndex(index)}>
            <Text style={[styles.body, !item.descricao && styles.muted]}>
              {item.descricao || 'Selecione um material  ⌄'}
            </Text>
          </Pressable>
          <View style={styles.row}>
            <View style={{ flex: 1 }}><Campo label="Peso *" value={item.peso} onChangeText={(value) => updateMaterial(index, 'peso', value)} keyboardType="decimal-pad" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Unidade de peso *</Text>
              <View style={styles.row}>
                {['kg', 'g'].map((unit) => (
                  <Pressable key={unit} onPress={() => updateMaterial(index, 'unidadePeso', unit)} style={[styles.input, { flex: 1, minHeight: 46, justifyContent: 'center', borderWidth: item.unidadePeso === unit ? 1 : 0, borderColor: '#95B509' }]}>
                    <Text style={styles.body}>{unit}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      ))}
      <Botao title="+  Adicionar material / item" outline onPress={() => setMaterials((current) => [...current, { ...EMPTY_MATERIAL }])} />
      {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
      <Botao title={saving ? 'Salvando...' : 'Salvar coleta'} onPress={submit} disabled={saving} />
      <Botao title="Cancelar" outline onPress={onCancel} />

      <CalendarPicker visible={calendarVisible} value={form.data} onChange={(value) => update('data', value)} onClose={() => setCalendarVisible(false)} title="Data da coleta" />
      <Modal visible={materialPickerIndex !== null} transparent animationType="slide" onRequestClose={() => setMaterialPickerIndex(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View style={{ padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18, backgroundColor: '#fff' }}>
            <Text style={styles.sectionTitle}>Selecione o material</Text>
            {MATERIAL_OPTIONS.map((material) => (
              <Pressable
                key={material}
                onPress={() => {
                  updateMaterial(materialPickerIndex, 'categoria', material);
                  updateMaterial(materialPickerIndex, 'descricao', material);
                  setMaterialPickerIndex(null);
                }}
                style={[styles.card, materials[materialPickerIndex]?.descricao === material && { borderWidth: 1, borderColor: '#95B509' }]}
              >
                <Text style={styles.body}>{material}</Text>
              </Pressable>
            ))}
            <Botao title="Cancelar" outline onPress={() => setMaterialPickerIndex(null)} />
          </View>
        </View>
      </Modal>
      <Modal visible={bookingsVisible} transparent animationType="slide" onRequestClose={() => setBookingsVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View style={{ maxHeight: '80%', padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18, backgroundColor: '#fff' }}>
            <Text style={styles.sectionTitle}>Agendamentos confirmados</Text>
            <ScrollView style={{ flexShrink: 1 }}>
              <Pressable onPress={() => selectBooking(null)} style={styles.card}>
                <Text style={styles.body}>Registrar sem vincular a um agendamento</Text>
              </Pressable>
              {availableBookings.length ? availableBookings.map((booking) => (
                <Pressable key={booking.id} onPress={() => selectBooking(booking)} style={[styles.card, form.agendamentoId === booking.id && { borderWidth: 1, borderColor: '#95B509' }]}>
                  <Text style={[styles.body, { fontFamily: 'Inter_700Bold' }]}>{booking.solicitante?.nome || 'Solicitante'}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <AdminIcon name="horario" />
                    <Text style={styles.muted}>{displayDate(booking.data)} · {booking.horario} · {booking.modalidade === 'domicilio' ? 'Domicílio' : 'Ponto de coleta'}</Text>
                  </View>
                  <Text style={styles.muted}>{booking.endereco || booking.ponto || ''}</Text>
                </Pressable>
              )) : <Text style={styles.empty}>Não há agendamentos confirmados sem coleta registrada.</Text>}
            </ScrollView>
            <Botao title="Fechar" outline onPress={() => setBookingsVisible(false)} />
          </View>
        </View>
      </Modal>
      <Modal visible={pointsVisible} transparent animationType="slide" onRequestClose={() => setPointsVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View style={{ padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18, backgroundColor: '#fff' }}>
            <Text style={styles.sectionTitle}>Selecione o ponto de coleta</Text>
            {pontos.map((point) => (
              <Pressable key={point.id} onPress={() => { update('pontoId', point.id); setPointsVisible(false); }} style={[styles.card, form.pontoId === point.id && { borderWidth: 1, borderColor: '#95B509' }]}>
                <Text style={styles.body}>{point.nome}</Text><Text style={styles.muted}>{point.endereco}{point.cidade ? `, ${point.cidade}` : ''}</Text>
              </Pressable>
            ))}
            <Botao title="Cancelar" outline onPress={() => setPointsVisible(false)} />
          </View>
        </View>
      </Modal>
    </Page>
  );
}
