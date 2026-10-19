import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import {
  changePassword,
  login,
  registerPayer,
} from '../services/authService.js';
import {
  findUserById,
  updateUserProfile,
} from '../repositories/userRepository.js';
import {
  createUserBooking,
  findPointById,
  listNotifications,
  listPoints,
  listUserBookings,
  listUserCollections,
  listUserProperties,
} from '../repositories/appRepository.js';
import { requireAuth } from '../middleware/requireAuth.js';

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
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas. Tente novamente mais tarde.' },
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidFutureDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date &&
    date >= new Date().toISOString().slice(0, 10)
  );
}

function isValidTimeRange(time) {
  if (!/^\d{2}:\d{2}(?:\s*(?:-|às)\s*\d{2}:\d{2})?$/.test(time.trim())) {
    return false;
  }
  return [...time.matchAll(/(\d{2}):(\d{2})/g)].every(
    ([, hours, minutes]) => Number(hours) < 24 && Number(minutes) < 60,
  );
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

router.get('/auth/me', requireAuth, async (request, response, next) => {
  try {
    const user = await findUserById(request.usuario.id);
    if (!user) {
      return response.status(404).json({ erro: 'Conta não encontrada.' });
    }

    const { cpf, email, nome, telefone, tipo } = user;
    return response.status(200).json({
      usuario: { id: user.id, cpf, email, nome, telefone, tipo },
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/auth/me', requireAuth, async (request, response, next) => {
  try {
    const { nome, telefone } = request.body ?? {};
    const update = {};

    if (nome !== undefined) {
      if (
        typeof nome !== 'string' ||
        nome.trim().length < 2 ||
        nome.trim().length > 120
      ) {
        return response.status(400).json({ erro: 'Informe um nome válido.' });
      }
      update.nome = nome.trim();
    }

    if (telefone !== undefined) {
      const digits =
        typeof telefone === 'string' ? telefone.replace(/\D/g, '') : '';
      if (![10, 11].includes(digits.length)) {
        return response
          .status(400)
          .json({ erro: 'Informe um telefone válido com DDD.' });
      }
      update.telefone = telefone.trim();
    }

    if (Object.keys(update).length === 0) {
      return response.status(400).json({ erro: 'Nenhum dado para atualizar.' });
    }

    await updateUserProfile(request.usuario.id, update);
    const user = await findUserById(request.usuario.id);
    const {
      cpf,
      email,
      nome: nomeAtualizado,
      telefone: telefoneAtualizado,
      tipo,
    } = user;
    return response.status(200).json({
      usuario: {
        id: user.id,
        cpf,
        email,
        nome: nomeAtualizado,
        telefone: telefoneAtualizado,
        tipo,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.patch(
  '/auth/password',
  requireAuth,
  passwordLimiter,
  async (request, response, next) => {
    try {
      const { senhaAtual, novaSenha } = request.body ?? {};
      if (
        typeof senhaAtual !== 'string' ||
        typeof novaSenha !== 'string' ||
        senhaAtual.length === 0 ||
        Buffer.byteLength(novaSenha, 'utf8') < 8 ||
        Buffer.byteLength(novaSenha, 'utf8') > 72 ||
        !/[a-zA-Z]/.test(novaSenha) ||
        !/\d/.test(novaSenha)
      ) {
        return response.status(400).json({
          erro:
            'Informe a senha atual e uma nova senha de 8 a 72 bytes, com letras e números.',
        });
      }

      const changed = await changePassword(
        request.usuario.id,
        senhaAtual,
        novaSenha,
      );
      if (!changed) {
        return response.status(400).json({ erro: 'A senha atual está incorreta.' });
      }

      return response.status(200).json({ mensagem: 'Senha alterada.' });
    } catch (error) {
      return next(error);
    }
  },
);

router.get('/pontos-coleta', async (_request, response, next) => {
  try {
    return response.status(200).json({ pontos: await listPoints() });
  } catch (error) {
    return next(error);
  }
});

router.get('/notificacoes', async (_request, response, next) => {
  try {
    return response
      .status(200)
      .json({ notificacoes: await listNotifications() });
  } catch (error) {
    return next(error);
  }
});

router.get('/agendamentos', requireAuth, async (request, response, next) => {
  try {
    return response.status(200).json({
      agendamentos: await listUserBookings(request.usuario.id),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/agendamentos', requireAuth, async (request, response, next) => {
  try {
    const { pontoId, data, horario, modalidade, materiais, endereco } =
      request.body ?? {};
    if (
      typeof pontoId !== 'string' ||
      typeof data !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
      typeof horario !== 'string' ||
      horario.trim().length > 80 ||
      !['ponto', 'domicilio'].includes(modalidade) ||
      (modalidade === 'domicilio' &&
        (typeof endereco !== 'string' ||
          endereco.trim().length < 5 ||
          endereco.trim().length > 250)) ||
      !Array.isArray(materiais) ||
      !isValidFutureDate(data) ||
      !isValidTimeRange(horario) ||
      materiais.length < 1 ||
      materiais.length > 12 ||
      !materiais.every(
        (material) =>
          typeof material === 'string' &&
          material.trim().length > 0 &&
          material.trim().length <= 40,
      )
    ) {
      return response.status(400).json({
        erro: 'Confira a data, o horário, a modalidade e os materiais.',
      });
    }

    const point = await findPointById(pontoId);
    if (!point) {
      return response.status(404).json({ erro: 'Ponto de coleta não encontrado.' });
    }

    const agendamento = await createUserBooking(request.usuario.id, {
      pontoId,
      ponto: point.nome,
      endereco: modalidade === 'domicilio' ? endereco.trim() : point.endereco,
      data,
      horario: horario.trim(),
      modalidade,
      materiais: materiais.map((material) => material.trim()),
    });
    return response.status(201).json({ agendamento });
  } catch (error) {
    return next(error);
  }
});

router.get('/coletas', requireAuth, async (request, response, next) => {
  try {
    return response.status(200).json({
      coletas: await listUserCollections(request.usuario.id),
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/imoveis', requireAuth, async (request, response, next) => {
  try {
    return response.status(200).json({
      imoveis: await listUserProperties(request.usuario.id),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
