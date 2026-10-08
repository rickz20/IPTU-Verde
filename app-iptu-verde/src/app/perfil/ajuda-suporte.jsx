
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

// Importando a estrutura reutilizável
import TelaEmBranco from '../../telas/TelaEmBranco';

// Criando a rota de Ajuda e suporte
export default function AjudaSuporte() {

  // Obtendo o controlador de navegação
  const router = useRouter();

  // Renderizando a tela provisória
  return (
    <TelaEmBranco
      titulo="Ajuda e suporte"
      onVoltar={() => router.replace('/perfil')}
    />
  );
}
