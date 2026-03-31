# Atividade Docker Compose - API de Usuários

Este projeto atende ao requisito de entrega com **Docker Compose** e **múltiplos containers**, utilizando:

- **Container 1:** aplicação Node.js + Express
- **Container 2:** banco de dados MySQL 8

A aplicação expõe uma **API REST de usuários** com operações de CRUD.

## Tecnologias utilizadas

- Node.js 20
- Express
- MySQL 8
- Docker
- Docker Compose

## Estrutura do projeto

```text
.
├── db
│   └── init.sql
├── src
│   ├── db.js
│   └── index.js
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Como funciona cada arquivo

### `docker-compose.yml`
Define os dois serviços da atividade:
- `app`: container da API
- `db`: container do MySQL

Também define volume para persistência do banco.

### `Dockerfile`
Cria a imagem da aplicação Node.js.

### `src/index.js`
Contém a API Express e os endpoints de CRUD de usuários.

### `src/db.js`
Responsável pela conexão com o MySQL, incluindo tentativas de reconexão até o banco ficar disponível.

### `db/init.sql`
Cria a tabela `usuarios` e insere dois registros iniciais.

---

## Como subir o ambiente

### 1. Entrar na pasta do projeto

```bash
cd caminho/do/projeto
```

### 2. Subir os containers

```bash
docker compose up -d --build
```

### 3. Verificar se os containers estão ativos

```bash
docker compose ps
```

---

## Acessos

### Página inicial da aplicação

```text
http://localhost:3000
```

### Endpoint para listar usuários

```text
http://localhost:3000/usuarios
```

### Porta do banco

```text
localhost:3306
```

---

## Endpoints da API

## 1. Listar usuários

### Como funciona
Consulta todos os registros da tabela `usuarios` e retorna em JSON.

```http
GET /usuarios
```

Exemplo:

```bash
curl http://localhost:3000/usuarios
```

---

## 2. Buscar usuário por ID

### Como funciona
Consulta um único usuário pelo identificador informado na rota.

```http
GET /usuarios/{id}
```

Exemplo:

```bash
curl http://localhost:3000/usuarios/1
```

---

## 3. Criar usuário

### Como funciona
Recebe `nome` e `email` em JSON e grava no banco.

```http
POST /usuarios
Content-Type: application/json
```

Exemplo:

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos Lima","email":"carlos@email.com"}'
```

---

## 4. Atualizar usuário

### Como funciona
Atualiza o nome e o e-mail do usuário pelo ID.

```http
PUT /usuarios/{id}
Content-Type: application/json
```

Exemplo:

```bash
curl -X PUT http://localhost:3000/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Atualizado","email":"joao.atualizado@email.com"}'
```

---

## 5. Remover usuário

### Como funciona
Exclui o usuário correspondente ao ID informado.

```http
DELETE /usuarios/{id}
```

Exemplo:

```bash
curl -X DELETE http://localhost:3000/usuarios/1
```

---

## Como derrubar o ambiente

```bash
docker compose down
```

Para remover também o volume do banco:

```bash
docker compose down -v
```

---

## Observações para entrega

Para entregar ao professor, publique este projeto no GitHub e informe o link do repositório.

Sugestão de nome do repositório:

```text
atividade-docker-compose-api-usuarios
```

## Configuração de Charset (UTF-8)

Para garantir o correto armazenamento de caracteres especiais (como acentos), foi configurado:

- MySQL com `utf8mb4`
- Conexão da aplicação com `SET NAMES utf8mb4`
- Script `init.sql` com charset explícito