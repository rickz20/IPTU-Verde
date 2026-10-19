import { rem } from '../utils/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from './telaInicial/tema';

export default function EstadoApi({
  loading,
  error,
  empty,
  onRetry,
  emptyMessage = 'Ainda não há informações para exibir.',
}) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.erro}>{error}</Text>
        {onRetry ? (
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            style={styles.botao}
          >
            <Text style={styles.textoBotao}>Tentar novamente</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>{emptyMessage}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 12,
  },
  texto: {
    color: CORES.textoSecundario,
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  erro: {
    color: '#9E252C',
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  botao: {
    minHeight: 42,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: CORES.verde,
  },
  textoBotao: {
    color: CORES.branco,
    fontSize: rem(0.875),
    fontFamily: 'Inter_700Bold',
  },
});
