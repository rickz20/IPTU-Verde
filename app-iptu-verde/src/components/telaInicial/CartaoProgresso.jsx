import { rem } from '../../utils/typography';
import { StyleSheet, Text, View } from 'react-native';
import ProgressoCircular from './ProgressoCircular';
import { CORES } from './tema';

export default function CartaoProgresso({
  percentual = 10,
  coletasNecessarias = 3,
  textoColetas = 'Você está a',
  textoDica = 'Leve seus resíduos a um ponto de coleta mais',
}) {
  return (
    <View style={styles.cartaoProgresso}>
      <ProgressoCircular percentual={percentual} />

      <View style={styles.conteudoProgresso}>
        <Text style={styles.textoPequeno}>{textoColetas}</Text>
        <Text style={styles.numeroColetas}>{coletasNecessarias} coletas</Text>
        <Text style={styles.textoPequeno}>de aumentar o seu desconto!</Text>

        <View style={styles.barraFundo}>
          <View style={styles.barraPreenchida} />
        </View>

        <Text style={styles.dicaProgresso}>
          {textoDica}{' '}
          <Text style={styles.textoDestaque}>3 vezes</Text> para conseguir
          15% de desconto no seu IPTU.
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
  textoPequeno: {
    fontSize: rem(1),
    color: CORES.texto,
    fontFamily: 'Inter_400Regular',
  },
  numeroColetas: {
    fontSize: rem(1.25),
    lineHeight: rem(1.5),
    color: CORES.texto,
    fontFamily: 'Alexandria_700Bold',
  },
  barraFundo: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DDDDDD',
    marginTop: 7,
    marginBottom: 15,
    overflow: 'hidden',
  },
  barraPreenchida: {
    width: '70%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: CORES.verde,
  },
  dicaProgresso: {
    fontSize: rem(1),
    lineHeight: rem(1.25),
    color: CORES.textoSecundario,
    fontFamily: 'Inter_400Regular',
  },
  textoDestaque: {
    fontFamily: 'Inter_700Bold',
  },
});
