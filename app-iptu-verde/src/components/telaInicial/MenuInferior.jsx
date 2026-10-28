import { rem } from '../../utils/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconeInicio from '../../../assets/Home.svg';
import IconePerfil from '../../../assets/User.svg';
import { CORES } from './tema';

export const itensMenuPadrao = [
  { id: 'inicio', icone: IconeInicio, titulo: 'Início' },
  { id: 'agendamentos', titulo: 'Agendar', central: true },
  { id: 'perfil', icone: IconePerfil, titulo: 'Perfil' },
];

function IconeCalendario() {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"
        stroke={CORES.branco}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function MenuInferior({
  selecionado = 'inicio',
  onSelecionar = () => {},
  itens = itensMenuPadrao,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.menuInferior,
        { paddingBottom: Math.max(8, insets.bottom) },
      ]}
    >
      {itens.map((item) => (
        <Pressable
          key={item.id}
          style={[styles.itemMenu, item.central && styles.itemMenuCentral]}
          onPress={() => onSelecionar(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.titulo}
          accessibilityState={{ selected: selecionado === item.id }}
        >
          {item.central ? (
            <View style={styles.contornoCentral}>
              <View style={styles.botaoCentral}>
                <IconeCalendario />
                <Text style={styles.textoCentral}>{item.titulo}</Text>
              </View>
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.fundoIconeMenu,
                  selecionado === item.id && styles.menuSelecionado,
                ]}
              >
                <View style={styles.iconeMenu}>
                  <item.icone width={24} height={24} />
                </View>
              </View>
              <Text style={styles.textoMenu}>{item.titulo}</Text>
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menuInferior: {
    minHeight: 66,
    backgroundColor: CORES.verde,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingTop: 5,
    overflow: 'visible',
  },
  itemMenu: {
    flex: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  itemMenuCentral: {
    zIndex: 1,
    marginTop: -28,
  },
  fundoIconeMenu: {
    minWidth: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuSelecionado: {
    backgroundColor: '#7F9C08',
  },
  contornoCentral: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: CORES.branco,
    backgroundColor: CORES.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoCentral: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
    backgroundColor: CORES.verde,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  textoCentral: {
    color: CORES.branco,
    fontSize: rem(1),
    fontFamily: 'Inter_400Regular',
  },
  iconeMenu: {
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoMenu: {
    fontSize: rem(1.125),
    color: CORES.branco,
    fontFamily: 'Inter_400Regular',
  },
});
