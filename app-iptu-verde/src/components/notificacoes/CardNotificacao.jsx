
import React from 'react';

// Importando os componentes de interface
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Importando o componente reutilizável de ícones
import Icone from '../Icone';

// Importando as cores padronizadas do projeto
import { CORES } from '../telaInicial/tema';

// Criando o componente reutilizável de notificação
export default function CardNotificacao({
  titulo,
  descricao,
  data,
  horario,
}) {

  // Renderizando as informações da notificação
  return (
    <View style={styles.card}>

      {/* Organizando os elementos horizontalmente */}
      <View style={styles.linha}>

        {/* Criando o círculo amarelo do ícone */}
        <View style={styles.fundoIcone}>

          {/* Renderizando o ícone de mensagem */}
          <Icone
            tipo="mensagem"
            tamanho={22}
            cor={CORES.branco}
          />

        </View>

        {/* Organizando as informações textuais */}
        <View style={styles.conteudo}>

          {/* Posicionando o título e a data */}
          <View style={styles.cabecalho}>

            {/* Exibindo o título da notificação */}
            <Text style={styles.titulo}>
              {titulo}
            </Text>

            {/* Organizando a data e o horário */}
            <View style={styles.dataHora}>

              {/* Exibindo a data */}
              <Text style={styles.textoData}>
                {data}
              </Text>

              {/* Exibindo o horário */}
              <Text style={styles.textoData}>
                {horario}
              </Text>

            </View>

          </View>

          {/* Exibindo a descrição da notificação */}
          <Text style={styles.descricao}>
            {descricao}
          </Text>

        </View>

      </View>

    </View>
  );
}

// Definindo os estilos do card
const styles = StyleSheet.create({

  // Criando o fundo cinza com bordas arredondadas
  card: {
    backgroundColor: CORES.cinza,
    borderRadius: 16,
    minHeight: 118,
    paddingHorizontal: 14,
    paddingVertical: 15,
  },

  // Organizando os elementos lado a lado
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  // Criando o círculo amarelo
  fundoIcone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CORES.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Reservando espaço para os textos
  conteudo: {
    flex: 1,
    minWidth: 0,
  },

  // Alinhando o título e a data
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },

  // Formatando o título em negrito
  titulo: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 19,
    color: CORES.texto,
  },

  // Posicionando a data e o horário à direita
  dataHora: {
    width: 43,
    alignItems: 'flex-end',
  },

  // Formatando a data e o horário
  textoData: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    lineHeight: 14,
    color: CORES.textoSecundario,
    textAlign: 'right',
  },

  // Formatando a descrição da notificação
  descricao: {
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
    color: CORES.texto,
  },

});
