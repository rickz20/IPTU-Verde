
import { useRouter } from 'expo-router';
import TelaMeusImoveis from '../../telas/TelaMeusImoveis';

export default function MeusImoveis() {
  const router = useRouter();
  return <TelaMeusImoveis onVoltar={() => router.replace('/perfil')} />;
}
