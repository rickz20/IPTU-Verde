
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

  // Definindo a navegação para Segurança e privacidade
  const abrirSeguranca = () =>
    router.push('/perfil/seguranca-privacidade');

  // Definindo a navegação para Ajuda e suporte
  const abrirAjuda = () =>
    router.push('/perfil/ajuda-suporte');

  // Definindo a navegação para Alterar senha
  const abrirSenha = () =>
    router.push('/perfil/alterar-senha');

  // Definindo a navegação provisória para Sair
  const abrirSair = () =>
    router.push('/perfil/sair');

  // Renderizando o Perfil com as ações conectadas
  return (
    <TelaPerfil
      onVoltar={voltar}
      onMeusDados={abrirDados}
      onMeusImoveis={abrirImoveis}
      onSeguranca={abrirSeguranca}
      onAjuda={abrirAjuda}
      onAlterarSenha={abrirSenha}
      onSair={abrirSair}
    />
  );
}
