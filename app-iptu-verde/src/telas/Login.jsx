import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import InputCadastro from '../components/InputCadastro';
import AlertIcon from '../../assets/alert-circle.svg';
import TelaInicial from './TelaInicial';

const PRIMARY_COLOR = '#94B310';
const INVALID_EMAIL_ERROR = 'E-mail inválido.';
const EMAIL_REQUIRED_ERROR = 'Digite seu e-mail.';
const REQUIRED_FIELDS_ERROR = 'Preencha todos os campos.';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatCpf(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Login() {
  const [activeTab, setActiveTab] = useState('Login');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showHome, setShowHome] = useState(false);
  const isLogin = activeTab === 'Login';

  const registrationFields = [
    {
      key: 'name',
      placeholder: 'Nome',
      value: name,
      onChangeText: setName,
      autoCapitalize: 'words',
    },
    {
      key: 'cpf',
      placeholder: 'CPF',
      value: cpf,
      onChangeText: (value) => setCpf(formatCpf(value)),
      keyboardType: 'numeric',
    },
    {
      key: 'phone',
      placeholder: 'Telefone',
      value: phone,
      onChangeText: (value) => setPhone(formatPhone(value)),
      keyboardType: 'phone-pad',
    },
    {
      key: 'email',
      placeholder: 'E-mail',
      value: email,
      onChangeText: setEmail,
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      key: 'password',
      placeholder: 'Senha',
      value: password,
      onChangeText: setPassword,
      secureTextEntry: true,
      autoCapitalize: 'none',
    },
    {
      key: 'confirmPassword',
      placeholder: 'Confirmar senha',
      value: confirmPassword,
      onChangeText: setConfirmPassword,
      secureTextEntry: true,
      autoCapitalize: 'none',
    },
  ];

  function handleTabChange(tab) {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});
  }

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
    if (isValidEmail(value)) {
      setFieldErrors((current) => ({ ...current, loginEmail: false }));
    }
    if (errorMessage !== REQUIRED_FIELDS_ERROR && isValidEmail(value)) {
      setErrorMessage('');
    }
  }

  function handleLoginPasswordChange(value) {
    setPassword(value);
    if (value.trim()) {
      const nextErrors = { ...fieldErrors, loginPassword: false };
      setFieldErrors(nextErrors);
      if (!Object.values(nextErrors).some(Boolean)) {
        setErrorMessage('');
      }
    }
  }

  function handleRegistrationFieldChange(field, value) {
    field.onChangeText(value);

    const digits = value.replace(/\D/g, '');
    const fieldIsValid = {
      name: Boolean(value.trim()),
      cpf: digits.length === 11,
      phone: [10, 11].includes(digits.length),
      email: isValidEmail(value),
      password: Boolean(value.trim()),
      confirmPassword: Boolean(value.trim()),
    }[field.key];

    const nextErrors = { ...fieldErrors };
    if (fieldIsValid) {
      nextErrors[field.key] = false;
    }

    const nextPassword = field.key === 'password' ? value : password;
    const nextConfirmPassword =
      field.key === 'confirmPassword' ? value : confirmPassword;

    if (nextPassword && nextConfirmPassword) {
      if (nextPassword === nextConfirmPassword) {
        nextErrors.password = false;
        nextErrors.confirmPassword = false;
      } else if (fieldErrors.password || fieldErrors.confirmPassword) {
        nextErrors.password = true;
        nextErrors.confirmPassword = true;
      }
    }

    setFieldErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) {
      setErrorMessage('');
    }
  }

  function handleLogin() {
    const hasEmail = email.trim().length > 0;
    const hasPassword = password.trim().length > 0;
    const errors = {
      loginEmail: !hasEmail || !isValidEmail(email),
      loginPassword: !hasPassword,
    };
    setFieldErrors(errors);

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
    if (!isValidEmail(email)) {
      setErrorMessage(INVALID_EMAIL_ERROR);
      return;
    }

    setErrorMessage('');
    setFieldErrors({});
    setSuccessMessage('');
    setShowHome(true);
  }

  function handleLogout() {
    setShowHome(false);
    setPassword('');
  }

  function handleRegistration() {
    const errors = {
      name: !name.trim(),
      cpf: cpf.replace(/\D/g, '').length !== 11,
      phone: ![10, 11].includes(phone.replace(/\D/g, '').length),
      email: !isValidEmail(email),
      password: !password.trim(),
      confirmPassword: !confirmPassword.trim(),
    };
    if (
      password.trim() &&
      confirmPassword.trim() &&
      password !== confirmPassword
    ) {
      errors.password = true;
      errors.confirmPassword = true;
    }

    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      if (
        !name.trim() ||
        !cpf.trim() ||
        !phone.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        setErrorMessage(REQUIRED_FIELDS_ERROR);
        return;
      }
      if (errors.cpf) {
        setErrorMessage('Digite um CPF com 11 números.');
        return;
      }
      if (errors.phone) {
        setErrorMessage('Digite um telefone com DDD.');
        return;
      }
      if (errors.email) {
        setErrorMessage(INVALID_EMAIL_ERROR);
        return;
      }
      if (errors.password || errors.confirmPassword) {
        setErrorMessage('As senhas não conferem.');
      }
      return;
    }

    setErrorMessage('');
    setFieldErrors({});
    setSuccessMessage('Cadastro realizado! Faça login para continuar.');
    setConfirmPassword('');
    setName('');
    setCpf('');
    setPhone('');
    setActiveTab('Login');
  }

  if (showHome) {
    return <TelaInicial onSair={handleLogout} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Image
          source={require('../../assets/image 4.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.tabs}>
          {['Login', 'Cadastro'].map((tab) => {
            const isActive = activeTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => handleTabChange(tab)}
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
            {isLogin ? 'Faça login para continuar' : 'Preencha os dados a seguir para prosseguir.'}
          </Text>
          {isLogin && (
            <Text style={styles.description}>
              Acesse sua conta para continuar usando o IPTU Verde.
            </Text>
          )}
        </View>

        {!isLogin && <Text style={styles.sectionTitle}>Dados pessoais</Text>}

        <View style={[styles.form, !isLogin && styles.registrationForm]}>
          {Boolean(errorMessage) && (
            <View style={styles.errorMessage} accessibilityRole="alert">
              <AlertIcon width={20} height={20} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
          {Boolean(successMessage) && (
            <View style={styles.successMessage} accessibilityRole="alert">
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {isLogin ? (
            <>
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={validateEmail}
                hasError={Boolean(
                  fieldErrors.loginEmail ||
                    errorMessage === INVALID_EMAIL_ERROR ||
                    errorMessage === EMAIL_REQUIRED_ERROR,
                )}
              />
              <Input
                placeholder="Senha"
                secureTextEntry
                type="password"
                value={password}
                onChangeText={handleLoginPasswordChange}
                hasError={Boolean(fieldErrors.loginPassword)}
              />
            </>
          ) : (
            registrationFields.map((field) => (
              <InputCadastro
                key={field.key}
                placeholder={field.placeholder}
                value={field.value}
                onChangeText={(value) =>
                  handleRegistrationFieldChange(field, value)
                }
                keyboardType={field.keyboardType}
                autoCapitalize={field.autoCapitalize}
                secureTextEntry={field.secureTextEntry}
                hasError={fieldErrors[field.key]}
              />
            ))
          )}
        </View>

        {isLogin && (
          <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        )}

        <Button
          title={isLogin ? 'Entrar' : 'Continuar'}
          onPress={isLogin ? handleLogin : handleRegistration}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  content: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  logo: {
    width: 110,
    height: 47,
    alignSelf: 'center',
    marginBottom: 22,
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
  sectionTitle: {
    marginBottom: 8,
    color: '#222222',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  form: {
    marginBottom: 47,
  },
  registrationForm: {
    marginBottom: 35,
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
  successMessage: {
    minHeight: 40,
    marginBottom: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#F2F7E1',
  },
  successText: {
    color: '#526600',
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
