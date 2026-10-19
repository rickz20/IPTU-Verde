
import { useLocalSearchParams, useRouter } from 'expo-router';
import TelaAlterarSenha from '../../telas/TelaAlterarSenha';

export default function AlterarSenha() {
  const router = useRouter();
  const { origem } = useLocalSearchParams();
  const rotaAnterior =
    origem === 'seguranca-privacidade'
      ? '/perfil/seguranca-privacidade'
      : '/perfil';

  return <TelaAlterarSenha onVoltar={() => router.replace(rotaAnterior)} />;
}
