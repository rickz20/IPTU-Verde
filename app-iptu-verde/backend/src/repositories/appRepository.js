import { FieldValue } from 'firebase-admin/firestore';
import { database } from '../config/firebaseAdmin.js';

const pointsCollection =
  process.env.FIRESTORE_POINTS_COLLECTION?.trim() || 'pontosColeta';
const bookingsCollection =
  process.env.FIRESTORE_BOOKINGS_COLLECTION?.trim() || 'agendamentos';
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
  const record = {
    ...booking,
    usuarioId: userId,
    status: 'agendado',
    criadoEm: FieldValue.serverTimestamp(),
  };
  await reference.create(record);
  return {
    ...booking,
    usuarioId: userId,
    status: 'agendado',
    id: reference.id,
  };
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
