export const DISCOUNT_TIERS = [
  { percentual: 3, coletas: 2, pesoKg: 20 },
  { percentual: 6, coletas: 4, pesoKg: 50 },
  { percentual: 9, coletas: 6, pesoKg: 100 },
  { percentual: 12, coletas: 8, pesoKg: 180 },
  { percentual: 15, coletas: 10, pesoKg: 300 },
];

function isCollectionDateInYear(date, year) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return (
    date.startsWith(`${year}-`) &&
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
}

function getCollectionWeightKg(collection) {
  const total = Number(collection.pesoTotal);
  if (Number.isFinite(total) && total > 0) {
    return total;
  }

  if (!Array.isArray(collection.materiais)) {
    return 0;
  }

  return collection.materiais.reduce((sum, material) => {
    if (!material || typeof material !== 'object') {
      return sum;
    }
    const weight = Number(material.peso);
    if (
      !Number.isFinite(weight) ||
      weight <= 0 ||
      !['g', 'kg'].includes(material.unidadePeso)
    ) {
      return sum;
    }
    return sum + (material.unidadePeso === 'g' ? weight / 1000 : weight);
  }, 0);
}

function roundToTwoDecimals(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateDiscountProgress(collections, year) {
  const eligibleCollections = collections.filter(
    (collection) =>
      isCollectionDateInYear(collection.data, year) &&
      getCollectionWeightKg(collection) > 0,
  );
  const pesoTotalKg = roundToTwoDecimals(
    eligibleCollections.reduce(
      (total, collection) => total + getCollectionWeightKg(collection),
      0,
    ),
  );
  const coletasValidas = eligibleCollections.length;
  const faixaAtual = [...DISCOUNT_TIERS]
    .reverse()
    .find(
      (tier) =>
        coletasValidas >= tier.coletas && pesoTotalKg >= tier.pesoKg,
    );
  const proximaFaixa = DISCOUNT_TIERS.find(
    (tier) =>
      coletasValidas < tier.coletas || pesoTotalKg < tier.pesoKg,
  );

  return {
    ano: year,
    coletasValidas,
    pesoTotalKg,
    percentualDesconto: faixaAtual?.percentual ?? 0,
    proximaFaixa: proximaFaixa
      ? {
          percentual: proximaFaixa.percentual,
          faltamColetas: Math.max(0, proximaFaixa.coletas - coletasValidas),
          faltamKg: roundToTwoDecimals(
            Math.max(0, proximaFaixa.pesoKg - pesoTotalKg),
          ),
        }
      : null,
  };
}
