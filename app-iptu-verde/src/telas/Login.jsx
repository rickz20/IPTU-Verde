import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import AlertIcon from '../../assets/alert-circle.svg';
import TelaInicial from './TelaInicial';

const PRIMARY_COLOR = '#94B310';
const INVALID_EMAIL_ERROR = 'E-mail inválido.';
const EMAIL_REQUIRED_ERROR = 'Digite seu e-mail.';
const REQUIRED_FIELDS_ERROR = 'Preencha todos os campos.';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function Login() {
  const [activeTab, setActiveTab] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHome, setShowHome] = useState(false);
  const isLogin = activeTab === 'Login';

  function validateEmail() {
    const valid = isValidEmail(email);
    if (valid) {
      if (errorMessage !== REQUIRED_FIELDS_ERROR) {
        setErrorMessage('');
      }
      return true;
    }

    setErrorMessage(email.trim() ? INVALID_EMAIL_ERROR : EMAIL_REQUIRED_ERROR);
    return false;
  }

  function handleEmailChange(value) {
    setEmail(value);
    if (errorMessage !== REQUIRED_FIELDS_ERROR && isValidEmail(value)) {
      setErrorMessage('');
    }
  }

  function handleSubmit() {
    const hasEmail = email.trim().length > 0;
    const hasPassword = password.trim().length > 0;
    const validEmail = isValidEmail(email);

    if (!hasEmail && !hasPassword) {
      setErrorMessage(REQUIRED_FIELDS_ERROR);
      return;
    }
    if (!hasEmail) {
      setErrorMessage(EMAIL_REQUIRED_ERROR);
      return;
    }
    if (!hasPassword) {
      setErrorMessage(REQUIRED_FIELDS_ERROR);
      return;
    }
    if (!validEmail) {
      setErrorMessage(INVALID_EMAIL_ERROR);
      return;
    }

    setErrorMessage('');
    if (isLogin) {
      setShowHome(true);
    }
  }

  if (showHome) {
    return <TelaInicial />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/image 4.png')} style={styles.logo} />

        <View style={styles.tabs}>
          {['Login', 'Cadastro'].map((tab) => {
            const isActive = activeTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => {
                  setActiveTab(tab);
                  setErrorMessage('');
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.introduction}>
          <Text style={styles.title}>
            {isLogin ? 'Faça login para continuar' : 'Faça seu cadastro veilha'}
          </Text>
          <Text style={styles.description}>
            {isLogin
              ? 'Acesse sua conta para continuar usando o IPTU Verde.'
              : 'Cadastre-se para continuar usando o IPTU Verde.'}
          </Text>
        </View>

        <View style={styles.form}>
          {errorMessage && (
            <View style={styles.errorMessage} accessibilityRole="alert">
              <AlertIcon width={20} height={20} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={validateEmail}
            hasError={Boolean(errorMessage && errorMessage !== REQUIRED_FIELDS_ERROR)}
          />
          <Input
            placeholder="Senha"
            secureTextEntry
            type="password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {isLogin && (
          <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        )}

        <Button title={isLogin ? 'Entrar' : 'Cadastrar'} onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 68,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  content: {
    width: '100%',
  },
  logo: {
    width: 110,
    height: 47,
    alignSelf: 'center',
    marginBottom: 56,
    resizeMode: 'contain',
  },
  tabs: {
    width: 265,
    height: 48,
    alignSelf: 'center',
    marginBottom: 14,
    flexDirection: 'row',
    borderRadius: 6,
    backgroundColor: '#E2E2E2',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: PRIMARY_COLOR,
  },
  tabText: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'Alexandria_400Regular',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontFamily: 'Alexandria_700Bold',
  },
  introduction: {
    marginBottom: 10,
  },
  title: {
    marginBottom: 3,
    color: '#222222',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  description: {
    color: '#777777',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  form: {
    marginBottom: 47,
  },
  errorMessage: {
    minHeight: 40,
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    color: '#D32F2F',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#333333',
    fontSize: 10,
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400Regular',
  },
});
