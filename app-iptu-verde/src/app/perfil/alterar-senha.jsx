
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

// Importando a estrutura reutilizável
import TelaEmBranco from '../../telas/TelaEmBranco';

// Criando a rota de Alterar senha
export default function AlterarSenha() {

  // Obtendo o controlador de navegação
  const router = useRouter();

  // Renderizando a tela provisória
  return (
    <TelaEmBranco
      titulo="Alterar senha"
      onVoltar={() => router.replace('/perfil')}
    />
  );
}
