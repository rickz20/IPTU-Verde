import { Pressable, StyleSheet, Text, View } from 'react-native';
import IconePerfil from './IconePerfil';
import { CORES } from './telaInicial/tema';

export default function OpcaoPerfil({
  titulo,
  icone,
  destaque = false,
  onPress = () => {},
}) {
  const corTexto = destaque ? '#D65252' : CORES.texto;
  const corIcone = destaque ? '#D65252' : '#918D83';

  return (
    <Pressable
      style={styles.opcao}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titulo}
    >
      <IconePerfil nome={icone} cor={corIcone} />
      <Text style={[styles.titulo, { color: corTexto }]}>{titulo}</Text>
      <View style={styles.seta}>
        <Text style={styles.caractereSeta}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  opcao: {
    minHeight: 58,
    paddingHorizontal: 18,
    borderRadius: 17,
    backgroundColor: CORES.cinza,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  titulo: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  seta: {
    width: 16,
    alignItems: 'flex-end',
  },
  caractereSeta: {
    color: '#C6C4BF',
    fontSize: 28,
    lineHeight: 30,
    fontFamily: 'Inter_400Regular',
  },
});
