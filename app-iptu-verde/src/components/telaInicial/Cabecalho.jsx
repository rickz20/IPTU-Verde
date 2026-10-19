import { rem } from '../../utils/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import IconeNotificacao from '../../../assets/Bell.svg';
import LogoIptuVerde from '../../../assets/logo iptuverde.svg';
import { CORES } from './tema';

export default function Cabecalho({
  onNotificacoes = () => {},
  quantidadeNotificacoes = 0,
}) {
  return (
    <View style={styles.cabecalho}>
      <View style={styles.marca}>
        <LogoIptuVerde
          style={styles.logoImagem}
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
        <IconeNotificacao width={24} height={24} />
        {quantidadeNotificacoes > 0 ? (
          <View style={styles.badgeNotificacao}>
            <Text style={styles.badgeTexto}>
              {quantidadeNotificacoes > 99 ? '99+' : quantidadeNotificacoes}
            </Text>
          </View>
        ) : null}
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
    height: 50,
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
    fontSize: rem(1),
    fontFamily: 'Inter_700Bold',
    lineHeight: rem(1.25),
  },
});
