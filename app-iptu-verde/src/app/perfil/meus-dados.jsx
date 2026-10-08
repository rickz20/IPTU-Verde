
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

// Importando a estrutura reutilizável
import TelaEmBranco from '../../telas/TelaEmBranco';

// Criando a rota de Meus dados
export default function MeusDados() {

  // Obtendo o controlador de navegação
  const router = useRouter();

  // Renderizando a tela provisória
  return (
    <TelaEmBranco
      titulo="Meus dados"
      onVoltar={() => router.replace('/perfil')}
    />
  );
}
