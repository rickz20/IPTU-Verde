import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import LockIcon from '../../assets/lock.svg';
import MailIcon from '../../assets/mail.svg';
import ClosedEyeIcon from '../../assets/akar-icons_eye-closed.svg';
import EyeIcon from '../../assets/Vector.svg';

export default function Input({
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  type = 'email',
  value,
  onChangeText,
  onBlur,
  hasError = false,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry || type === 'password';

  return (
    <View style={[styles.container, hasError && styles.containerError]}>
      {isPassword ? <LockIcon width={20} height={20} /> : <MailIcon width={20} height={20} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666666"
        secureTextEntry={isPassword && !isPasswordVisible}
        keyboardType={keyboardType}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        underlineColorAndroid="transparent"
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.visibilityButton}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          activeOpacity={0.7}
        >
          {isPasswordVisible
            ? <ClosedEyeIcon width={22} height={22} />
            : <EyeIcon width={22} height={16} />}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 42,
    marginBottom: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    backgroundColor: '#F5F5F5',
  },
  containerError: {
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    color: '#333333',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    borderWidth: 0,
    outlineStyle: 'none',
  },
  visibilityButton: {
    width: 30,
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
