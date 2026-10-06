import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Alexandria_400Regular,
  Alexandria_700Bold,
} from '@expo-google-fonts/alexandria';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import Login from './src/telas/Login';

export default function App() {
  const [fontsLoaded] = useFonts({
    Alexandria_400Regular,
    Alexandria_700Bold,
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Login />
      <StatusBar style="auto" />
    </>
  );
}
