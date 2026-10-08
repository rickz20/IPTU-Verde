
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

// Importando a estrutura reutilizável
import TelaEmBranco from '../../telas/TelaEmBranco';

// Criando a rota provisória de Sair
export default function Sair() {

  // Obtendo o controlador de navegação
  const router = useRouter();

  // Renderizando a tela provisória
  return (
    <TelaEmBranco
      titulo="Sair"
      onVoltar={() => router.replace('/perfil')}
    />
  );
}
