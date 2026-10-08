import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ClosedEyeIcon from '../../assets/akar-icons_eye-closed.svg';
import EyeIcon from '../../assets/Vector.svg';

export default function InputCadastro({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  hasError = false,
  textContentType,
  containerStyle,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View
      style={[
        styles.container,
        secureTextEntry && styles.passwordContainer,
        hasError && styles.containerError,
        containerStyle,
      ]}
    >
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#777777"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        textContentType={textContentType}
        autoCorrect={false}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.visibilityButton}
          onPress={() => setIsPasswordVisible((visible) => !visible)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            isPasswordVisible
              ? `Ocultar ${placeholder.toLowerCase()}`
              : `Mostrar ${placeholder.toLowerCase()}`
          }
        >
          {isPasswordVisible ? (
            <ClosedEyeIcon width={22} height={22} />
          ) : (
            <EyeIcon width={22} height={16} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 42,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: '#F0F0F0',
  },
  passwordContainer: {
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerError: {
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    color: '#333333',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    outlineStyle: 'none',
  },
  visibilityButton: {
    width: 32,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
