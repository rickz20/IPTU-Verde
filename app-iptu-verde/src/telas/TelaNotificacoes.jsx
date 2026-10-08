
import React from 'react';

// Importando os componentes de interface
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Importando o componente de área segura
import { SafeAreaView } from 'react-native-safe-area-context';

// Importando os componentes reutilizáveis
import BotaoVoltar from '../components/BotaoVoltar';
import CardNotificacao from '../components/notificacoes/CardNotificacao';

// Importando os dados provisórios das notificações
import { notificacoes } from '../components/notificacoes/dadosNotificacoes';

// Importando as cores padronizadas do projeto
import { CORES } from '../components/telaInicial/tema';

// Criando a tela principal de notificações
export default function TelaNotificacoes({ onVoltar }) {

  // Renderizando a estrutura da tela
  return (
    <SafeAreaView style={styles.tela}>

      {/* Permitindo a rolagem em dispositivos menores */}
      <ScrollView
        style={styles.rolagem}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >

        {/* Limitando a largura do conteúdo */}
        <View style={styles.largura}>

          {/* Organizando o cabeçalho da tela */}
          <View style={styles.cabecalho}>

            {/* Renderizando o botão reutilizável de voltar */}
            <BotaoVoltar onPress={onVoltar} />

            {/* Organizando o título e o subtítulo */}
            <View style={styles.textosCabecalho}>

              {/* Exibindo o título principal */}
              <Text style={styles.titulo}>
                Todas as notificações
              </Text>

              {/* Exibindo o subtítulo informativo */}
              <Text style={styles.subtitulo}>
                Acompanhe por aqui as notícias e avisos
              </Text>

            </View>

          </View>

          {/* Organizando a lista de notificações */}
          <View style={styles.lista}>

            {/* Renderizando os cards automaticamente */}
            {notificacoes.map((notificacao) => (
              <CardNotificacao
                key={notificacao.id}
                titulo={notificacao.titulo}
                descricao={notificacao.descricao}
                data={notificacao.data}
                horario={notificacao.horario}
              />
            ))}

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

// Definindo os estilos visuais da tela
const styles = StyleSheet.create({

  // Configurando o fundo branco
  tela: {
    flex: 1,
    backgroundColor: CORES.branco,
  },

  // Permitindo a rolagem vertical
  rolagem: {
    flex: 1,
  },

  // Organizando os espaçamentos principais
  conteudo: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },

  // Limitando a largura da interface
  largura: {
    width: '100%',
    maxWidth: 450,
    paddingHorizontal: 18,
  },

  // Posicionando o botão e os textos lado a lado
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },

  // Organizando o título e o subtítulo
  textosCabecalho: {
    flex: 1,
  },

  // Formatando o título principal
  titulo: {
    fontFamily: 'Alexandria_700Bold',
    fontSize: 18,
    color: CORES.texto,
  },

  // Formatando o subtítulo
  subtitulo: {
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: CORES.texto,
  },

  // Distribuindo os cards verticalmente
  lista: {
    gap: 8,
  },

});
