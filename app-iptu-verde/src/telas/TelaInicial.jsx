
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import Cabecalho from '../components/telaInicial/Cabecalho';
import PontosDeColeta from './PontosDeColeta';
import CartaoAcesso from '../components/telaInicial/CartaoAcesso';
import CartaoProgresso from '../components/telaInicial/CartaoProgresso';
import ItemColeta from '../components/telaInicial/ItemColeta';
import MenuInferior from '../components/telaInicial/MenuInferior';
import MeusAgendamentos from './MeusAgendamentos';
import TelaNotificacoes from './TelaNotificacoes';
import TelaPerfil from './TelaPerfil';
import TodasColetas from './TodasColetas';
import TelaMeusDados from './TelaMeusDados';
import TelaMeusImoveis from './TelaMeusImoveis';
import TelaAlterarSenha from './TelaAlterarSenha';
import { coletas } from '../components/telaInicial/dados';
import { CORES } from '../components/telaInicial/tema';

export default function TelaInicial() {
  // Controlando a aba selecionada no menu inferior
  const [abaSelecionada, setAbaSelecionada] = useState('inicio');

  // Controlando a tela exibida atualmente
  const [telaAtual, setTelaAtual] = useState('inicio');

  function selecionarAba(aba) {
    setAbaSelecionada(aba);
    if (aba === 'inicio') {
      setTelaAtual('inicio');
    } else if (aba === 'agendamentos') {
      setTelaAtual('meus-agendamentos');
    } else if (aba === 'perfil') {
      setTelaAtual('perfil');
    }
  }

  if (telaAtual === 'perfil') {
    return (
      <TelaPerfil
        onSelecionarAba={selecionarAba}
        onMeusDados={() => setTelaAtual('meus-dados')}
        onMeusImoveis={() => setTelaAtual('meus-imoveis')}
        onAlterarSenha={() => setTelaAtual('alterar-senha')}
        onSair={onSair}
      />
    );
  }

  if (telaAtual === 'meus-dados') {
    return <TelaMeusDados onVoltar={() => setTelaAtual('perfil')} />;
  }

  if (telaAtual === 'meus-imoveis') {
    return <TelaMeusImoveis onVoltar={() => setTelaAtual('perfil')} />;
  }

  if (telaAtual === 'alterar-senha') {
    return <TelaAlterarSenha onVoltar={() => setTelaAtual('perfil')} />;
  }

  if (telaAtual === 'meus-agendamentos') {
    return <MeusAgendamentos onSelecionarAba={selecionarAba} />;
  }

  if (telaAtual === 'todas-coletas') {
    return <TodasColetas onVoltar={() => setTelaAtual('inicio')} />;
  }

  if (telaAtual === 'tela-agendamento') {
    return <PontosDeColeta onVoltar={() => setTelaAtual('inicio')} />;
  }

  if (telaAtual === 'notificacoes') {
    return (
      <TelaNotificacoes onVoltar={() => setTelaAtual('inicio')} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Cabecalho onNotificacoes={() => setTelaAtual('notificacoes')} />

        <View style={styles.secaoProgresso}>
          <Text style={styles.tituloSecao}>Meu Progresso</Text>
          <Text style={styles.subtituloSecao}>
            Acompanhe a porcentagem de desconto obtido até agora
          </Text>

          <CartaoProgresso />
        </View>

        <View style={styles.secaoColetas}>
          <View style={styles.cabecalhoSecao}>
            <Text style={styles.tituloSecao}>Últimas coletas</Text>

            <Pressable
              onPress={() => setTelaAtual('todas-coletas')}
              accessibilityRole="button"
            >
              <Text style={styles.linkVerMais}>Ver mais →</Text>
            </Pressable>
          </View>

          <View style={styles.listaColetas}>
            {coletas.map((item) => (
              <ItemColeta key={item.id} item={item} onPress={() => {}} />
            ))}
          </View>
        </View>

        <View style={styles.listaAcessos}>
          <CartaoAcesso
            titulo="Pontos de coleta"
            descricao="Saiba onde estão os pontos de coleta mais próximos da sua casa"
            tipo="local"
            cor={CORES.verde}
            onPress={() => setTelaAtual('tela-agendamento')}
          />

          <CartaoAcesso
            titulo="Como reciclar"
            descricao="Como separar os seus resíduos e quais deles podem ser reciclados"
            tipo="reciclagem"
            cor={CORES.amarelo}
            onPress={() => {}}
          />
        </View>
      </ScrollView>

      <MenuInferior selecionado={abaSelecionada} onSelecionar={selecionarAba} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  scroll: {
    flex: 1,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  secaoProgresso: {
    marginBottom: 24,
  },
  tituloSecao: {
    fontSize: 21,
    color: CORES.texto,
    fontFamily: 'Alexandria_700Bold',
  },
  subtituloSecao: {
    fontSize: 11,
    color: CORES.texto,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  secaoColetas: {
    marginBottom: 30,
  },
  cabecalhoSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkVerMais: {
    fontSize: 10,
    color: CORES.verdeEscuro,
    fontFamily: 'Inter_700Bold',
  },
  listaColetas: {
    gap: 4,
  },
  listaAcessos: {
    flexDirection: 'row',
    gap: 10,
  },
});
