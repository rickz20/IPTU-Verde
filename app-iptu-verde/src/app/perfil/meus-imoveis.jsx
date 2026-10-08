
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

// Importando a tela de dados do imóvel
import TelaMeusImoveis from '../../telas/TelaMeusImoveis';

// Criando a rota de Meus imóveis
export default function MeusImoveis() {

  // Obtendo o controlador de navegação
  const router = useRouter();

  // Renderizando os dados do imóvel
  return (
    <TelaMeusImoveis
      onVoltar={() => router.replace('/perfil')}
    />
  );
}
