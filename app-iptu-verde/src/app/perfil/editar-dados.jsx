import { useRouter } from 'expo-router';
import TelaEditarDados from '../../telas/TelaEditarDados';

export default function EditarDados() {
  const router = useRouter();
  return <TelaEditarDados onVoltar={() => router.replace('/perfil/meus-dados')} />;
}
