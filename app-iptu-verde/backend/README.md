# Backend do IPTU Verde

API Express com Firebase Admin. A API cobre autenticação, perfil, alteração de
senha, pontos de coleta, agendamentos, histórico de coletas e notificações no
Firestore. O cadastro público sempre cria `tipo: "pagador"`; contas com
`tipo: "adm"` devem ser provisionadas manualmente por uma pessoa autorizada.
O login aceita os dois tipos. Contas `adm` acessam o painel administrativo do
aplicativo; os endpoints `/admin/*` exigem autenticação e verificam o tipo da
conta no token.

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
   `usuarios`. As demais coleções podem ser configuradas pelas variáveis
   `FIRESTORE_POINTS_COLLECTION`, `FIRESTORE_BOOKINGS_COLLECTION`,
   `FIRESTORE_COLLECTIONS_COLLECTION`, `FIRESTORE_NOTIFICATIONS_COLLECTION`,
   `FIRESTORE_PROPERTIES_COLLECTION` e
   `FIRESTORE_BOOKING_SLOTS_COLLECTION`.

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

O endpoint `POST /auth/register` recebe `nome`, `cpf`, `telefone`, `email`,
`senha` e `imovel` com `cep`, `rua`, `numero`, `bairro`, `complemento`,
`inscricaoImobiliaria` e `vinculo` (`proprietario`, `inquilino` ou `residente`).
Ele valida os dados, rejeita CPF/e-mail duplicados e cria o usuário e o imóvel
na mesma transação do Firestore. O imóvel recebe o `usuarioId` do novo usuário.
A senha é salva como `senhaHash` com bcrypt; `tipo` não é aceito do cliente e o
cadastro público cria somente pagadores. Um cadastro bem-sucedido retorna `201`
e o app pede que a pessoa faça login.

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

## Dados consumidos pelo aplicativo

Os endpoints abaixo usam `Authorization: Bearer <token>` quando indicados.
O backend nunca aceita um `usuarioId` fornecido pelo aplicativo para consultas
de dados pessoais; identifica a conta a partir do JWT.

| Endpoint | Acesso | Uso |
| --- | --- | --- |
| `GET /auth/me` | autenticado | Dados da conta atual |
| `PATCH /auth/me` | autenticado | Atualizar nome, estado civil e/ou telefone |
| `PATCH /auth/password` | autenticado | Alterar senha, validando a senha atual |
| `GET /pontos-coleta` | público | Lista de pontos ativos/cadastrados |
| `GET /notificacoes` | autenticado | Avisos públicos e notificações da conta atual |
| `GET /agendamentos` | autenticado | Agendamentos da conta atual |
| `GET /agendamentos/disponibilidade?pontoId=...&data=AAAA-MM-DD` | autenticado | Horários ocupados e disponíveis |
| `POST /agendamentos` | autenticado | Criar agendamento |
| `GET /coletas` | autenticado | Histórico da conta atual |
| `GET /imoveis` | autenticado | Imóveis vinculados à conta atual |
| `GET /admin/coletas` | administrador | Coletas registradas no município |
| `POST /admin/coletas` | administrador | Registrar uma coleta com contato e materiais pesados |
| `GET /admin/agendamentos` | administrador | Solicitações e agenda de todos os usuários |
| `PATCH /admin/agendamentos/:id/decisao` | administrador | Aceitar ou recusar uma solicitação |
| `GET /admin/pontos-coleta` | administrador | Pontos disponíveis para o painel |
| `GET /admin/agenda/configuracao?pontoId=...` | administrador | Consultar horários e dias configurados |
| `PUT /admin/agenda/configuracao` | administrador | Salvar os horários de atendimento de um ponto |

Cadastre os documentos do Firestore para disponibilizar os dados. A tela não
usa mais os arrays de demonstração:

- `pontosColeta/{id}`: `nome`, `endereco`, `cidade`, `referencia` e `horario`.
- `notificacoes/{id}`: `titulo`, `descricao`, `data` e `horario`.
- `coletas/{id}`: `usuarioId` (ID do documento do usuário), `quantidade`,
  `material`, `entregador`, `responsavel`, `endereco`, `data` e `horario`.
- `agendamentos/{id}` é criado pelo `POST /agendamentos` e recebe o `usuarioId`
  do token, além de ponto, endereço, data, horário, modalidade, materiais,
  `telefoneContato` e status.
- `reservasHorariosAgendamento/{id}` reserva atomicamente a combinação de
  ponto, data e horário, impedindo que duas contas confirmem a mesma vaga.
- `imoveis/{id}`: `usuarioId` (ID do documento do usuário), `cep`, `rua`,
  `numero`, `endereco`, `bairro`, `complemento`, `inscricaoImobiliaria`,
  `vinculo` (`proprietario`, `inquilino` ou `residente`) e `criadoEm`.
- `agendamentos/{id}` é consultado pelo painel administrativo e recebe as
  decisões `aceito` ou `recusado`; recusas também salvam `motivoRecusa`.
- Ao decidir uma solicitação, a API cria uma notificação privada com
  `usuarioId`, `agendamentoId`, `tipo`, `titulo`, `descricao`, `data`,
  `horario` e `lida`. O endpoint de notificações mantém os avisos públicos e
  retorna notificações privadas somente para a conta autenticada.
- `coletas/{id}` também armazena as coletas registradas pelo administrador:
  `data`, `horario`, `nomeContribuinte`, `telefone`, `modalidade`, endereço,
  `materiais` (categoria, descrição, peso e unidades), `pesoTotal` e
  `registradoPor`.
- `agendasAtendimento/{pontoId}` armazena a configuração por ponto: `datas`
  (datas selecionadas no calendário), `diasSemana` (compatibilidade com agendas
  recorrentes; 0=domingo a 6=sábado), `abertura`, `encerramento`, `inicioPausa`,
  `fimPausa`, `duracaoMinutos` e `modalidades`. O nome da coleção pode ser
  alterado com `FIRESTORE_SCHEDULES_COLLECTION`.

A modalidade aceita `ponto` ou `domicilio`; modalidade domiciliar exige
endereço, e materiais são enviados como uma lista de nomes. A data de
agendamento usa `AAAA-MM-DD` e deve ser hoje ou futura.
O painel permite registrar coletas, acompanhar agenda e solicitações, decidir
pedidos e configurar o atendimento. Pontos de coleta continuam sendo
cadastrados diretamente no Firestore por uma pessoa autorizada.
