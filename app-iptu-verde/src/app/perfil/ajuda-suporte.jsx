
import { useRouter } from 'expo-router';
import TelaAjudaSuporte from '../../telas/TelaAjudaSuporte';

export default function AjudaSuporte() {
  const router = useRouter();
  return (
    <TelaAjudaSuporte onVoltar={() => router.replace('/perfil')} />
  );
}
