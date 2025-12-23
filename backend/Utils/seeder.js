const User = require('../models/User');
const Management = require('../models/Management');
const HomeContent = require('../models/HomeContent');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    // 1. Criar Admin Padrão se não existir
    const adminExists = await User.findOne({ email: 'admin@projetoesperanca.com' });
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('admin123', salt);
        await User.create({ email: 'admin@projetoesperanca.com', password });
        console.log('Admin padrão criado: admin@projetoesperanca.com / admin123');
    }

    // 2. Inicializar Home Content se não existir
    const homeExists = await HomeContent.findOne();
    if (!homeExists) {
        await HomeContent.create({
            whoWeAre: { text: "Texto inicial...", image: "https://placehold.co/600x400" },
            learnMoreVideo: "https://www.youtube.com/watch?v=VIDEO_ID",
            results: { year: 2024, stats: [{ title: "Crianças", count: 150 }] },
            partners: []
        });
        console.log('Conteúdo Home inicializado.');
    }

    // 3. Inicializar Gestão (Cards Fixos)
    const count = await Management.countDocuments();
    if (count === 0) {
        const roles = [
            { role: 'Bispo da Diocese', category: 'eclesiastica', name: 'Nome' },
            { role: 'Administrador Paroquial', category: 'eclesiastica', name: 'Nome' },
            { role: 'Presidente(a)', category: 'coordenacao', name: 'Pe. Nome' },
            { role: 'Vice-Presidente(a)', category: 'coordenacao', name: 'Nome' },
            { role: 'Tesoureiro', category: 'coordenacao', name: 'Nome' },
            { role: '1º Secretário(a)', category: 'coordenacao', name: 'Nome' },
            { role: '2º Secretário(a)', category: 'coordenacao', name: 'Nome' },
            { role: 'Coordenador(a) Geral', category: 'coordenacao', name: 'Nome' },
            { role: '1º Fiscal Titular', category: 'conselho', name: 'Nome' },
            { role: '2º Fiscal Titular', category: 'conselho', name: 'Nome' },
            { role: '1º Fiscal Suplente', category: 'conselho', name: 'Nome' },
            { role: '2º Fiscal Suplente', category: 'conselho', name: 'Nome' }
        ];
        await Management.insertMany(roles);
        console.log('Cargos de gestão inicializados.');
    }
};

module.exports = seedDatabase;