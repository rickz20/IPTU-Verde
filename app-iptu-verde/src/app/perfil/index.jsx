
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

// Importando a interface da tela de Perfil
import TelaPerfil from '../../telas/TelaPerfil';

// Criando a rota principal de Perfil
export default function RotaPerfil() {

  // Obtendo o controlador de navegação
  const router = useRouter();

  // Definindo a ação do botão de voltar
  const voltar = () => router.replace('/');

  // Definindo a navegação para Meus dados
  const abrirDados = () =>
    router.push('/perfil/meus-dados');

  // Definindo a navegação para Meus imóveis
  const abrirImoveis = () =>
    router.push('/perfil/meus-imoveis');

  // Definindo a navegação para Ajuda e suporte
  const abrirAjuda = () =>
    router.push('/perfil/ajuda-suporte');

  // Renderizando o Perfil com as ações conectadas
  return (
    <TelaPerfil
      onVoltar={voltar}
      onMeusDados={abrirDados}
      onMeusImoveis={abrirImoveis}
      onMeusAgendamentos={() => router.replace('/')}
      onAjuda={abrirAjuda}
      onSair={() => router.replace('/')}
    />
  );
}
