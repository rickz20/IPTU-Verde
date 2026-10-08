import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from './tema';

const LOGO_IPTU_VERDE = require('../../../assets/logo-iptu-verde.png');

export default function Cabecalho({ onNotificacoes = () => {} }) {
  return (
    <View style={styles.cabecalho}>
      <View style={styles.marca}>
        <Image
          source={LOGO_IPTU_VERDE}
          style={styles.logoImagem}
          resizeMode="contain"
          accessibilityLabel="Logo IPTU Verde"
        />
      </View>

      <Pressable
        style={styles.botaoNotificacao}
        onPress={onNotificacoes}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
      >
        <Text style={styles.iconeNotificacao}>♧</Text>
        <Text style={styles.sino}>♟</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    minHeight: 84,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  marca: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImagem: {
    width: 180,
    height: 82,
  },
  botaoNotificacao: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: CORES.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeNotificacao: {
    display: 'none',
  },
  sino: {
    color: CORES.branco,
    fontSize: 24,
  },
});
