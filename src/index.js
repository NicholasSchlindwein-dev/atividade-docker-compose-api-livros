const express = require('express');
const { connectWithRetry, getPool } = require('./db');

const app = express();
const cors = require('cors');
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(`
    <h1>API de Livros</h1>
    <p>Ambiente rodando com Docker Compose.</p>
    <p>Endpoints disponíveis:</p>
    <ul>
      <li>GET /livros</li>
      <li>GET /livros/:id</li>
      <li>POST /livros</li>
      <li>PUT /livros/:id</li>
      <li>DELETE /livros/:id</li>
    </ul>
  `);
});

app.get('/livros', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT id, titulo, autor, ano, genero FROM livros ORDER BY id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar livros.', detalhes: error.message });
  }
});

app.get('/livros/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const [rows] = await getPool().query(
      'SELECT id, titulo, autor, ano, genero FROM livros WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar livro.', detalhes: error.message });
  }
});

app.post('/livros', async (req, res) => {
  try {
    const { titulo, autor, ano, genero } = req.body;

    if (!titulo || !autor) {
      return res.status(400).json({ erro: 'Os campos titulo e autor são obrigatórios.' });
    }

    const [result] = await getPool().query(
      'INSERT INTO livros (titulo, autor, ano, genero) VALUES (?, ?, ?, ?)',
      [titulo, autor, ano ?? null, genero ?? null]
    );

    return res.status(201).json({
      mensagem: 'Livro criado com sucesso.',
      id: result.insertId,
      titulo,
      autor,
      ano: ano ?? null,
      genero: genero ?? null
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao criar livro.', detalhes: error.message });
  }
});

app.put('/livros/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { titulo, autor, ano, genero } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    if (!titulo || !autor) {
      return res.status(400).json({ erro: 'Os campos titulo e autor são obrigatórios.' });
    }

    const [result] = await getPool().query(
      'UPDATE livros SET titulo = ?, autor = ?, ano = ?, genero = ? WHERE id = ?',
      [titulo, autor, ano ?? null, genero ?? null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }

    return res.json({ mensagem: 'Livro atualizado com sucesso.', id, titulo, autor, ano: ano ?? null, genero: genero ?? null });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao atualizar livro.', detalhes: error.message });
  }
});

app.delete('/livros/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const [result] = await getPool().query('DELETE FROM livros WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }

    return res.json({ mensagem: 'Livro removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao remover livro.', detalhes: error.message });
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
