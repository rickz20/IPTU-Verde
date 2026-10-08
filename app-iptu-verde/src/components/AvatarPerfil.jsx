
import React from 'react';

// Importando os componentes de interface
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

// Importando os recursos para desenhar o avatar
import Svg, {
  Circle,
  Path,
  Defs,
  ClipPath,
  G,
} from 'react-native-svg';

// Importando o componente reutilizável de ícones
import Icone from './Icone';

// Criando o componente reutilizável do avatar
export default function AvatarPerfil({ onEditar }) {

  // Renderizando a estrutura do avatar
  return (
    <View style={styles.container}>

      {/* Desenhando o avatar em formato vetorial */}
      <Svg
        width={144}
        height={144}
        viewBox="0 0 144 144"
      >

        {/* Definindo a máscara circular */}
        <Defs>
          <ClipPath id="recorteAvatarPerfil">
            <Circle cx="72" cy="72" r="72" />
          </ClipPath>
        </Defs>

        {/* Limitando os desenhos à área circular */}
        <G clipPath="url(#recorteAvatarPerfil)">

          {/* Desenhando o fundo verde */}
          <Circle
            cx="72"
            cy="72"
            r="72"
            fill="#95BA0A"
          />

          {/* Desenhando a cabeça do usuário */}
          <Circle
            cx="72"
            cy="57"
            r="18"
            fill="none"
            stroke="#6D8C09"
            strokeWidth={6}
          />

          {/* Desenhando o corpo do usuário */}
          <Path
            d="M21 126c6-27 24-36 51-36s45 9 51 36"
            fill="none"
            stroke="#6D8C09"
            strokeWidth={6}
          />

        </G>
      </Svg>

      {/* Posicionando o botão de edição */}
      <Pressable
        style={styles.botaoEditar}
        onPress={onEditar}
        disabled={!onEditar}
        accessibilityRole="button"
        accessibilityLabel="Editar foto de perfil"
      >

        {/* Renderizando o ícone de edição */}
        <Icone
          tipo="editar"
          tamanho={19}
          cor="#292929"
        />

      </Pressable>

    </View>
  );
}

// Definindo os estilos do avatar
const styles = StyleSheet.create({

  // Dimensionando o avatar
  container: {
    width: 144,
    height: 144,
    position: 'relative',
  },

  // Posicionando o botão sobre o avatar
  botaoEditar: {
    position: 'absolute',
    right: 0,
    bottom: -2,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
