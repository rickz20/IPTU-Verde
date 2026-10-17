# Backend do IPTU Verde

API Express com Firebase Admin, seguindo a organização do backend do Nutra.
Por enquanto, a API cobre login e cadastro de pagadores na coleção `usuarios`
do Firestore. O cadastro público sempre cria `tipo: "pagador"`; contas com
`tipo: "adm"` devem ser provisionadas manualmente por uma pessoa autorizada.
O login aceita os dois tipos; até a tela administrativa ser implementada, o app
confirma o login `adm` sem abrir a área de pagadores.

## Preparar o Firebase

1. No Firebase Console, crie uma chave privada de conta de serviço para o
   projeto.
2. Coloque o arquivo baixado em `backend/secrets/serviceAccount.json`.
   Nunca envie essa chave ao Git nem ao aplicativo.
3. Copie `backend/.env.example` para `backend/.env`.
4. Gere um segredo para os tokens JWT e preencha `JWT_SECRET` no `.env`. No
   PowerShell, pode gerar um com:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
   ```

   A coleção pode ser alterada com `FIRESTORE_USERS_COLLECTION`; o padrão é
   `usuarios`.

## Senhas existentes no Firestore

Os documentos atuais usam `senha` em texto puro. Antes de habilitar o login,
faça uma cópia de segurança da coleção e instale as dependências do backend:

```powershell
npm --prefix backend install
```

O comando a seguir apenas simula a migração e não grava no Firestore:

```powershell
npm --prefix backend run migrate:passwords
```

Revise os totais da simulação. Para aplicar a migração e substituir `senha`
por `senhaHash` (bcrypt), execute:

```powershell
npm --prefix backend run migrate:passwords -- --apply
```

A migração mantém os documentos e demais campos, normaliza e-mail para
minúsculas e remove o campo de senha em texto puro. Ela é segura para executar
novamente; documentos já migrados são ignorados.

## Executar

Na raiz do app, instale as dependências do backend uma vez e inicie o servidor:

```powershell
npm --prefix backend install
npm run backend
```

A API inicia na porta `3001`. Verifique-a em `http://localhost:3001/health`.
O app Android Emulator usa `http://10.0.2.2:3001` por padrão; iOS Simulator e
web usam `http://localhost:3001`. Em um celular físico, configure
`EXPO_PUBLIC_API_URL` no arquivo `.env.local` da raiz do app com o endereço IP
local do computador, por exemplo `http://192.168.1.25:3001`, e reinicie o Expo.
O telefone e o computador precisam estar na mesma rede Wi-Fi.

O endpoint `POST /auth/register` aceita `nome`, `cpf`, `telefone`, `email` e
`senha`. Ele valida os dados, rejeita CPF/e-mail duplicados e salva a senha como
`senhaHash` com bcrypt; `tipo` não é aceito do cliente. Um cadastro bem-sucedido
retorna `201` e o app pede que a pessoa faça login.

No login, o endpoint `POST /auth/login` recebe:

```json
{
  "email": "pagador@exemplo.com",
  "senha": "senha-digitada"
}
```

Em caso de sucesso, a API retorna um JWT de uma hora e os dados de perfil sem
incluir a senha ou o hash. O campo `tipo` deve ser `pagador` ou `adm`. O valor
`adm` fica reservado aos administradores; o cadastro público não deve permitir
que alguém escolha esse tipo.
