import { Pressable, StyleSheet, Text } from 'react-native';
import { CORES } from './telaInicial/tema';

export default function BotaoVoltar({ onPress, accessibilityLabel = 'Voltar' }) {
  return (
    <Pressable
      style={styles.botao}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.seta}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CORES.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seta: {
    color: CORES.branco,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'Inter_400Regular',
  },
});