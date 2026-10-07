import { StyleSheet, Text, View } from 'react-native';

export default function TelaInicial() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>tela inicial</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#222222',
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
  },
});
