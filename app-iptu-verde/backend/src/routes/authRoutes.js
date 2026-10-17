import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { login, registerPayer } from '../services/authService.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas. Tente novamente mais tarde.' },
});
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitos cadastros. Tente novamente mais tarde.' },
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

router.post(
  '/auth/register',
  registrationLimiter,
  async (request, response, next) => {
    try {
      const { cpf, email, nome, senha, telefone } = request.body ?? {};
      const normalizedCpf =
        typeof cpf === 'string' ? cpf.replace(/\D/g, '') : '';
      const normalizedPhone =
        typeof telefone === 'string' ? telefone.replace(/\D/g, '') : '';

      if (
        typeof nome !== 'string' ||
        typeof cpf !== 'string' ||
        typeof telefone !== 'string' ||
        typeof email !== 'string' ||
        typeof senha !== 'string' ||
        nome.trim().length < 2 ||
        nome.trim().length > 120 ||
        normalizedCpf.length !== 11 ||
        ![10, 11].includes(normalizedPhone.length) ||
        email.length > 254 ||
        !isValidEmail(email) ||
        Buffer.byteLength(senha, 'utf8') < 8 ||
        Buffer.byteLength(senha, 'utf8') > 72
      ) {
        return response.status(400).json({
          erro:
            'Confira os dados: nome, CPF, telefone, e-mail válido e senha de 8 a 72 bytes.',
        });
      }

      await registerPayer({
        cpf: normalizedCpf,
        email,
        nome,
        password: senha,
        telefone: telefone.trim(),
      });

      return response.status(201).json({
        mensagem: 'Cadastro realizado. Faça login para continuar.',
      });
    } catch (error) {
      return next(error);
    }
  },
);

router.post('/auth/login', loginLimiter, async (request, response, next) => {
  try {
    const { email, senha } = request.body ?? {};
    if (
      typeof email !== 'string' ||
      typeof senha !== 'string' ||
      email.trim().length === 0 ||
      senha.length === 0 ||
      email.length > 254 ||
      senha.length > 128
    ) {
      return response.status(400).json({
        erro: 'Informe um e-mail e uma senha válidos.',
      });
    }

    const result = await login(email, senha);
    if (!result) {
      return response.status(401).json({
        erro: 'E-mail ou senha incorretos.',
      });
    }

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
