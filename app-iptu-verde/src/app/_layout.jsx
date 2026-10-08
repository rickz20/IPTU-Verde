
import React from 'react';

// Importando o sistema de navegação
import { Stack } from 'expo-router';

// Importando a barra de status do Expo
import { StatusBar } from 'expo-status-bar';

// Importando o carregador de fontes
import { useFonts } from 'expo-font';

// Importando as fontes Alexandria
import {
  Alexandria_400Regular,
  Alexandria_700Bold,
} from '@expo-google-fonts/alexandria';

// Importando as fontes Inter
import {
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Criando o layout principal da aplicação
export default function RootLayout() {

  // Carregando as fontes utilizadas nas telas
  const [fontsLoaded] = useFonts({
    Alexandria_400Regular,
    Alexandria_700Bold,
    Inter_400Regular,
    Inter_700Bold,
  });

  // Aguardando o carregamento das fontes
  if (!fontsLoaded) {
    return null;
  }

  // Renderizando o sistema de navegação
  return (
    <>
      {/* Configurando as telas em pilha */}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      {/* Configurando a barra de status */}
      <StatusBar style="auto" />
    </>
  );
}
