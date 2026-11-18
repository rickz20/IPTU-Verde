import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { database } from '../config/firebaseAdmin.js';

const pointsCollection =
  process.env.FIRESTORE_POINTS_COLLECTION?.trim() || 'pontosColeta';
const bookingsCollection =
  process.env.FIRESTORE_BOOKINGS_COLLECTION?.trim() || 'agendamentos';
const bookingSlotsCollection =
  process.env.FIRESTORE_BOOKING_SLOTS_COLLECTION?.trim() ||
  'reservasHorariosAgendamento';
const collectionsCollection =
  process.env.FIRESTORE_COLLECTIONS_COLLECTION?.trim() || 'coletas';
const notificationsCollection =
  process.env.FIRESTORE_NOTIFICATIONS_COLLECTION?.trim() || 'notificacoes';
const propertiesCollection =
  process.env.FIRESTORE_PROPERTIES_COLLECTION?.trim() || 'imoveis';
const usersCollection =
  process.env.FIRESTORE_USERS_COLLECTION?.trim() || 'usuarios';
const schedulesCollection =
  process.env.FIRESTORE_SCHEDULES_COLLECTION?.trim() || 'agendasAtendimento';

function toRecord(document) {
  return { ...document.data(), id: document.id };
}

export async function listPoints() {
  const snapshot = await database.collection(pointsCollection).get();
  return snapshot.docs.map(toRecord);
}

export async function findPointById(id) {
  const document = await database.collection(pointsCollection).doc(id).get();
  return document.exists ? toRecord(document) : null;
}

export async function listNotifications(userId) {
  const snapshot = await database.collection(notificationsCollection).get();
  return snapshot.docs
    .map(toRecord)
    .filter((notification) => !notification.usuarioId || notification.usuarioId === userId);
}

export async function listUserBookings(userId) {
  const snapshot = await database
    .collection(bookingsCollection)
    .where('usuarioId', '==', userId)
    .get();
  return snapshot.docs.map(toRecord);
}

export async function createUserBooking(userId, booking) {
  const reference = database.collection(bookingsCollection).doc();
  const slotId = createHash('sha256')
    .update(`${booking.pontoId}|${booking.data}|${booking.horario}`)
    .digest('hex');
  const slotReference = database
    .collection(bookingSlotsCollection)
    .doc(slotId);
  const record = {
    ...booking,
    usuarioId: userId,
    status: 'agendado',
    criadoEm: FieldValue.serverTimestamp(),
  };
  await database.runTransaction(async (transaction) => {
    const slot = await transaction.get(slotReference);
    const existingBookings = await transaction.get(
      database
        .collection(bookingsCollection)
        .where('pontoId', '==', booking.pontoId),
    );
    const slotAlreadyBooked = existingBookings.docs.some((document) => {
      const existing = document.data();
      const existingTime =
        typeof existing.horario === 'string'
          ? existing.horario.match(/\d{2}:\d{2}/)?.[0]
          : null;
      return (
        !['recusado', 'rejected'].includes(existing.status) &&
        existing.data === booking.data &&
        existingTime === booking.horario
      );
    });

    if (slot.exists || slotAlreadyBooked) {
      const error = new Error(
        'Este horário acabou de ser reservado. Escolha outro horário ou dia.',
      );
      error.statusCode = 409;
      throw error;
    }

    transaction.create(slotReference, {
      pontoId: booking.pontoId,
      data: booking.data,
      horario: booking.horario,
      agendamentoId: reference.id,
      usuarioId: userId,
      criadoEm: FieldValue.serverTimestamp(),
    });
    transaction.create(reference, record);
  });
  return {
    ...booking,
    usuarioId: userId,
    status: 'agendado',
    id: reference.id,
  };
}

export async function listBookedBookingSlots(pointId, date, slotOptions) {
  const slotReferences = slotOptions.map((horario) => {
    const slotId = createHash('sha256')
      .update(`${pointId}|${date}|${horario}`)
      .digest('hex');
    return database.collection(bookingSlotsCollection).doc(slotId);
  });
  const reservedSlots = await Promise.all(
    slotReferences.map(async (reference, index) => ({
      horario: slotOptions[index],
      reserved: (await reference.get()).exists,
    })),
  );

  const legacyBookings = await database
    .collection(bookingsCollection)
    .where('pontoId', '==', pointId)
    .get();
  const legacyBookedSlots = new Set(
    legacyBookings.docs
      .map((document) => document.data())
      .filter(
        (booking) =>
          booking.data === date &&
          !['recusado', 'rejected'].includes(booking.status),
      )
      .map((booking) => {
        const time = typeof booking.horario === 'string'
          ? booking.horario.match(/\d{2}:\d{2}/)?.[0]
          : null;
        return time;
      })
      .filter(Boolean),
  );

  return reservedSlots
    .filter(
      ({ horario, reserved }) => reserved || legacyBookedSlots.has(horario),
    )
    .map(({ horario }) => horario);
}

export async function listUserCollections(userId) {
  const snapshot = await database
    .collection(collectionsCollection)
    .where('usuarioId', '==', userId)
    .get();
  return snapshot.docs.map(toRecord);
}

export async function listAllCollections() {
  const snapshot = await database.collection(collectionsCollection).get();
  return snapshot.docs.map(toRecord);
}

