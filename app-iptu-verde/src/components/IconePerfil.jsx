import Svg, { Circle, Path, Rect } from 'react-native-svg';

const ICONES = {
  usuario: (
    <>
      <Circle cx="12" cy="8" r="3.5" />
      <Path d="M5.5 20v-1.5a6.5 6.5 0 0 1 13 0V20" />
    </>
  ),
  imoveis: (
    <>
      <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <Path d="M10 21h4" />
    </>
  ),
  seguranca: (
    <>
      <Path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
      <Path d="m9 12 2 2 4-4" />
    </>
  ),
  ajuda: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M9.5 9a2.6 2.6 0 1 1 4.7 1.5c-1.1 1.3-2.2 1.4-2.2 3" />
      <Circle cx="12" cy="17" r=".7" />
    </>
  ),
  senha: (
    <>
      <Rect x="5" y="10" width="14" height="11" rx="2" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  sair: (
    <>
      <Path d="M10 5H5v14h5" />
      <Path d="M13 8l4 4-4 4M17 12H9" />
    </>
  ),
};

export default function IconePerfil({ nome, cor = '#918D83', tamanho = 22 }) {
  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityLabel={nome}
    >
      {ICONES[nome]}
    </Svg>
  );
}
