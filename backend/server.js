require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Importar módulo path
const connectDB = require('./config/db');
const seedDatabase = require('./Utils/seeder');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- ROTAS DA API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));

// --- SERVIR ARQUIVOS ESTÁTICOS (FRONTEND E ADMIN) ---

// 1. Servir a pasta 'admin' na rota /admin
// O __dirname aponta para a pasta 'backend', então voltamos uma pasta (..) e entramos em 'admin'
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// 2. Servir a pasta 'frontend' na raiz (/)
// Isso faz com que o style.css, imagens e js sejam encontrados
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