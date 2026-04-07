# API de Livros — Docker Compose

Projeto de API REST para gerenciamento de livros, com **dois containers** orquestrados via Docker Compose:

- **Container 1:** aplicação Node.js + Express
- **Container 2:** banco de dados MySQL 8

## Tecnologias utilizadas

- Node.js 20
- Express
- MySQL 8
- Docker
- Docker Compose

## Estrutura do projeto

Rode npm install no terminal, para conseguir rodar.

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
Define os dois serviços:
- `app`: container da API Node.js
- `db`: container do MySQL

Também define volume para persistência do banco.

### `Dockerfile`
Cria a imagem da aplicação Node.js.

### `src/index.js`
Contém a API Express com os cinco endpoints de CRUD de livros.

### `src/db.js`
Gerencia a conexão com o MySQL, com tentativas de reconexão até o banco ficar disponível.

### `db/init.sql`
Cria a tabela `livros` e insere três registros iniciais de exemplo.

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

| Recurso | Endereço |
|---|---|
| Página inicial | `http://localhost:3000` |
| Endpoint de livros | `http://localhost:3000/livros` |
| Porta do banco | `localhost:3306` |

---

## Endpoints da API

### 1. Listar livros

Retorna todos os livros cadastrados.

```http
GET /livros
```

```bash
curl http://localhost:3000/livros
```

Resposta de exemplo:

```json
[
  { "id": 1, "titulo": "Dom Casmurro", "autor": "Machado de Assis", "ano": 1899, "genero": "Romance" },
  { "id": 2, "titulo": "O Senhor dos Anéis", "autor": "J.R.R. Tolkien", "ano": 1954, "genero": "Fantasia" },
  { "id": 3, "titulo": "1984", "autor": "George Orwell", "ano": 1949, "genero": "Distopia" }
]
```

---

### 2. Buscar livro por ID

Retorna um único livro pelo seu identificador.

```http
GET /livros/{id}
```

```bash
curl http://localhost:3000/livros/1
```

---

### 3. Criar livro

Cadastra um novo livro. Os campos `titulo` e `autor` são obrigatórios; `ano` e `genero` são opcionais.

```http
POST /livros
Content-Type: application/json
```

```bash
curl -X POST http://localhost:3000/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"O Hobbit","autor":"J.R.R. Tolkien","ano":1937,"genero":"Fantasia"}'
```

Resposta `201 Created`:

```json
{ "mensagem": "Livro criado com sucesso.", "id": 4, "titulo": "O Hobbit", "autor": "J.R.R. Tolkien", "ano": 1937, "genero": "Fantasia" }
```

---

### 4. Atualizar livro

Atualiza os dados de um livro pelo ID. Os campos `titulo` e `autor` são obrigatórios.

```http
PUT /livros/{id}
Content-Type: application/json
```

```bash
curl -X PUT http://localhost:3000/livros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Dom Casmurro","autor":"Machado de Assis","ano":1899,"genero":"Romance Realista"}'
```

---

### 5. Remover livro

Exclui o livro correspondente ao ID informado.

```http
DELETE /livros/{id}
```

```bash
curl -X DELETE http://localhost:3000/livros/1
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

## Observações

- O charset `utf8mb4` é configurado no MySQL e na conexão da aplicação para suporte completo a acentos e caracteres especiais.
- O serviço `app` aguarda o `db` estar pronto antes de iniciar, com tentativas automáticas de reconexão.
