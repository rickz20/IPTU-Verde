import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';

const PRIMARY_COLOR = '#94B310';

export default function Login() {
  const [activeTab, setActiveTab] = useState('Login');
  const isLogin = activeTab === 'Login';

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
                onPress={() => setActiveTab(tab)}
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
          <Input keyboardType="email-address" />
          <Input secureTextEntry type="password" />
        </View>

        {isLogin && (
          <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        )}

        <Button title={isLogin ? 'Entrar' : 'Cadastrar'} />
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
    width: '100%',
    height: 34,
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
