import PontosDeColeta from './PontosDeColeta';

export default function TelaAgendamento({ onSelecionarAba, token }) {
  return (
    <PontosDeColeta
      token={token}
      onSelecionarAba={onSelecionarAba}
      onVoltar={() => onSelecionarAba?.('inicio')}
    />
  );
}
