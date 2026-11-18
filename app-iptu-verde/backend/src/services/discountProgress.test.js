import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDiscountProgress } from './discountProgress.js';

function createCollections(count, weightKg, year = '2026') {
  return Array.from({ length: count }, (_, index) => ({
    data: `${year}-01-${String(index + 1).padStart(2, '0')}`,
    pesoTotal: weightKg,
  }));
}

test('applies each discount tier only when count and weight thresholds are met', () => {
  const cases = [
    [2, 20, 3],
    [4, 50, 6],
    [6, 100, 9],
    [8, 180, 12],
    [10, 300, 15],
  ];

  for (const [count, weightKg, expectedDiscount] of cases) {
    assert.equal(
      calculateDiscountProgress(
        createCollections(count, weightKg / count),
        2026,
      ).percentualDesconto,
      expectedDiscount,
    );
  }
});

test('requires both thresholds and reports the shortfall to the next tier', () => {
  const progress = calculateDiscountProgress(createCollections(9, 50 / 9), 2026);

  assert.equal(progress.percentualDesconto, 6);
  assert.deepEqual(progress.proximaFaixa, {
    percentual: 9,
    faltamColetas: 0,
    faltamKg: 50,
  });
});

test('counts only weighed collections from the requested year', () => {
  const collections = [
    ...createCollections(2, 10),
    { data: '2025-12-31', pesoTotal: 50 },
    { data: '2026-02-30', pesoTotal: 50 },
    { data: '2026-03-01' },
  ];

  assert.deepEqual(calculateDiscountProgress(collections, 2026), {
    ano: 2026,
    coletasValidas: 2,
    pesoTotalKg: 20,
    percentualDesconto: 3,
    proximaFaixa: {
      percentual: 6,
      faltamColetas: 2,
      faltamKg: 30,
    },
  });
});

test('converts material weights in grams when no total is stored', () => {
  const progress = calculateDiscountProgress(
    [
      {
        data: '2026-01-01',
        materiais: [
          { peso: 1500, unidadePeso: 'g' },
          { peso: 2, unidadePeso: 'kg' },
        ],
      },
    ],
    2026,
  );

  assert.equal(progress.coletasValidas, 1);
  assert.equal(progress.pesoTotalKg, 3.5);
});
