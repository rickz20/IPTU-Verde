
import React from 'react';

// Importando os componentes de interface
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Importando o componente de área segura
import { SafeAreaView } from 'react-native-safe-area-context';

// Importando o botão reutilizável de voltar
import BotaoVoltar from '../components/BotaoVoltar';

// Criando a estrutura das telas provisórias
export default function TelaEmBranco({
  titulo,
  onVoltar,
}) {

  // Renderizando a tela com o título recebido
  return (
    <SafeAreaView style={styles.tela}>

      {/* Organizando o conteúdo da tela */}
      <View style={styles.conteudo}>

        {/* Renderizando o botão de voltar */}
        <BotaoVoltar onPress={onVoltar} />

        {/* Centralizando as informações provisórias */}
        <View style={styles.areaCentral}>

          {/* Exibindo o nome da tela */}
          <Text style={styles.titulo}>
            {titulo}
          </Text>

          {/* Informando o estado de desenvolvimento */}
          <Text style={styles.descricao}>
            Tela em desenvolvimento
          </Text>

        </View>

      </View>

    </SafeAreaView>
  );
}

// Definindo os estilos das telas provisórias
const styles = StyleSheet.create({

  // Configurando o fundo branco
  tela: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Organizando os elementos da tela
  conteudo: {
    flex: 1,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    paddingHorizontal: 26,
    paddingTop: 8,
  },

  // Centralizando o conteúdo provisório
  areaCentral: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },

  // Formatando o título
  titulo: {
    fontFamily: 'Alexandria_700Bold',
    fontSize: 22,
    color: '#292929',
    textAlign: 'center',
  },

  // Formatando a mensagem provisória
  descricao: {
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#96938D',
    textAlign: 'center',
  },

});
