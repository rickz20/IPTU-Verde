
import React from 'react';

// Importando os recursos de navegação
import { useRouter } from 'expo-router';

import TelaSegurancaPrivacidade from '../../telas/TelaSegurancaPrivacidade';

export default function SegurancaPrivacidade() {
  const router = useRouter();

  return (
    <TelaSegurancaPrivacidade
      onVoltar={() => router.replace('/perfil')}
      onAlterarSenha={() =>
        router.push('/perfil/alterar-senha?origem=seguranca-privacidade')
      }
    />
  );
}
