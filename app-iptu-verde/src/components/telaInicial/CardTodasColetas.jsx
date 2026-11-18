import { rem } from '../../utils/typography';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { CORES } from './tema';

function IconeReciclagem() {
  return (
    <View style={styles.iconeContainer}>
      <Svg width={25} height={25} viewBox="0 0 24 24" fill="none">
        <Path
          d="m12 3 7.5 4.3v9.4L12 21l-7.5-4.3V7.3L12 3Z"
          stroke={CORES.branco}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <Path
          d="m4.8 7.5 7.2 4.2 7.2-4.2M12 12v8.5"
          stroke={CORES.branco}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function IconeLocalizacao() {
  return (
    <Svg width={12} height={15} viewBox="0 0 12 15" fill="none">
      <Path
        d="M6 14s5-5.1 5-8.4A5 5 0 0 0 1 5.6C1 8.9 6 14 6 14Z"
        fill={CORES.verdeEscuro}
      />
      <Circle cx="6" cy="5.5" r="1.7" fill={CORES.branco} />
    </Svg>
  );
}

function formatarData(data) {
  if (typeof data !== 'string' || !data) return '';
  const isoDate = data.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
  if (isoDate) return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return data;
  const parsedDate = new Date(data);
  return Number.isNaN(parsedDate.getTime())
    ? ''
    : parsedDate.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' });
}

function valorMaterial(material) {
  const peso = Number(material?.peso) || 0;
  return material?.unidadePeso === 'g' ? peso / 1000 : peso;
}

function formatarPeso(peso) {
  return Number(peso).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

export default function CardTodasColetas({ coleta }) {
  const materiais = Array.isArray(coleta.materiais) ? coleta.materiais : [];
  const pesoTotal =
    Number(coleta.pesoTotal) ||
    materiais.reduce((total, material) => total + valorMaterial(material), 0);
  const endereco = coleta.endereco || coleta.ponto || '';

  return (
    <View style={styles.card}>
      <IconeReciclagem />

      <View style={styles.detalhes}>
        <Text style={styles.titulo}>Coleta registrada</Text>
        <Text style={styles.informacao}>
          {materiais.length
            ? materiais
                .map((material) =>
                  typeof material === 'string'
                    ? material
                    : material.descricao || material.categoria || material.material || 'Material',
                )
                .join(' · ')
            : 'Materiais não detalhados'}
        </Text>
        <Text style={styles.peso}>Peso total: {formatarPeso(pesoTotal)} kg</Text>
        {endereco ? (
          <View style={styles.linhaEndereco}>
            <IconeLocalizacao />
            <Text style={styles.endereco}>{endereco}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.data}>
        <Text style={styles.textoData}>{formatarData(coleta.data)}</Text>
        <Text style={styles.textoData}>{coleta.horario}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 102,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 17,
    backgroundColor: CORES.cinza,
  },
  iconeContainer: {
    width: 28,
    height: 28,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: CORES.amarelo,
  },
  detalhes: {
    flex: 1,
    paddingTop: 2,
  },
  titulo: {
    marginBottom: 5,
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Alexandria_700Bold',
  },
  informacao: {
    marginBottom: 4,
    color: CORES.texto,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  peso: {
    marginTop: 2,
    color: CORES.texto,
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_700Bold',
  },
  linhaEndereco: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  endereco: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
  data: {
    minWidth: 72,
    alignItems: 'flex-end',
  },
  textoData: {
    color: CORES.textoSecundario,
    fontSize: rem(1),
    lineHeight: rem(1.25),
    fontFamily: 'Inter_400Regular',
  },
});
