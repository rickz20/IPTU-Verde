
import { useRouter } from 'expo-router';
import TelaAlterarSenha from '../../telas/TelaAlterarSenha';

export default function AlterarSenha() {
  const router = useRouter();
  return <TelaAlterarSenha onVoltar={() => router.replace('/perfil')} />;
}
