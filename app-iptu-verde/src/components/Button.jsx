import { rem } from '../utils/typography';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const PRIMARY_COLOR = '#94B310';

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 280,
    height: 56,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: PRIMARY_COLOR,
  },
  text: {
    color: '#FFFFFF',
    fontSize: rem(1.25),
    fontFamily: 'Inter_700Bold',
  },
});
