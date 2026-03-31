const express = require('express');
const { connectWithRetry, getPool } = require('./db');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>API de Usuários</h1>
    <p>Ambiente rodando com Docker Compose.</p>
    <p>Endpoints disponíveis:</p>
    <ul>
      <li>GET /usuarios</li>
      <li>GET /usuarios/:id</li>
      <li>POST /usuarios</li>
      <li>PUT /usuarios/:id</li>
      <li>DELETE /usuarios/:id</li>
    </ul>
  `);
});

app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT id, nome, email FROM usuarios ORDER BY id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar usuários.', detalhes: error.message });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const [rows] = await getPool().query(
      'SELECT id, nome, email FROM usuarios WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar usuário.', detalhes: error.message });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: 'Os campos nome e email são obrigatórios.' });
    }

    const [result] = await getPool().query(
      'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
      [nome, email]
    );

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso.',
      id: result.insertId,
      nome,
      email
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Já existe um usuário com este e-mail.' });
    }

    return res.status(500).json({ erro: 'Erro ao criar usuário.', detalhes: error.message });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, email } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    if (!nome || !email) {
      return res.status(400).json({ erro: 'Os campos nome e email são obrigatórios.' });
    }

    const [result] = await getPool().query(
      'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
      [nome, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.json({ mensagem: 'Usuário atualizado com sucesso.', id, nome, email });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Já existe um usuário com este e-mail.' });
    }

    return res.status(500).json({ erro: 'Erro ao atualizar usuário.', detalhes: error.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const [result] = await getPool().query('DELETE FROM usuarios WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.json({ mensagem: 'Usuário removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao remover usuário.', detalhes: error.message });
  }
});

async function start() {
  try {
    await connectWithRetry();

    app.listen(port, () => {
      console.log(`API rodando na porta ${port}.`);
    });
  } catch (error) {
    console.error('Não foi possível iniciar a aplicação:', error.message);
    process.exit(1);
  }
}

start();
