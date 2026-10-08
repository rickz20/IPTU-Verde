import Svg, { Path, Rect } from 'react-native-svg';

export default function MapaPontoColeta() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      accessibilityLabel="Mapa ilustrativo da região do ponto de coleta"
    >
      <Rect width="200" height="200" fill="#F5F5F5" />

      <Path
        d="M-20 34 42 73 67 52 103 68 128 43 222 12M-12 96 48 119 82 101 118 119 158 99 218 117M-18 162 44 142 82 160 124 143 221 174"
        fill="none"
        stroke="#E2E2E2"
        strokeWidth="14"
      />
      <Path
        d="M-14 12 45 49 74 35 111 54 145 27 215 2M-20 79 47 101 78 85 116 103 153 81 220 101M-15 145 44 126 83 144 127 126 219 158"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="8"
      />
      <Path
        d="M12 -10 26 45 14 83 31 126 18 210M67 -12 56 38 75 76 60 116 82 157 74 212M124 -12 111 32 130 68 114 110 139 149 127 211M180 -12 160 33 178 73 160 116 184 155 169 212"
        fill="none"
        stroke="#DCDCDC"
        strokeWidth="2"
      />
      <Path
        d="M4 -10 19 44 7 82 24 126 11 210M60 -12 49 38 68 76 53 116 75 157 67 212M117 -12 104 32 123 68 107 110 132 149 120 211M173 -12 153 33 171 73 153 116 177 155 162 212"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
      <Path
        d="M-5 184 36 150 91 160 115 190 169 176 214 190"
        fill="none"
        stroke="#D5D5D5"
        strokeWidth="10"
      />
      <Path
        d="M-5 184 36 150 91 160 115 190 169 176 214 190"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
      />
    </Svg>
  );
}
