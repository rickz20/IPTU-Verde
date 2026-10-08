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
        style={({ pressed }) => [
          styles.botaoNotificacao,
          pressed && styles.botaoNotificacaoPressionado,
        ]}
        onPress={onNotificacoes}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        hitSlop={10}
      >
        <Text style={styles.sino}>🔔</Text>
        <View style={styles.badgeNotificacao}>
          <Text style={styles.badgeTexto}>3</Text>
        </View>
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
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    position: 'relative',
  },
  botaoNotificacaoPressionado: {
    backgroundColor: '#E5B832',
    transform: [{ scale: 0.97 }],
  },
  sino: {
    color: CORES.branco,
    fontSize: 20,
    lineHeight: 20,
  },
  badgeNotificacao: {
    position: 'absolute',
    top: -4,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D63B3B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: CORES.branco,
  },
  badgeTexto: {
    color: CORES.branco,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    lineHeight: 10,
  },
});
