
import React from 'react';

// Importando os recursos de interface
import {
  Pressable,
  StyleSheet,
} from 'react-native';

// Importando o componente reutilizável de ícones
import Icone from './Icone';

// Criando o botão reutilizável de voltar
export default function BotaoVoltar({ onPress }) {

  // Renderizando a estrutura do botão
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      style={({ pressed }) => [
        styles.botao,
        pressed && styles.pressionado,
      ]}
    >

      {/* Renderizando a seta branca */}
      <Icone
        tipo="voltar"
        tamanho={28}
        cor="#FFFFFF"
      />

    </Pressable>
  );
}

// Definindo os estilos do botão
const styles = StyleSheet.create({

  // Criando o formato circular amarelo
  botao: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDA11F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Aplicando feedback visual ao pressionar
  pressionado: {
    opacity: 0.7,
  },

});