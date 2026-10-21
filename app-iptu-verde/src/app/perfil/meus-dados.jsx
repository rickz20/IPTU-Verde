
import { useRouter } from 'expo-router';
import TelaMeusDados from '../../telas/TelaMeusDados';

export default function MeusDados() {
  const router = useRouter();
  return (
    <TelaMeusDados
      onVoltar={() => router.replace('/perfil')}
      onAlterarDados={() => router.push('/perfil/editar-dados')}
      onAlterarSenha={() =>
        router.push('/perfil/alterar-senha?origem=meus-dados')
      }
    />
  );
}
