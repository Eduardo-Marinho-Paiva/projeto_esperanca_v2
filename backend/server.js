require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Importar módulo path
const connectDB = require('./config/db');
const seedDatabase = require('./Utils/seeder');
const instagramRouter = require('./routes/instagramRoutes').instagramRouter;
const backupRoutes = require('./routes/backupRoutes');

const app = express();

// --- MIDDLEWARES (ADAPTADO) ---
app.use(cors());

// Aumenta o limite do body-parser para aceitar imagens em Base64 (até 50mb)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- ROTAS DA API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/instagram', instagramRouter);
app.use('/api/backup', backupRoutes);

// --- SERVIR ARQUIVOS ESTÁTICOS (FRONTEND E ADMIN) ---

// 1. Servir a pasta 'admin' na rota /admin
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// 2. Servir a pasta 'frontend' na raiz (/)
app.use(express.static(path.join(__dirname, '../frontend')));

// 3. Rota Coringa (Fallback)
// Se o usuário acessar a raiz, envia o index.html do frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Se o usuário acessar /admin mas não especificar arquivo, tenta abrir login ou index
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/login.html'));
});

const PORT = process.env.PORT || 3000;

const startApp = async () => {
    try {
        console.log("🔄 Iniciando aplicação...");
        
        // 1. Conectar ao Banco
        await connectDB();

        // 2. Popular dados iniciais
        console.log("🌱 Verificando dados iniciais (Seed)...");
        await seedDatabase();

        // 3. Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`🌍 Frontend disponível em: http://localhost:${PORT}`);
            console.log(`⚙️  Admin disponível em:    http://localhost:${PORT}/admin/login.html`);
        });

    } catch (error) {
        console.error("\n💀 Falha fatal na inicialização.");
        console.error("Motivo:", error.message);
    }
};

startApp();