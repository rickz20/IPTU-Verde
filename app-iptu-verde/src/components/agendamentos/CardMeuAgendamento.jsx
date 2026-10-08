import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { CORES } from '../telaInicial/tema';

export default function CardMeuAgendamento({ agendamento }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.iconeCalendario}>
        <Svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke={CORES.branco}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Rect x="3" y="5" width="18" height="16" rx="2" />
          <Path d="M16 3v4M8 3v4M3 10h18" />
        </Svg>
      </View>

      <View style={styles.detalhes}>
        <View style={styles.linha}>
          <View style={styles.coluna}>
            <Text style={styles.rotulo}>Local de entrega</Text>
            <Text style={styles.titulo}>{agendamento.ponto}</Text>
            <Text style={styles.valorEmNegrito}>{agendamento.endereco}</Text>
          </View>
          <View style={styles.coluna}>
            <Text style={styles.rotulo}>Data e hora</Text>
            <Text style={styles.titulo}>{agendamento.data}</Text>
            <Text style={styles.valorEmNegrito}>{agendamento.horario}</Text>
          </View>
        </View>

        <View style={[styles.linha, styles.linhaInferior]}>
          <View style={styles.coluna}>
            <Text style={styles.rotulo}>Modalidade</Text>
            <Text style={styles.valorEmNegrito}>{agendamento.modalidade}</Text>
          </View>
          <View style={styles.coluna}>
            <Text style={styles.rotulo}>Materiais coletados</Text>
            <Text style={styles.valorEmNegrito}>{agendamento.materiais}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    minHeight: 128,
    padding: 14,
    borderRadius: 17,
    backgroundColor: CORES.cinza,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconeCalendario: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: CORES.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detalhes: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
  },
  linha: {
    flexDirection: 'row',
    gap: 10,
  },
  linhaInferior: {
    marginTop: 2,
  },
  coluna: {
    flex: 1,
  },
  rotulo: {
    color: '#5E5B56',
    fontSize: 9,
    lineHeight: 12,
    fontFamily: 'Inter_400Regular',
  },
  titulo: {
    color: CORES.texto,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: 'Alexandria_700Bold',
  },
  valorEmNegrito: {
    color: '#111111',
    fontSize: 9,
    lineHeight: 11,
    fontFamily: 'Inter_700Bold',
  },
});
