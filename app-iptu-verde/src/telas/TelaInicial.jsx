import { rem } from '../utils/typography';

import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Cabecalho from '../components/telaInicial/Cabecalho';
import PontosDeColeta from './PontosDeColeta';
import CartaoAcesso from '../components/telaInicial/CartaoAcesso';
import CartaoProgresso from '../components/telaInicial/CartaoProgresso';
import ItemColeta from '../components/telaInicial/ItemColeta';
import MenuInferior from '../components/telaInicial/MenuInferior';
import MeusAgendamentos from './MeusAgendamentos';
import TelaNotificacoes from './TelaNotificacoes';
import TelaPerfil from './TelaPerfil';
import TelaEmBranco from './TelaEmBranco';
import TodasColetas from './TodasColetas';
import TelaMeusDados from './TelaMeusDados';
import TelaMeusImoveis from './TelaMeusImoveis';
import TelaAlterarSenha from './TelaAlterarSenha';
import TelaComoReciclar from './TelaComoReciclar';
import TelaSegurancaPrivacidade from './TelaSegurancaPrivacidade';
import EstadoApi from '../components/EstadoApi';
import { useApiData } from '../hooks/useApiData';
import { CORES } from '../components/telaInicial/tema';

export default function TelaInicial({ onSair, sessao }) {
  // Controlando a aba selecionada no menu inferior
  const [abaSelecionada, setAbaSelecionada] = useState('inicio');

  // Controlando a tela exibida atualmente
  const [telaAtual, setTelaAtual] = useState('inicio');
  const {
    data: coletas,
    error: erroColetas,
    loading: carregandoColetas,
    retry: recarregarColetas,
  } = useApiData('/coletas', 'coletas', sessao?.token, Boolean(sessao?.token));

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
        onSeguranca={() => setTelaAtual('seguranca-privacidade')}
        onAjuda={() => setTelaAtual('ajuda-suporte')}
        onAlterarSenha={() => setTelaAtual('alterar-senha')}
        sessao={sessao}
        token={sessao?.token}
        onSair={onSair}
      />
    );
  }

  if (telaAtual === 'meus-dados') {
    return (
      <TelaMeusDados
        token={sessao?.token}
        onVoltar={() => setTelaAtual('perfil')}
      />
    );
  }

  if (telaAtual === 'meus-imoveis') {
    return (
      <TelaMeusImoveis
        token={sessao?.token}
        onVoltar={() => setTelaAtual('perfil')}
      />
    );
  }

  if (telaAtual === 'alterar-senha') {
    return (
      <TelaAlterarSenha
        token={sessao?.token}
        onVoltar={() => setTelaAtual('perfil')}
      />
    );
  }

  if (telaAtual === 'alterar-senha-seguranca') {
    return (
      <TelaAlterarSenha
        token={sessao?.token}
        onVoltar={() => setTelaAtual('seguranca-privacidade')}
      />
    );
  }

  if (telaAtual === 'seguranca-privacidade') {
    return (
      <TelaSegurancaPrivacidade
        onVoltar={() => setTelaAtual('perfil')}
        onAlterarSenha={() => setTelaAtual('alterar-senha-seguranca')}
        email={sessao?.usuario?.email}
      />
    );
  }

  if (telaAtual === 'ajuda-suporte') {
    return (
      <TelaEmBranco
        titulo="Ajuda e suporte"
        onVoltar={() => setTelaAtual('perfil')}
      />
    );
  }

  if (telaAtual === 'meus-agendamentos') {
    return (
      <MeusAgendamentos
        token={sessao?.token}
        onSelecionarAba={selecionarAba}
      />
    );
  }

  if (telaAtual === 'todas-coletas') {
    return (
      <TodasColetas
        token={sessao?.token}
        onVoltar={() => setTelaAtual('inicio')}
      />
    );
  }

  if (telaAtual === 'tela-agendamento') {
    return (
      <PontosDeColeta
        token={sessao?.token}
        onVoltar={() => setTelaAtual('inicio')}
      />
    );
  }

  if (telaAtual === 'notificacoes') {
    return (
      <TelaNotificacoes
        onVoltar={() => setTelaAtual('inicio')}
      />
    );
  }

  if (telaAtual === 'como-reciclar') {
    return <TelaComoReciclar onVoltar={() => setTelaAtual('inicio')} />;
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
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
            <EstadoApi
              loading={carregandoColetas}
              error={erroColetas}
              empty={!carregandoColetas && !erroColetas && coletas.length === 0}
              onRetry={recarregarColetas}
              emptyMessage="Ainda não há coletas registradas."
            />
            {!carregandoColetas && !erroColetas
              ? coletas.slice(0, 3).map((coleta) => (
                  <ItemColeta
                    key={coleta.id}
                    item={{
                      nome:
                        coleta.responsavel ??
                        coleta.entregador ??
                        coleta.material ??
                        'Coleta realizada',
                      data: formatarDataColeta(coleta.data),
                      horario: coleta.horario ?? '',
                    }}
                  />
                ))
              : null}
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
            onPress={() => setTelaAtual('como-reciclar')}
          />
        </View>
      </ScrollView>

      <MenuInferior selecionado={abaSelecionada} onSelecionar={selecionarAba} />
    </SafeAreaView>
  );
}

function formatarDataColeta(data) {
  if (typeof data !== 'string') {
    return '';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return data;
  }
  const [, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
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
    fontSize: rem(1.375),
    color: CORES.texto,
    fontFamily: 'Alexandria_700Bold',
  },
  subtituloSecao: {
    fontSize: rem(1),
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
    fontSize: rem(1),
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
