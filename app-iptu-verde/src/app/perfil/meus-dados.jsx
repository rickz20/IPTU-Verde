
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

// Importando a tela de dados pessoais
import TelaMeusDados from '../../telas/TelaMeusDados';

// Criando a rota de Meus dados
export default function MeusDados() {

  // Obtendo o controlador de navegação
  const router = useRouter();

  // Renderizando os dados pessoais
  return (
    <TelaMeusDados
      onVoltar={() => router.replace('/perfil')}
    />
  );
}
