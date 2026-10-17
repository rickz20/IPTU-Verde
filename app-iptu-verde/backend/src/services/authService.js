import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createPayerUser,
  findUserByEmail,
} from '../repositories/userRepository.js';

const ALLOWED_USER_TYPES = new Set(['pagador', 'adm']);
const TOKEN_LIFETIME = '1h';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres.');
  }
  return secret;
}

export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (
    !user ||
    typeof user.senhaHash !== 'string' ||
    !(await bcrypt.compare(password, user.senhaHash))
  ) {
    return null;
  }

  if (!ALLOWED_USER_TYPES.has(user.tipo)) {
    throw new Error(
      'O campo tipo do usuário deve ser pagador ou adm.',
    );
  }

  const token = jwt.sign(
    { tipo: user.tipo },
    getJwtSecret(),
    {
      subject: user.id,
      expiresIn: TOKEN_LIFETIME,
      issuer: 'iptu-verde-api',
      audience: 'iptu-verde-app',
    },
  );

  return {
    token,
    expiresIn: TOKEN_LIFETIME,
    usuario: {
      id: user.id,
      cpf: user.cpf,
      email: user.email,
      nome: user.nome,
      telefone: user.telefone,
      tipo: user.tipo,
    },
  };
}

export async function registerPayer({
  cpf,
  email,
  nome,
  password,
  telefone,
}) {
  const senhaHash = await bcrypt.hash(password, 12);

  await createPayerUser({
    cpf,
    email: email.trim().toLowerCase(),
    nome: nome.trim(),
    senhaHash,
    telefone: telefone.trim(),
  });
}
