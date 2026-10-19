import { rem } from '../../utils/typography';
import { StyleSheet, Text, View } from 'react-native';
import ProgressoCircular from './ProgressoCircular';
import { CORES } from './tema';

export default function CartaoProgresso({ coletasRealizadas = null }) {
  const percentualDesconto = coletasRealizadas === 0 ? 0 : null;
  const textoColetas =
    coletasRealizadas === null
      ? 'Não foi possível consultar seu histórico de coletas.'
      : coletasRealizadas === 0
        ? 'Nenhuma coleta registrada.'
        : `${coletasRealizadas} ${coletasRealizadas === 1 ? 'coleta registrada' : 'coletas registradas'}.`;

  return (
    <View style={styles.cartaoProgresso}>
      <ProgressoCircular percentual={percentualDesconto} />

      <View style={styles.conteudoProgresso}>
        <View
          style={styles.barraFundo}
          accessibilityRole="progressbar"
          accessibilityValue={
            percentualDesconto === null
              ? undefined
              : { min: 0, max: 100, now: percentualDesconto }
          }
        >
          {percentualDesconto !== null ? (
            <View
              style={[
                styles.barraPreenchida,
                { width: `${percentualDesconto}%` },
              ]}
            />
          ) : null}
        </View>
        <Text style={styles.dicaProgresso}>
          {textoColetas}
          {'\n'}
          O limite previsto é de até 15% de desconto no IPTU. A regra de cálculo
          ainda será definida.
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