export async function createAdminCollection(collection, agendamentoId = '') {
  const reference = database.collection(collectionsCollection).doc();
  const record = {
    ...collection,
    criadoEm: FieldValue.serverTimestamp(),
  };

  if (agendamentoId) {
    const bookingReference = database
      .collection(bookingsCollection)
      .doc(agendamentoId);
    let linkedRecord;
    await database.runTransaction(async (transaction) => {
      const bookingDocument = await transaction.get(bookingReference);
      if (!bookingDocument.exists) {
        const error = new Error('Agendamento não encontrado.');
        error.statusCode = 404;
        throw error;
      }

      const booking = bookingDocument.data();
      if (booking.status !== 'aceito' || booking.coletaId) {
        const error = new Error(
          'Este agendamento não está disponível para registrar uma coleta.',
        );
        error.statusCode = 409;
        throw error;
      }
      if (
        booking.modalidade !== collection.modalidade ||
        (booking.modalidade === 'ponto' &&
          booking.pontoId !== collection.pontoId)
      ) {
        const error = new Error(
          'A modalidade ou o ponto deve corresponder ao agendamento selecionado.',
        );
        error.statusCode = 400;
        throw error;
      }
      if (typeof booking.usuarioId !== 'string' || !booking.usuarioId) {
        const error = new Error(
          'O agendamento não está associado a um usuário.',
        );
        error.statusCode = 409;
        throw error;
      }

      linkedRecord = {
        ...record,
        agendamentoId,
        usuarioId: booking.usuarioId,
      };
      transaction.create(reference, linkedRecord);
      transaction.update(bookingReference, {
        coletaId: reference.id,
        coletaRegistradaEm: FieldValue.serverTimestamp(),
      });
    });
    return {
      ...collection,
      agendamentoId,
      usuarioId: linkedRecord.usuarioId,
      id: reference.id,
    };
  }

  await reference.create(record);
  return { ...collection, id: reference.id };
}

export async function listAllBookings() {
  const snapshot = await database.collection(bookingsCollection).get();
  return Promise.all(
    snapshot.docs.map(async (document) => {
      const booking = toRecord(document);
      if (booking.criadoEm?.toDate) {
        booking.criadoEm = booking.criadoEm.toDate().toISOString();
      }
      if (!booking.usuarioId) {
        return booking;
      }

      const user = await database
        .collection(usersCollection)
        .doc(booking.usuarioId)
        .get();
      const userData = user.exists ? user.data() : {};
      return {
        ...booking,
        solicitante: {
          id: booking.usuarioId,
          nome: userData.nome ?? booking.nomeContribuinte ?? 'Solicitante',
          telefone: userData.telefone ?? booking.telefoneContato ?? '',
        },
      };
    }),
  );
}

export async function decideBooking(id, status, motivoRecusa = '') {
  const reference = database.collection(bookingsCollection).doc(id);
  const update = {
    status,
    atualizadoEm: FieldValue.serverTimestamp(),
  };
  if (status === 'recusado') {
    update.motivoRecusa = motivoRecusa;
  } else {
    update.motivoRecusa = FieldValue.delete();
  }
  let decidedBooking = null;
  await database.runTransaction(async (transaction) => {
    const document = await transaction.get(reference);
    if (!document.exists) {
      return;
    }

    const booking = document.data();
    if (['aceito', 'recusado'].includes(booking.status)) {
      const error = new Error('Esta solicitação já recebeu uma decisão.');
      error.statusCode = 409;
      throw error;
    }

    if (status === 'recusado' && booking.pontoId && booking.data && booking.horario) {
      const time =
        typeof booking.horario === 'string'
          ? booking.horario.match(/\d{2}:\d{2}/)?.[0]
          : null;
      if (time) {
        const slotId = createHash('sha256')
          .update(`${booking.pontoId}|${booking.data}|${time}`)
          .digest('hex');
        transaction.delete(database.collection(bookingSlotsCollection).doc(slotId));
      }
    }

    if (typeof booking.usuarioId === 'string' && booking.usuarioId) {
      const notificationReference = database
        .collection(notificationsCollection)
        .doc();
      const date = typeof booking.data === 'string' ? booking.data : '';
      const time = typeof booking.horario === 'string' ? booking.horario : '';
      transaction.create(notificationReference, {
        usuarioId: booking.usuarioId,
        agendamentoId: id,
        tipo: 'decisao_agendamento',
        titulo:
          status === 'aceito'
            ? 'Agendamento aprovado'
            : 'Agendamento não aprovado',
        descricao:
          status === 'aceito'
            ? `Sua coleta de ${date}, às ${time}, foi aprovada.`
            : `Sua coleta de ${date}, às ${time}, não foi aprovada. ${motivoRecusa}`,
        data: date,
        horario: time,
        lida: false,
        criadoEm: FieldValue.serverTimestamp(),
      });
    }
    transaction.update(reference, update);
    decidedBooking = {
      ...toRecord(document),
      status,
    };
    if (status === 'recusado') decidedBooking.motivoRecusa = motivoRecusa;
    else delete decidedBooking.motivoRecusa;
  });
  return decidedBooking;
}

export async function findScheduleByPointId(pointId) {
  const document = await database
    .collection(schedulesCollection)
    .doc(pointId)
    .get();
  return document.exists ? toRecord(document) : null;
}

export async function saveSchedule(pointId, schedule) {
  const reference = database.collection(schedulesCollection).doc(pointId);
  await reference.set(
    {
      ...schedule,
      pontoId: pointId,
      atualizadoEm: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  return { ...schedule, pontoId: pointId };
}

export async function listUserProperties(userId) {
  const snapshot = await database
    .collection(propertiesCollection)
    .where('usuarioId', '==', userId)
    .get();
  return snapshot.docs.map(toRecord);
}

export async function createUserProperty(userId, property) {
  const reference = database.collection(propertiesCollection).doc();
  const record = {
    ...property,
    usuarioId: userId,
    endereco: `${property.rua}, ${property.numero}`,
    criadoEm: FieldValue.serverTimestamp(),
  };
  await reference.create(record);
  return {
    ...property,
    usuarioId: userId,
    endereco: record.endereco,
    id: reference.id,
  };
}
