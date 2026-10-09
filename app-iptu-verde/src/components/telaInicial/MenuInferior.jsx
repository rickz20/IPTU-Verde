import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CORES } from './tema';

export const itensMenuPadrao = [
  { id: 'inicio', icone: '⌂', titulo: 'Início' },
  { id: 'agendamentos', icone: '▦', titulo: 'Agendamentos' },
  { id: 'perfil', icone: '♙', titulo: 'Perfil' },
];

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
          style={styles.itemMenu}
          onPress={() => onSelecionar(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.titulo}
          accessibilityState={{ selected: selecionado === item.id }}
        >
          <View
            style={[
              styles.fundoIconeMenu,
              selecionado === item.id && styles.menuSelecionado,
            ]}
          >
            <Text style={styles.iconeMenu}>{item.icone}</Text>
          </View>

          <Text style={styles.textoMenu}>{item.titulo}</Text>
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
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 5,
  },
  itemMenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  fundoIconeMenu: {
    minWidth: 48,
    height: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuSelecionado: {
    backgroundColor: '#7F9C08',
  },
  iconeMenu: {
    fontSize: 24,
    lineHeight: 27,
    color: CORES.branco,
  },
  textoMenu: {
    fontSize: 11,
    color: CORES.branco,
    fontFamily: 'Inter_400Regular',
  },
});
