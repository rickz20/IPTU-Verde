const pontoReferencia = {
  nome: 'Ponto de coleta 1',
  endereco: 'Rua Lauro Ramos Duarte 103, Centro',
  cidade: 'Quixadá CE, 63900-000',
  referencia: 'Próximo à Lojinha da Sandra',
  horario: 'Segunda a Sexta, de 08:00 às 15:00',
};

export const pontosColeta = [
  { id: '1', ...pontoReferencia },
  { id: '2', ...pontoReferencia },
  { id: '3', ...pontoReferencia },
];
