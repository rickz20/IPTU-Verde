import { rem } from '../../utils/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from './tema';

export default function CartaoAcesso({
  titulo,
  descricao,
  tipo = 'local',
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

      <View style={styles.ilustracaoAcesso}>
        <Text style={styles.iconeAcesso}>{tipo === 'local' ? '●' : '♻'}</Text>
      </View>

      <View>
        <Text style={styles.tituloAcesso}>{titulo}</Text>
        <Text style={styles.descricaoAcesso}>{descricao}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartaoAcesso: {
    flex: 1,
    minHeight: 172,
    borderRadius: 17,
    padding: 13,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  setaCartao: {
    alignSelf: 'flex-end',
    fontSize: rem(1.75),
    lineHeight: rem(1.75),
    color: CORES.branco,
  },
  ilustracaoAcesso: {
    height: 42,
    justifyContent: 'center',
  },
  iconeAcesso: {
    fontSize: rem(2.375),
    color: '#FFFFFF',
    opacity: 0.24,
  },
  tituloAcesso: {
    fontSize: rem(1),
    lineHeight: rem(1.25),
    color: CORES.branco,
    fontFamily: 'Alexandria_700Bold',
  },
  descricaoAcesso: {
    fontSize: rem(1),
    lineHeight: rem(1.25),
    color: CORES.branco,
    fontFamily: 'Inter_400Regular',
  },
});
