import { Router } from 'express';
import {
  createAdminCollection,
  decideBooking,
  findPointById,
  findScheduleByPointId,
  listAllBookings,
  listAllCollections,
  listPoints,
  saveSchedule,
} from '../repositories/appRepository.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { getBusinessDate } from '../services/dateUtils.js';

const router = Router();
const validDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const validTime = (value) =>
  typeof value === 'string' &&
  /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);

router.use(requireAuth, requireAdmin);

router.get('/coletas', async (_request, response, next) => {
  try {
    return response.status(200).json({ coletas: await listAllCollections() });
  } catch (error) {
    return next(error);
  }
});

router.post('/coletas', async (request, response, next) => {
  try {
    const {
      data,
      horario,
      nomeContribuinte,
      telefone,
      modalidade,
      pontoId,
      agendamentoId,
      endereco,
      materiais,
    } = request.body ?? {};
    const linkedToBooking =
      typeof agendamentoId === 'string' && agendamentoId.trim().length > 0;
    const telefoneDigits =
      typeof telefone === 'string' ? telefone.replace(/\D/g, '') : '';
    const pointMode = modalidade === 'ponto';
    const validMaterials =
      Array.isArray(materiais) &&
      materiais.length > 0 &&
      materiais.length <= 20 &&
      materiais.every(
        (item) =>
          item &&
          typeof item.categoria === 'string' &&
          item.categoria.trim().length <= 40 &&
          typeof item.descricao === 'string' &&
          item.descricao.trim().length > 0 &&
          item.descricao.trim().length <= 120 &&
          typeof item.peso === 'number' &&
          Number.isFinite(item.peso) &&
          item.peso > 0 &&
          ['g', 'kg'].includes(item.unidadePeso),
      );

    if (
      !validDate(data) ||
      !validTime(horario) ||
      typeof nomeContribuinte !== 'string' ||
      nomeContribuinte.trim().length < 2 ||
      nomeContribuinte.trim().length > 120 ||
      ![10, 11].includes(telefoneDigits.length) ||
      !['ponto', 'domicilio'].includes(modalidade) ||
      (agendamentoId !== undefined &&
        (typeof agendamentoId !== 'string' ||
          !agendamentoId.trim() ||
          agendamentoId.trim().length > 200)) ||
      (pointMode &&
        (typeof pontoId !== 'string' || pontoId.trim().length === 0)) ||
      (!pointMode &&
        (typeof endereco !== 'string' ||
          endereco.trim().length < 5 ||
          endereco.trim().length > 300)) ||
      (!pointMode &&
        !linkedToBooking &&
        (typeof request.body.cep !== 'string' ||
          request.body.cep.replace(/\D/g, '').length !== 8 ||
          typeof request.body.rua !== 'string' ||
          request.body.rua.trim().length < 2 ||
          typeof request.body.numero !== 'string' ||
          request.body.numero.trim().length < 1 ||
          typeof request.body.bairro !== 'string' ||
          request.body.bairro.trim().length < 2 ||
          typeof request.body.cidade !== 'string' ||
          request.body.cidade.trim().length < 2 ||
          typeof request.body.uf !== 'string' ||
          request.body.uf.trim().length !== 2)) ||
      !validMaterials
    ) {
      return response.status(400).json({
        erro: 'Confira os dados da coleta, o contato e os materiais recebidos.',
      });
    }

    let point = null;
    if (pointMode) {
      point = await findPointById(pontoId);
      if (!point) {
        return response.status(404).json({ erro: 'Ponto de coleta não encontrado.' });
      }
    }

    const collection = await createAdminCollection({
      data,
      horario,
      nomeContribuinte: nomeContribuinte.trim(),
      telefone: telefone.trim(),
      modalidade,
      pontoId: point?.id ?? '',
      ponto: point?.nome ?? '',
      endereco: point?.endereco ?? endereco.trim(),
      cep: modalidade === 'domicilio' ? request.body.cep?.trim() ?? '' : '',
      rua: modalidade === 'domicilio' ? request.body.rua?.trim() ?? '' : '',
      numero: modalidade === 'domicilio' ? request.body.numero?.trim() ?? '' : '',
      complemento:
        modalidade === 'domicilio' ? request.body.complemento?.trim() ?? '' : '',
      bairro: modalidade === 'domicilio' ? request.body.bairro?.trim() ?? '' : '',
      cidade: modalidade === 'domicilio' ? request.body.cidade?.trim() ?? '' : '',
      uf: modalidade === 'domicilio' ? request.body.uf?.trim() ?? '' : '',
      referencia:
        modalidade === 'domicilio' ? request.body.referencia?.trim() ?? '' : '',
      materiais: materiais.map((item) => ({
        categoria: item.categoria.trim(),
        descricao: item.descricao.trim(),
        peso: item.peso,
        unidadePeso: item.unidadePeso,
      })),
      pesoTotal: materiais.reduce(
        (total, item) =>
          total + (item.unidadePeso === 'g' ? item.peso / 1000 : item.peso),
        0,
      ),
      registradoPor: request.usuario.id,
    }, linkedToBooking ? agendamentoId.trim() : '');
    return response.status(201).json({ coleta: collection });
  } catch (error) {
    return next(error);
  }
});

