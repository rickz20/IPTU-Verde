
import React from 'react';

// Importando os componentes de interface
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Importando o componente reutilizável de ícones
import Icone from './Icone';

// Criando o componente reutilizável das opções
export default function OpcaoPerfil({
  titulo,
  icone,
  onPress,
  destaque = false,
}) {

  // Definindo a cor do ícone conforme o destaque
  const corIcone = destaque
    ? '#C75F60'
    : '#96938D';

  // Renderizando a estrutura do card
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressionado,
      ]}
    >

      {/* Posicionando o ícone à esquerda */}
      <View style={styles.areaIcone}>
        <Icone
          tipo={icone}
          tamanho={22}
          cor={corIcone}
        />
      </View>

      {/* Exibindo o título da opção */}
      <Text
        style={[
          styles.titulo,
          destaque && styles.tituloDestaque,
        ]}
      >
        {titulo}
      </Text>

      {/* Renderizando a seta indicativa */}
      <Icone
        tipo="seta"
        tamanho={20}
        cor="#BDBDB8"
      />

    </Pressable>
  );
}

// Definindo os estilos dos cards
const styles = StyleSheet.create({

  // Criando o card com fundo cinza
  card: {
    minHeight: 62,
    borderRadius: 17,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  // Aplicando feedback visual ao pressionar
  pressionado: {
    opacity: 0.7,
  },

  // Reservando espaço para o ícone
  areaIcone: {
    width: 40,
    alignItems: 'flex-start',
  },

  // Formatando o título da opção
  titulo: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#292929',
  },

  // Destacando as ações em vermelho
  tituloDestaque: {
    color: '#C75F60',
  },

});
