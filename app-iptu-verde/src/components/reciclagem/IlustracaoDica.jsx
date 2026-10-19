import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { CORES } from '../telaInicial/tema';

const CORES_LIXEIRAS = {
  azul: '#2585C4',
  vermelha: '#D94B45',
  verde: '#66A943',
  amarela: '#E8B92E',
  marrom: '#8A6043',
  cinza: '#8B9095',
};

function Lixeira({ cor }) {
  return (
    <>
      <Rect x="115" y="76" width="130" height="18" rx="8" fill={cor} />
      <Path d="M126 99h108l-10 102h-88z" fill={cor} />
      <Path
        d="M144 113v70m28-70v70m28-70v70"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <Path
        d="m161 136 18-11 18 11m-36 0 18 11 18-11"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  );
}

function Garrafa({ x = 120, y = 78, cor = '#B9E3EC' }) {
  return (
    <>
      <Path
        d={`M${x + 12} ${y + 18}h36l-4 15 10 12v66q0 10-10 10h-28q-10 0-10-10V45l10-12z`}
        fill={cor}
        stroke="#4A9BB1"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <Rect x={x + 18} y={y + 8} width="24" height="12" rx="3" fill="#4A9BB1" />
    </>
  );
}

function Laptop() {
  return (
    <>
      <Rect x="65" y="78" width="148" height="104" rx="10" fill="#455A64" />
      <Rect x="74" y="87" width="130" height="84" rx="4" fill="#BDE8E8" />
      <Path d="m49 189 180 0-17 16H66z" fill="#78909C" />
      <Path
        d="m111 131 18 18 42-45"
        fill="none"
        stroke={CORES.verdeEscuro}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

export default function IlustracaoDica({ tipo }) {
  const corLixeira = tipo.startsWith('lixeira-')
    ? CORES_LIXEIRAS[tipo.replace('lixeira-', '')]
    : CORES.verde;

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 260"
      preserveAspectRatio="xMidYMid meet"
      accessibilityLabel={`Ilustração: ${tipo.replaceAll('-', ' ')}`}
    >
      <Circle cx="180" cy="132" r="105" fill="#F5F8E9" />

      {tipo.startsWith('lixeira-') ? <Lixeira cor={corLixeira} /> : null}

      {tipo === 'separacao' ? (
        <>
          <Rect x="65" y="98" width="96" height="18" rx="7" fill="#2585C4" />
          <Path d="M73 120h80l-8 78H81z" fill="#2585C4" />
          <Rect x="199" y="98" width="96" height="18" rx="7" fill="#8A6043" />
          <Path d="M207 120h80l-8 78h-64z" fill="#8A6043" />
          <Path
            d="m103 145 15-9 15 9m-30 0 15 9 15-9"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <Path d="M229 153q10-22 20 0l-10 13z" fill="#91B83D" />
        </>
      ) : null}

      {tipo === 'enxague' || tipo === 'secar' ? (
        <>
          <Garrafa x={90} y={70} />
          <Path
            d="M236 85c-18 25-20 35-20 44a20 20 0 0 0 40 0c0-9-2-19-20-44z"
            fill="#6CC4DB"
          />
          <Path
            d="M227 130q2 9 10 10"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {tipo === 'secar' ? (
            <Path d="M94 211h172" stroke="#E5B93A" strokeWidth="7" strokeLinecap="round" />
          ) : null}
        </>
      ) : null}

      {tipo === 'compactar' ? (
        <>
          <Garrafa x={75} y={80} cor="#D7EEF4" />
          <Rect x="214" y="117" width="52" height="72" rx="10" fill="#E8C75C" stroke="#C59B2B" strokeWidth="5" />
          <Path
            d="m101 77 17-17 18 17m-18-17v25m99-8 12-17 13 17m-13-17v24"
            fill="none"
            stroke={CORES.verdeEscuro}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}

      {tipo === 'vidro' ? (
        <>
          <Rect x="100" y="130" width="160" height="74" rx="8" fill="#C99A62" />
          <Path d="M102 151h156" stroke="#A97840" strokeWidth="5" />
          <Path d="m127 113 20-34 17 39-19 16z" fill="#74BFA1" />
          <Path d="m176 114 15-36 20 41-20 15z" fill="#A3D9C5" />
          <Path d="m213 114 16-24 12 39-18 12z" fill="#5EA98C" />
        </>
      ) : null}

      {tipo === 'papel-gordura' || tipo === 'pizza' ? (
        <>
          <Path d="m110 74 112 14 20 111-113 18z" fill="#D7B37B" stroke="#A77E47" strokeWidth="6" />
          <Path d="m126 91 80 11 13 73-82 14z" fill="#F4D78E" stroke="#D1AD61" strokeWidth="4" />
          <Circle cx="156" cy="125" r="10" fill="#D96C43" />
          <Circle cx="191" cy="133" r="9" fill="#D96C43" />
          <Circle cx="166" cy="160" r="8" fill="#D96C43" />
          {tipo === 'papel-gordura' ? <Circle cx="240" cy="88" r="18" fill="#E9A737" /> : null}
        </>
      ) : null}

      {tipo === 'papel' || tipo === 'isopor' || tipo === 'plastico' ? (
        <>
          <Path d="M98 91h75l20 20v91H98z" fill="#FFFFFF" stroke="#2585C4" strokeWidth="6" strokeLinejoin="round" />
          <Path d="M173 91v22h20m-72 28h48m-48 17h48m-48 17h34" fill="none" stroke="#71A9CC" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {tipo === 'isopor' ? (
            <>
              <Rect x="213" y="118" width="65" height="58" rx="8" fill="#FFFFFF" stroke="#AAB8BB" strokeWidth="5" />
              <Path d="M225 133h40m-40 14h40m-40 14h40" stroke="#D3DDDF" strokeWidth="5" strokeLinecap="round" />
            </>
          ) : null}
          {tipo === 'plastico' ? <Garrafa x={205} y={78} /> : null}
        </>
      ) : null}

      {tipo === 'nao-reciclavel' ? (
        <>
          <Lixeira cor={CORES_LIXEIRAS.cinza} />
          <Circle cx="180" cy="158" r="34" fill="#FFFFFF" />
          <Path d="m157 135 46 46" stroke="#D94B45" strokeWidth="8" strokeLinecap="round" />
        </>
      ) : null}

      {tipo === 'eletronicos' || tipo === 'dados' || tipo === 'coleta-eletronicos' ? (
        <>
          <Laptop />
          <Rect x="241" y="117" width="44" height="81" rx="9" fill="#455A64" />
          <Rect x="247" y="127" width="32" height="58" rx="4" fill="#BDE8E8" />
          <Circle cx="263" cy="192" r="3" fill="#FFFFFF" />
        </>
      ) : null}

      {tipo.startsWith('oleo-') ? (
        <>
          <Garrafa x={138} y={67} cor="#F2C34D" />
          <Rect x="149" y="128" width="62" height="51" fill="#FFF5D4" />
          <Path d="M160 144h40m-40 13h40" stroke="#C99424" strokeWidth="5" strokeLinecap="round" />
          {tipo === 'oleo-frio' ? (
            <Path d="M103 114c-14 19-15 27-15 33a15 15 0 0 0 30 0c0-6-1-14-15-33z" fill="#6CC4DB" />
          ) : null}
          {tipo === 'oleo-coleta' ? (
            <Path d="m235 174 14 14 28-34" fill="none" stroke={CORES.verdeEscuro} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          ) : null}
        </>
      ) : null}
    </Svg>
  );
}
