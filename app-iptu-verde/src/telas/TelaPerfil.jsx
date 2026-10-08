import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AvatarPerfil from '../components/AvatarPerfil';
import OpcaoPerfil from '../components/OpcaoPerfil';
import MenuInferior from '../components/telaInicial/MenuInferior';
import { CORES } from '../components/telaInicial/tema';

const OPCOES_PERFIL = [
  { id: 'meus-dados', titulo: 'Meus dados', icone: 'usuario' },
  { id: 'meus-imoveis', titulo: 'Meus imóveis', icone: 'imoveis' },
  {
    id: 'seguranca-privacidade',
    titulo: 'Segurança e privacidade',
    icone: 'seguranca',
  },
  { id: 'ajuda-suporte', titulo: 'Ajuda e suporte', icone: 'ajuda' },
  { id: 'alterar-senha', titulo: 'Alterar senha', icone: 'senha', destaque: true },
  { id: 'sair', titulo: 'Sair', icone: 'sair', destaque: true },
];

export default function TelaPerfil({ onSelecionarAba }) {
  const [abaSelecionada, setAbaSelecionada] = useState('perfil');

  function selecionarAba(aba) {
    setAbaSelecionada(aba);
    onSelecionarAba?.(aba);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CORES.branco} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.perfil}>
          <AvatarPerfil />
          <Text style={styles.nome}>Fulano da Silva</Text>
        </View>

        <View style={styles.opcoes}>
          {OPCOES_PERFIL.map((opcao) => (
            <OpcaoPerfil
              key={opcao.id}
              titulo={opcao.titulo}
              icone={opcao.icone}
              destaque={opcao.destaque}
            />
          ))}
        </View>
      </ScrollView>

      <MenuInferior
        selecionado={abaSelecionada}
        onSelecionar={selecionarAba}
      />
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
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
  },
  perfil: {
    alignItems: 'center',
    marginTop: 96,
    marginBottom: 64,
  },
  nome: {
    marginTop: 16,
    color: CORES.texto,
    fontSize: 16,
    fontFamily: 'Alexandria_700Bold',
  },
  opcoes: {
    gap: 8,
  },
});
