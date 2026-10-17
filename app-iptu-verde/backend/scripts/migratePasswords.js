import '../src/config/env.js';
import bcrypt from 'bcryptjs';
import { FieldValue } from 'firebase-admin/firestore';
import { database } from '../src/config/firebaseAdmin.js';

const applyChanges = process.argv.includes('--apply');
const unknownArguments = process.argv.slice(2).filter((arg) => arg !== '--apply');
if (unknownArguments.length > 0) {
  throw new Error(`Argumentos desconhecidos: ${unknownArguments.join(', ')}`);
}

const collectionName =
  process.env.FIRESTORE_USERS_COLLECTION?.trim() || 'usuarios';
const users = await database.collection(collectionName).get();
const normalizedEmails = new Set();
const changes = [];
let alreadyMigrated = 0;
let missingCredentials = 0;

for (const document of users.docs) {
  const user = document.data();
  const email =
    typeof user.email === 'string' ? user.email.trim().toLowerCase() : '';

  if (!email) {
    missingCredentials += 1;
    continue;
  }

  if (normalizedEmails.has(email)) {
    throw new Error(
      'A coleção contém e-mails repetidos (ignorando maiúsculas/minúsculas). Nenhuma alteração foi feita.',
    );
  }
  normalizedEmails.add(email);

  const existingHash =
    typeof user.senhaHash === 'string' ? user.senhaHash : '';
  const legacyPassword =
    typeof user.senha === 'string' ? user.senha : '';

  if (!existingHash && !legacyPassword) {
    missingCredentials += 1;
    continue;
  }

  const senhaHash =
    existingHash ||
    (/^\$2[aby]\$\d{2}\$/.test(legacyPassword)
      ? legacyPassword
      : await bcrypt.hash(legacyPassword, 12));

  if (existingHash && !legacyPassword && user.email === email) {
    alreadyMigrated += 1;
    continue;
  }

  changes.push({
    reference: document.ref,
    email,
    senhaHash,
    removePlaintext: Boolean(legacyPassword),
  });
}

console.log(`Usuários encontrados: ${users.size}`);
console.log(`Documentos a atualizar: ${changes.length}`);
console.log(`Já migrados: ${alreadyMigrated}`);
console.log(`Sem e-mail ou senha para migrar: ${missingCredentials}`);

if (!applyChanges) {
  console.log(
    'Simulação concluída; o Firestore não foi alterado. Use --apply para aplicar a migração.',
  );
} else {
  for (let start = 0; start < changes.length; start += 400) {
    const batch = database.batch();
    const chunk = changes.slice(start, start + 400);

    for (const change of chunk) {
      const update = {
        email: change.email,
        senhaHash: change.senhaHash,
      };
      if (change.removePlaintext) {
        update.senha = FieldValue.delete();
      }
      batch.update(change.reference, update);
    }

    await batch.commit();
  }

  console.log('Migração aplicada. O campo senha em texto puro foi removido.');
}
