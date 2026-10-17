import { rem } from '../../utils/typography';
import { StyleSheet, Text } from 'react-native';
import { CORES } from '../telaInicial/tema';

export default function InformacaoPessoal({ titulo, valor }) {
  return (
    <Text style={styles.texto}>
      <Text style={styles.titulo}>{titulo}: </Text>
      {valor}
    </Text>
  );
}

const styles = StyleSheet.create({
  texto: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.5),
    fontFamily: 'Inter_400Regular',
  },
  titulo: {
    fontFamily: 'Inter_700Bold',
  },
});
