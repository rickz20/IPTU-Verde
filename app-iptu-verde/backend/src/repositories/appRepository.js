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

export async function listNotifications() {
  const snapshot = await database.collection(notificationsCollection).get();
  return snapshot.docs.map(toRecord);
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
      return existing.data === booking.data && existingTime === booking.horario;
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
      .filter((booking) => booking.data === date)
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

export async function listUserProperties(userId) {
  const snapshot = await database
    .collection(propertiesCollection)
    .where('usuarioId', '==', userId)
    .get();
  return snapshot.docs.map(toRecord);
}
