import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from './tema';

export default function ItemColeta({ item, onPress = () => {} }) {
  return (
    <Pressable
      style={styles.itemColeta}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Coleta de ${item.nome}, ${item.data}`}
    >
      <View style={styles.avatarColeta}>
        <Text style={styles.iconeUsuario}>♙</Text>
      </View>

      <View style={styles.dadosColeta}>
        <Text style={styles.nomeColeta}>{item.nome}</Text>

        <View style={styles.linhaEndereco}>
          <Text style={styles.iconeLocalizacao}>●</Text>
          <Text style={styles.enderecoColeta}>Endereço do ponto</Text>
        </View>
      </View>

      <View style={styles.dataColeta}>
        <Text style={styles.textoData}>{item.data}</Text>
        <Text style={styles.textoData}>{item.horario}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemColeta: {
    minHeight: 60,
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: CORES.cinza,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarColeta: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: CORES.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeUsuario: {
    fontSize: 23,
    color: CORES.branco,
  },
  dadosColeta: {
    flex: 1,
  },
  nomeColeta: {
    fontSize: 12,
    color: CORES.texto,
    fontFamily: 'Inter_700Bold',
  },
  linhaEndereco: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  iconeLocalizacao: {
    fontSize: 10,
    color: CORES.verdeEscuro,
  },
  enderecoColeta: {
    fontSize: 10,
    color: CORES.textoSecundario,
    fontFamily: 'Inter_400Regular',
  },
  dataColeta: {
    alignItems: 'flex-end',
  },
  textoData: {
    fontSize: 10,
    lineHeight: 14,
    color: CORES.textoSecundario,
    fontFamily: 'Inter_400Regular',
  },
});
