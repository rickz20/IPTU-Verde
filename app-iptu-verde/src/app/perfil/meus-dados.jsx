
import { useRouter } from 'expo-router';
import TelaMeusDados from '../../telas/TelaMeusDados';

export default function MeusDados() {
  const router = useRouter();
  return <TelaMeusDados onVoltar={() => router.replace('/perfil')} />;
}
