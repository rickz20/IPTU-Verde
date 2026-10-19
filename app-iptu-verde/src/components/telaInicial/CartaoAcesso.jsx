import { rem } from '../../utils/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from './tema';

export default function CartaoAcesso({
  titulo,
  descricao,
  cor = CORES.verde,
  onPress = () => {},
}) {
  return (
    <Pressable
      style={[styles.cartaoAcesso, { backgroundColor: cor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titulo}
    >
      <Text style={styles.setaCartao}>›</Text>
      <View style={styles.textosCartao}>
        <Text style={styles.tituloAcesso}>{titulo}</Text>
        <Text style={styles.descricaoAcesso}>{descricao}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartaoAcesso: {
    flex: 1,
    minHeight: 132,
    borderRadius: 17,
    padding: 14,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  textosCartao: {
    gap: 3,
  },
  setaCartao: {
    alignSelf: 'flex-end',
    fontSize: rem(1.625),
    lineHeight: rem(1.5),
    color: CORES.branco,
  },
  tituloAcesso: {
    fontSize: rem(1.125),
    lineHeight: rem(1.375),
    color: CORES.branco,
    fontFamily: 'Alexandria_700Bold',
  },
  descricaoAcesso: {
    fontSize: rem(0.75),
    lineHeight: rem(1.25),
    color: CORES.branco,
    fontFamily: 'Inter_400Regular',
  },
});
