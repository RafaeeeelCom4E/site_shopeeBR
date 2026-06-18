const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configura onde e com que nome a imagem será salva
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Salva na pasta uploads
  },
  filename: (req, file, cb) => {
    // Cria um nome único para não substituir imagens com o mesmo nome
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Permite que o front-end acesse as imagens pela URL (ex: /uploads/foto.png)
app.use('/uploads', express.static('uploads'));

// CORS: aceita requisições de qualquer origem
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Servir arquivos estáticos do frontend (agora aponta para a raiz do sitealo-main)
app.use(express.static(path.join(__dirname, '../')));

// Configuração do Banco de Dados
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'loja',
  password: '2345', 
  port: 5432,
});

// ================= ROTAS DE PRODUTOS =================
app.get('/api/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

app.post('/api/produtos', upload.single('imagem'), async (req, res) => {
  const { nome, categoria, preco, precoOriginal, desconto, avaliacao, totalAvaliacoes, vendedor, vendedorAvaliacao, estoque, descricao } = req.body;
  
  // Se veio um arquivo, salva o caminho dele. Se não, fica vazio.
  const imagem_url = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const query = `
      INSERT INTO produtos (nome, categoria, preco, precoOriginal, desconto, avaliacao, totalAvaliacoes, vendedor, vendedorAvaliacao, estoque, descricao, imagem_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
    `;
    const values = [
        nome, categoria, preco, 
        precoOriginal || null, desconto || 0, avaliacao || 0, 
        totalAvaliacoes || 0, vendedor || '', vendedorAvaliacao || 0, 
        estoque || 0, descricao || '', imagem_url
    ];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, categoria, preco, precoOriginal, desconto, avaliacao, totalAvaliacoes, vendedor, vendedorAvaliacao, estoque, descricao, imagem_url } = req.body;
  try {
    const query = `
      UPDATE produtos 
      SET nome=$1, categoria=$2, preco=$3, precoOriginal=$4, desconto=$5, avaliacao=$6, totalAvaliacoes=$7, vendedor=$8, vendedorAvaliacao=$9, estoque=$10, descricao=$11, imagem_url=$12
      WHERE id=$13 RETURNING *
    `;
    const values = [nome, categoria, preco, precoOriginal || null, desconto || 0, avaliacao || 0, totalAvaliacoes || 0, vendedor || '', vendedorAvaliacao || 0, estoque || 0, descricao || '', imagem_url || '', id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM produtos WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

// ================= ROTAS DE USUÁRIOS =================
app.post('/api/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, is_admin',
      [nome, email, senha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    const user = result.rows[0];
    if (user.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    res.json({ id: user.id, nome: user.nome, email: user.email, is_admin: user.is_admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// ================= ROTAS DE COMPRAS =================
app.post('/api/compras', async (req, res) => {
  const { usuario_id, itens, total } = req.body;
  try {
    await pool.query('BEGIN');
    const compraRes = await pool.query(
      'INSERT INTO compras (usuario_id, total, status) VALUES ($1, $2, $3) RETURNING id',
      [usuario_id, total, 'Concluído']
    );
    const compraId = compraRes.rows[0].id;

    for (const item of itens) {
      await pool.query(
        'INSERT INTO itens_compra (compra_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
        [compraId, item.id, item.quantity, item.preco]
      );
      await pool.query(
        'UPDATE produtos SET estoque = estoque - $1 WHERE id = $2',
        [item.quantity, item.id]
      );
    }
    await pool.query('COMMIT');
    res.status(201).json({ message: 'Compra finalizada com sucesso', compraId });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao finalizar compra' });
  }
});

app.get('/api/compras/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const comprasRes = await pool.query('SELECT * FROM compras WHERE usuario_id = $1 ORDER BY data_compra DESC', [usuarioId]);
    const compras = comprasRes.rows;
    for (let i = 0; i < compras.length; i++) {
      const itensRes = await pool.query(`
        SELECT ic.*, p.nome, p.imagem_url 
        FROM itens_compra ic 
        LEFT JOIN produtos p ON ic.produto_id = p.id 
        WHERE ic.compra_id = $1
      `, [compras[i].id]);
      compras[i].itens = itensRes.rows;
    }
    res.json(compras);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar histórico de compras' });
  }
});

// Qualquer outra rota de frontend (SPA) retorna o index.html
app.use((req, res) => {
  const indexPath = path.join(__dirname, '../index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`<!DOCTYPE html><html><body><script>window.location.href='/';</script></body></html>`);
    }
  });
});

app.listen(port, () => {
  console.log(`✅ Servidor rodando em http://localhost:${port}`);
  console.log(`📁 Servindo arquivos de: ${path.join(__dirname, '../')}`);
});