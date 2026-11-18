import { rem } from '../../utils/typography';
import { StyleSheet, Text, View } from 'react-native';
import ProgressoCircular from './ProgressoCircular';
import { CORES } from './tema';

const formatarPeso = (peso) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(peso);

export default function CartaoProgresso({
  progressoDesconto = null,
  carregando = false,
  erro = false,
}) {
  const percentualDesconto = progressoDesconto?.percentualDesconto ?? null;
  const percentualProgresso =
    percentualDesconto === null ? null : (percentualDesconto / 15) * 100;
  const textoProgresso = carregando
    ? 'Calculando seu progresso...'
    : erro || !progressoDesconto
      ? 'Não foi possível consultar seu histórico de coletas.'
      : `${progressoDesconto.coletasValidas} ${
          progressoDesconto.coletasValidas === 1 ? 'coleta' : 'coletas'
        } e ${formatarPeso(progressoDesconto.pesoTotalKg)} kg em ${progressoDesconto.ano}.`;
  const textoProximaFaixa = progressoDesconto?.proximaFaixa
    ? `Próxima faixa: ${progressoDesconto.proximaFaixa.percentual}%. Faltam ${
        [
          progressoDesconto.proximaFaixa.faltamColetas > 0
            ? `${progressoDesconto.proximaFaixa.faltamColetas} ${
                progressoDesconto.proximaFaixa.faltamColetas === 1
                  ? 'coleta'
                  : 'coletas'
              }`
            : '',
          progressoDesconto.proximaFaixa.faltamKg > 0
            ? `${formatarPeso(progressoDesconto.proximaFaixa.faltamKg)} kg`
            : '',
        ]
          .filter(Boolean)
          .join(' e ')
      }.`
    : progressoDesconto
      ? 'Você atingiu o desconto máximo de 15%.'
      : 'O desconto anual pode chegar a 15%, conforme a quantidade de coletas e o peso recebido.';

  return (
    <View style={styles.cartaoProgresso}>
      <ProgressoCircular percentual={percentualDesconto} />

      <View style={styles.conteudoProgresso}>
        <View
          style={styles.barraFundo}
          accessibilityRole="progressbar"
          accessibilityValue={
            percentualProgresso === null
              ? undefined
              : { min: 0, max: 15, now: percentualDesconto }
          }
        >
          {percentualProgresso !== null ? (
            <View
              style={[
                styles.barraPreenchida,
                { width: `${percentualProgresso}%` },
              ]}
            />
          ) : null}
        </View>
        <Text style={styles.dicaProgresso}>
          {textoProgresso}
          {'\n'}
          {textoProximaFaixa}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartaoProgresso: {
    backgroundColor: CORES.cinza,
    borderRadius: 18,
    padding: 16,
    minHeight: 168,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  conteudoProgresso: {
    flex: 1,
  },
  barraFundo: {
    height: 10,
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#DDDDDD',
  },
  barraPreenchida: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: CORES.verde,
  },
  dicaProgresso: {
    fontSize: rem(1),
    lineHeight: rem(1.25),
    color: CORES.texto,
    fontFamily: 'Inter_400Regular',
  },
});
