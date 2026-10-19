import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { database } from '../config/firebaseAdmin.js';

const USERS_COLLECTION =
  process.env.FIRESTORE_USERS_COLLECTION?.trim() || 'usuarios';
const PROPERTIES_COLLECTION =
  process.env.FIRESTORE_PROPERTIES_COLLECTION?.trim() || 'imoveis';
const usersCollection = database.collection(USERS_COLLECTION);
const propertiesCollection = database.collection(PROPERTIES_COLLECTION);

export async function findUserByEmail(email) {
  const snapshot = await usersCollection
    .where('email', '==', email)
    .limit(2)
    .get();

  if (snapshot.size > 1) {
    throw new Error(
      `Há mais de um usuário com o mesmo e-mail na coleção ${USERS_COLLECTION}.`,
    );
  }

  if (snapshot.empty) {
    return null;
  }

  const document = snapshot.docs[0];
  return {
    ...document.data(),
    id: document.id,
  };
}

export async function findUserById(id) {
  const document = await usersCollection.doc(id).get();
  if (!document.exists) {
    return null;
  }

  return { ...document.data(), id: document.id };
}

export async function updateUserProfile(id, profile) {
  await usersCollection.doc(id).update(profile);
}

export async function updateUserPassword(id, senhaHash) {
  await usersCollection.doc(id).update({ senhaHash });
}

export async function createPayerUser({
  cpf,
  email,
  imovel,
  nome,
  senhaHash,
  telefone,
}) {
  const formattedCpf = cpf.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4',
  );
  const emailQuery = usersCollection
    .where('email', '==', email)
    .limit(1);
  const cpfQueries = [
    usersCollection.where('cpf', '==', cpf).limit(1),
    usersCollection.where('cpf', '==', formattedCpf).limit(1),
  ];
  const emailReference = usersCollection.doc(
    `email-${createHash('sha256').update(email).digest('hex')}`,
  );
  const propertyReference = propertiesCollection.doc();

  await database.runTransaction(async (transaction) => {
    const emailSnapshot = await transaction.get(emailQuery);
    const cpfSnapshots = [];
    for (const query of cpfQueries) {
      cpfSnapshots.push(await transaction.get(query));
    }
    const emailDocument = await transaction.get(emailReference);

    if (!emailSnapshot.empty || emailDocument.exists) {
      const error = new Error('Já existe uma conta com este e-mail.');
      error.statusCode = 409;
      throw error;
    }
    if (cpfSnapshots.some((snapshot) => !snapshot.empty)) {
      const error = new Error('Já existe uma conta com este CPF.');
      error.statusCode = 409;
      throw error;
    }

    transaction.create(emailReference, {
      cpf,
      email,
      nome,
      senhaHash,
      telefone,
      tipo: 'pagador',
      criadoEm: FieldValue.serverTimestamp(),
    });
    transaction.create(propertyReference, {
      ...imovel,
      usuarioId: emailReference.id,
      endereco: `${imovel.rua}, ${imovel.numero}`,
      criadoEm: FieldValue.serverTimestamp(),
    });
  });

  return {
    usuarioId: emailReference.id,
    imovelId: propertyReference.id,
  };
}
