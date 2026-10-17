import { rem } from '../utils/typography';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import { apiRequest } from '../services/api';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(null);
  const isLogin = activeTab === 'Login';
  const scrollViewRef = useRef(null);
  const focusedInputRef = useRef(null);
  const scrollViewportHeight = useRef(0);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const registrationInputRefs = {
    name: useRef(null),
    cpf: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const centerFocusedInput = useCallback(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const input = focusedInputRef.current;
    const scrollView = scrollViewRef.current;
    if (!input || !scrollView || !scrollViewportHeight.current) {
      return;
    }

    input.measureLayout(
      scrollView,
      (x, y, width, height) => {
        const targetY = Math.max(
          0,
          y + height / 2 - scrollViewportHeight.current / 2,
        );
        scrollView.scrollTo({ y: targetY, animated: true });
      },
      () => console.warn('Não foi possível reposicionar o campo focado.'),
    );
  }, []);

  const handleInputFocus = useCallback((input) => {
    if (Platform.OS === 'web') {
      return;
    }

    focusedInputRef.current = input;
    requestAnimationFrame(centerFocusedInput);
  }, [centerFocusedInput]);

  useEffect(() => {
    const keyboardSubscription = Keyboard.addListener(
      'keyboardDidShow',
      centerFocusedInput,
    );

    return () => keyboardSubscription.remove();
  }, [centerFocusedInput]);

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
    setSession(null);
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

    const nextErrors = {
      ...fieldErrors,
      loginEmail: value.trim().length > 0 && !isValidEmail(value),
    };
    setFieldErrors(nextErrors);

    if (isValidEmail(value) && !Object.values(nextErrors).some(Boolean)) {
      setErrorMessage('');
    }
  }

  function handleLoginPasswordChange(value) {
    setPassword(value);

    const nextErrors = {
      ...fieldErrors,
      loginPassword: value.trim().length === 0,
    };
    setFieldErrors(nextErrors);

    if (value.trim() && !Object.values(nextErrors).some(Boolean)) {
      setErrorMessage('');
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
    } else if (fieldErrors[field.key] || Object.values(fieldErrors).some(Boolean)) {
      nextErrors[field.key] = true;
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

  async function handleLogin() {
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
    setIsSubmitting(true);

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), senha: password }),
      });

      setSession(result);
      setPassword('');

      if (result.usuario.tipo === 'pagador') {
        setShowHome(true);
      } else if (result.usuario.tipo === 'adm') {
        setSuccessMessage(
          'Acesso de administrador confirmado. O painel administrativo será disponibilizado em breve.',
        );
      } else {
        setSession(null);
        setErrorMessage('O tipo desta conta não é compatível com o aplicativo.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    setShowHome(false);
    setSession(null);
    setActiveTab('Login');
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});
    setName('');
    setCpf('');
    setPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleRegistration() {
    const errors = {
      name: !name.trim(),
      cpf: cpf.replace(/\D/g, '').length !== 11,
      phone: ![10, 11].includes(phone.replace(/\D/g, '').length),
      email: !isValidEmail(email),
      password: password.length < 8,
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
        setErrorMessage(
          errors.password
            ? 'A senha deve ter pelo menos 8 caracteres.'
            : 'As senhas não conferem.',
        );
      }
      return;
    }

    setErrorMessage('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          cpf: cpf.replace(/\D/g, ''),
          email: email.trim(),
          nome: name.trim(),
          senha: password,
          telefone: phone,
        }),
      });

      setSuccessMessage(result.mensagem);
      setConfirmPassword('');
      setName('');
      setCpf('');
      setPhone('');
      setPassword('');
      setSession(null);
      setActiveTab('Login');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showHome) {
    if (session?.usuario?.tipo === 'pagador') {
      return <TelaInicial onSair={handleLogout} />;
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onLayout={(event) => {
          scrollViewportHeight.current = event.nativeEvent.layout.height;
          requestAnimationFrame(centerFocusedInput);
        }}
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
                  disabled={isSubmitting}
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
                  inputRef={emailInputRef}
                  onFocus={handleInputFocus}
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
                  inputRef={passwordInputRef}
                  onFocus={handleInputFocus}
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
                  inputRef={registrationInputRefs[field.key]}
                  onFocus={handleInputFocus}
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
            title={
              isSubmitting
                ? 'Aguarde...'
                : isLogin
                  ? 'Entrar'
                  : 'Continuar'
            }
            onPress={isLogin ? handleLogin : handleRegistration}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 36,
  },
  content: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  logo: {
    width: 150,
    height: 64,
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
    fontSize: rem(1.125),
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
    fontSize: rem(1.25),
    fontFamily: 'Inter_700Bold',
  },
  description: {
    color: '#777777',
    fontSize: rem(1),
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle: {
    marginBottom: 8,
    color: '#222222',
    fontSize: rem(1.125),
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
    fontSize: rem(1),
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
    fontSize: rem(1),
    fontFamily: 'Inter_700Bold',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#333333',
    fontSize: rem(1),
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400Regular',
  },
});
