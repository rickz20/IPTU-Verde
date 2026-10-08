
import React from 'react';

// Importando a biblioteca de ícones do Expo
import { SymbolView } from 'expo-symbols';

// Definindo os ícones utilizados no aplicativo
const ICONES = {
  voltar: {
    ios: 'arrow.left',
    android: 'arrow_back',
    web: 'arrow_back',
  },

  usuario: {
    ios: 'person',
    android: 'person',
    web: 'person',
  },

  imoveis: {
    ios: 'bell',
    android: 'notifications',
    web: 'notifications',
  },

  seguranca: {
    ios: 'checkmark.shield',
    android: 'verified_user',
    web: 'verified_user',
  },

  ajuda: {
    ios: 'questionmark.circle',
    android: 'help',
    web: 'help',
  },

  senha: {
    ios: 'lock',
    android: 'lock',
    web: 'lock',
  },

  sair: {
    ios: 'rectangle.portrait.and.arrow.right',
    android: 'logout',
    web: 'logout',
  },

  seta: {
    ios: 'chevron.right',
    android: 'chevron_right',
    web: 'chevron_right',
  },

  editar: {
    ios: 'pencil',
    android: 'edit',
    web: 'edit',
  },

mensagem: {
  ios: 'bubble.left',
  android: 'chat_bubble',
  web: 'chat_bubble',
},

};

// Criando o componente reutilizável de ícones
export default function Icone({
  tipo,
  tamanho = 24,
  cor = '#96938D',
}) {

  // Identificando o ícone solicitado
  const nome = ICONES[tipo];

  // Evitando a renderização de ícones inexistentes
  if (!nome) return null;

  // Renderizando o ícone com tamanho e cor personalizados
  return (
    <SymbolView
      name={nome}
      size={tamanho}
      tintColor={cor}
    />
  );
}
