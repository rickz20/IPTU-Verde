
import React from 'react';

// Importando os recursos de interface
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
import AvatarPerfil from '../components/AvatarPerfil';
import OpcaoPerfil from '../components/OpcaoPerfil';

// Criando a tela principal de Perfil
export default function TelaPerfil({
  nomeUsuario = 'Fulano da Silva',
  onVoltar,
  onEditarFoto,
  onMeusDados,
  onMeusImoveis,
  onSeguranca,
  onAjuda,
  onAlterarSenha,
  onSair,
}) {

  // Organizando as opções exibidas na tela
  const opcoes = [
    {
      titulo: 'Meus dados',
      icone: 'usuario',
      onPress: onMeusDados,
    },
    {
      titulo: 'Meus imóveis',
      icone: 'imoveis',
      onPress: onMeusImoveis,
    },
    {
      titulo: 'Segurança e privacidade',
      icone: 'seguranca',
      onPress: onSeguranca,
    },
    {
      titulo: 'Ajuda e suporte',
      icone: 'ajuda',
      onPress: onAjuda,
    },
    {
      titulo: 'Alterar senha',
      icone: 'senha',
      destaque: true,
      onPress: onAlterarSenha,
    },
    {
      titulo: 'Sair',
      icone: 'sair',
      destaque: true,
      onPress: onSair,
    },
  ];

  // Renderizando a interface do Perfil
  return (
    <SafeAreaView style={styles.tela}>

      {/* Permitindo a rolagem em telas menores */}
      <ScrollView
        style={styles.rolagem}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >

        {/* Limitando a largura do conteúdo */}
        <View style={styles.largura}>

          {/* Renderizando o botão de voltar */}
          <BotaoVoltar onPress={onVoltar} />

          {/* Organizando as informações do usuário */}
          <View style={styles.perfil}>

            {/* Renderizando o avatar */}
            <AvatarPerfil onEditar={onEditarFoto} />

            {/* Exibindo o nome do usuário */}
            <Text style={styles.nomeUsuario}>
              {nomeUsuario}
            </Text>

          </View>

          {/* Organizando a lista de opções */}
          <View style={styles.listaOpcoes}>

            {/* Renderizando os cards automaticamente */}
            {opcoes.map((opcao) => (
              <OpcaoPerfil
                key={opcao.titulo}
                titulo={opcao.titulo}
                icone={opcao.icone}
                destaque={opcao.destaque}
                onPress={opcao.onPress}
              />
            ))}

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

// Definindo os estilos específicos da tela
const styles = StyleSheet.create({

  // Configurando o fundo branco
  tela: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Permitindo a rolagem vertical
  rolagem: {
    flex: 1,
  },

  // Organizando o espaçamento do conteúdo
  conteudo: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 36,
    alignItems: 'center',
  },

  // Limitando a largura em telas maiores
  largura: {
    width: '100%',
    maxWidth: 450,
    paddingHorizontal: 26,
  },

  // Centralizando o avatar e o nome
  perfil: {
    marginTop: 54,
    alignItems: 'center',
  },

  // Formatando o nome do usuário
  nomeUsuario: {
    marginTop: 20,
    fontFamily: 'Alexandria_700Bold',
    fontSize: 18,
    color: '#292929',
    textAlign: 'center',
  },

  // Organizando os cards verticalmente
  listaOpcoes: {
    marginTop: 65,
    gap: 9,
  },

});
