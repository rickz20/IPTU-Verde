
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

// Importando a tela de notificações
import TelaNotificacoes from '../telas/TelaNotificacoes';

// Criando a rota de notificações
export default function RotaNotificacoes() {

  // Obtendo o controlador de navegação
  const router = useRouter();

  // Definindo a ação de voltar
  const voltar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // Renderizando a tela de notificações
  return <TelaNotificacoes onVoltar={voltar} />;
}