router.get('/agendamentos', async (_request, response, next) => {
  try {
    return response.status(200).json({ agendamentos: await listAllBookings() });
  } catch (error) {
    return next(error);
  }
});

router.patch('/agendamentos/:id/decisao', async (request, response, next) => {
  try {
    const { status, motivo } = request.body ?? {};
    if (
      !['aceito', 'recusado'].includes(status) ||
      (status === 'recusado' &&
        (typeof motivo !== 'string' ||
          motivo.trim().length < 5 ||
          motivo.trim().length > 1000))
    ) {
      return response.status(400).json({
        erro: 'Informe uma decisão válida e, ao recusar, um motivo de pelo menos 5 caracteres.',
      });
    }

    const booking = await decideBooking(
      request.params.id,
      status,
      status === 'recusado' ? motivo.trim() : '',
    );
    if (!booking) {
      return response.status(404).json({ erro: 'Solicitação não encontrada.' });
    }
    const agendamento = { ...booking };
    delete agendamento.atualizadoEm;
    if (status === 'aceito') {
      delete agendamento.motivoRecusa;
    }
    return response.status(200).json({ agendamento });
  } catch (error) {
    return next(error);
  }
});

router.get('/agenda/configuracao', async (request, response, next) => {
  try {
    const { pontoId } = request.query;
    if (typeof pontoId !== 'string' || !pontoId.trim()) {
      return response.status(400).json({ erro: 'Informe um ponto de coleta.' });
    }
    if (!(await findPointById(pontoId))) {
      return response.status(404).json({ erro: 'Ponto de coleta não encontrado.' });
    }
    return response.status(200).json({
      configuracao: await findScheduleByPointId(pontoId),
    });
  } catch (error) {
    return next(error);
  }
});

router.put('/agenda/configuracao', async (request, response, next) => {
  try {
    const {
      pontoId,
      datas,
      diasSemana,
      abertura,
      encerramento,
      inicioPausa,
      fimPausa,
      duracaoMinutos,
      modalidades,
    } = request.body ?? {};
    const validDays =
      Array.isArray(diasSemana) &&
      diasSemana.length > 0 &&
      diasSemana.every((day) => Number.isInteger(day) && day >= 0 && day <= 6);
    const validDates =
      Array.isArray(datas) &&
      datas.length > 0 &&
      datas.length <= 90 &&
      datas.every((date) => validDate(date) &&       date >= getBusinessDate());
    const validModes =
      Array.isArray(modalidades) &&
      modalidades.length > 0 &&
      modalidades.every((mode) => ['domicilio', 'ponto'].includes(mode));
    if (
      typeof pontoId !== 'string' ||
      !pontoId.trim() ||
      (!validDates && !validDays) ||
      !validTime(abertura) ||
      !validTime(encerramento) ||
      abertura >= encerramento ||
      !validTime(inicioPausa) ||
      !validTime(fimPausa) ||
      inicioPausa >= fimPausa ||
      inicioPausa < abertura ||
      fimPausa > encerramento ||
      !Number.isInteger(duracaoMinutos) ||
      duracaoMinutos < 15 ||
      duracaoMinutos > 240 ||
      !validModes
    ) {
      return response.status(400).json({
        erro: 'Confira os dias, horários, duração e modalidades da agenda.',
      });
    }

    if (!(await findPointById(pontoId))) {
      return response.status(404).json({ erro: 'Ponto de coleta não encontrado.' });
    }
    const configuracao = await saveSchedule(pontoId, {
      ...(validDates ? { datas: [...new Set(datas)].sort() } : {}),
      diasSemana: validDays
        ? [...new Set(diasSemana)]
        : [...new Set(
            datas.map((date) =>
              new Date(`${date}T00:00:00.000Z`).getUTCDay(),
            ),
          )],
      abertura,
      encerramento,
      inicioPausa,
      fimPausa,
      duracaoMinutos,
      modalidades: [...new Set(modalidades)],
    });
    return response.status(200).json({ configuracao });
  } catch (error) {
    return next(error);
  }
});

router.get('/pontos-coleta', async (_request, response, next) => {
  try {
    return response.status(200).json({ pontos: await listPoints() });
  } catch (error) {
    return next(error);
  }
});

export default router;
