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
  createUserProperty,
  createUserBooking,
  findPointById,
  listNotifications,
  listPoints,
  listBookedBookingSlots,
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
const BOOKING_TIME_SLOTS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
];

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
      const { cpf, email, imovel, nome, senha, telefone } =
        request.body ?? {};
      const normalizedCpf =
        typeof cpf === 'string' ? cpf.replace(/\D/g, '') : '';
      const normalizedPhone =
        typeof telefone === 'string' ? telefone.replace(/\D/g, '') : '';
      const normalizedCep =
        typeof imovel?.cep === 'string'
          ? imovel.cep.replace(/\D/g, '')
          : '';
      const vinculosValidos = [
        'proprietario',
        'inquilino',
        'residente',
      ];

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
        Buffer.byteLength(senha, 'utf8') > 72 ||
        !imovel ||
        typeof imovel.rua !== 'string' ||
        imovel.rua.trim().length < 2 ||
        imovel.rua.trim().length > 120 ||
        typeof imovel.numero !== 'string' ||
        imovel.numero.trim().length < 1 ||
        imovel.numero.trim().length > 20 ||
        typeof imovel.bairro !== 'string' ||
        imovel.bairro.trim().length < 2 ||
        imovel.bairro.trim().length > 80 ||
        (imovel.complemento !== undefined &&
          typeof imovel.complemento !== 'string') ||
        (typeof imovel.complemento === 'string' &&
          imovel.complemento.trim().length > 120) ||
        typeof imovel.inscricaoImobiliaria !== 'string' ||
        imovel.inscricaoImobiliaria.trim().length < 1 ||
        imovel.inscricaoImobiliaria.trim().length > 40 ||
        normalizedCep.length !== 8 ||
        !vinculosValidos.includes(imovel.vinculo)
      ) {
        return response.status(400).json({
          erro:
            'Confira os dados pessoais e do imóvel. Preencha CEP, rua, número, bairro, inscrição imobiliária e vínculo.',
        });
      }

      await registerPayer({
        cpf: normalizedCpf,
        email,
        imovel: {
          cep: normalizedCep,
          rua: imovel.rua.trim(),
          numero: imovel.numero.trim(),
          bairro: imovel.bairro.trim(),
          complemento: imovel.complemento?.trim() ?? '',
          inscricaoImobiliaria: imovel.inscricaoImobiliaria.trim(),
          vinculo: imovel.vinculo,
        },
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

router.get(
  '/agendamentos/disponibilidade',
  requireAuth,
  async (request, response, next) => {
    try {
      const { pontoId, data } = request.query;
      if (
        typeof pontoId !== 'string' ||
        pontoId.trim().length === 0 ||
        typeof data !== 'string' ||
        !isValidFutureDate(data)
      ) {
        return response.status(400).json({
          erro: 'Informe um ponto de coleta e uma data válida, hoje ou futura.',
        });
      }

      const point = await findPointById(pontoId);
      if (!point) {
        return response
          .status(404)
          .json({ erro: 'Ponto de coleta não encontrado.' });
      }

      const horariosOcupados = await listBookedBookingSlots(
        pontoId,
        data,
        BOOKING_TIME_SLOTS,
      );
      const horariosDisponiveis = BOOKING_TIME_SLOTS.filter(
        (horario) => !horariosOcupados.includes(horario),
      );
      return response.status(200).json({
        horariosDisponiveis,
        horariosOcupados,
      });
    } catch (error) {
      return next(error);
    }
  },
);

router.post('/agendamentos', requireAuth, async (request, response, next) => {
  try {
    const {
      pontoId,
      data,
      horario,
      modalidade,
      materiais,
      endereco,
      telefone,
    } = request.body ?? {};
    const telefoneDigits =
      typeof telefone === 'string' ? telefone.replace(/\D/g, '') : '';
    if (
      typeof pontoId !== 'string' ||
      typeof data !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
      typeof horario !== 'string' ||
      horario.trim().length > 80 ||
      !BOOKING_TIME_SLOTS.includes(horario.trim()) ||
      ![10, 11].includes(telefoneDigits.length) ||
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
      ponto:
        modalidade === 'domicilio' ? 'Coleta em domicílio' : point.nome,
      endereco: modalidade === 'domicilio' ? endereco.trim() : point.endereco,
      data,
      horario: horario.trim(),
      modalidade,
      materiais: materiais.map((material) => material.trim()),
      telefoneContato: telefoneDigits,
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

router.post('/imoveis', requireAuth, async (request, response, next) => {
  try {
    const {
      bairro,
      cep,
      complemento,
      inscricaoImobiliaria,
      numero,
      rua,
    } = request.body ?? {};
    const cepDigits = typeof cep === 'string' ? cep.replace(/\D/g, '') : '';

    if (
      typeof rua !== 'string' ||
      rua.trim().length < 2 ||
      rua.trim().length > 120 ||
      typeof numero !== 'string' ||
      numero.trim().length < 1 ||
      numero.trim().length > 20 ||
      typeof bairro !== 'string' ||
      bairro.trim().length < 2 ||
      bairro.trim().length > 80 ||
      cepDigits.length !== 8 ||
      typeof inscricaoImobiliaria !== 'string' ||
      inscricaoImobiliaria.trim().length < 1 ||
      inscricaoImobiliaria.trim().length > 40 ||
      (complemento !== undefined &&
        (typeof complemento !== 'string' || complemento.trim().length > 120))
    ) {
      return response.status(400).json({
        erro:
          'Confira rua, número, bairro, CEP e inscrição imobiliária do imóvel.',
      });
    }

    const imovel = await createUserProperty(request.usuario.id, {
      rua: rua.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
      cep: cepDigits,
      complemento: complemento?.trim() ?? '',
      inscricaoImobiliaria: inscricaoImobiliaria.trim(),
    });
    return response.status(201).json({ imovel });
  } catch (error) {
    return next(error);
  }
});

export default router;
