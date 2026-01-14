const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Importar todos os modelos
const HomeContent = require('../models/HomeContent');
const Project = require('../models/Project');
const Management = require('../models/Management');
const Story = require('../models/Story');

// --- EXPORTAR DADOS (GET) ---
router.get('/export', auth, async (req, res) => {
    try {
        console.log("Iniciando exportação de dados...");
        
        // Busca dados de todas as coleções em paralelo
        const [homeData, projects, management, stories] = await Promise.all([
            HomeContent.findOne(), // Geralmente é um documento único
            Project.find(),
            Management.find(),
            Story.find()
        ]);

        // Monta o objeto final
        const backupData = {
            metadata: {
                exportDate: new Date(),
                version: "1.0"
            },
            data: {
                homeContent: homeData,
                projects: projects,
                management: management,
                stories: stories
            }
        };

        // Envia como download de arquivo JSON
        const fileName = `backup_projeto_esperanca_${new Date().toISOString().split('T')[0]}.json`;
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(backupData, null, 2));

    } catch (err) {
        console.error("Erro na exportação:", err);
        res.status(500).json({ msg: 'Erro ao gerar arquivo de exportação.' });
    }
});

// --- IMPORTAR DADOS (POST) ---
router.post('/import', auth, async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ msg: 'Estrutura do arquivo inválida.' });
        }

        console.log("Iniciando importação de dados...");

        // 1. Limpar coleções atuais (Estratégia: Wipe & Replace)
        // Isso garante que não haja duplicatas
        await Promise.all([
            HomeContent.deleteMany({}),
            Project.deleteMany({}),
            Management.deleteMany({}),
            Story.deleteMany({})
        ]);

        // 2. Inserir novos dados
        // Usamos insertMany para arrays e create/save para objeto único
        const promises = [];

        if (data.homeContent) {
            // Remove o _id para o Mongo gerar um novo ou manter compatibilidade se necessário
            delete data.homeContent._id; 
            promises.push(new HomeContent(data.homeContent).save());
        }

        if (data.projects && data.projects.length > 0) {
            promises.push(Project.insertMany(data.projects));
        }

        if (data.management && data.management.length > 0) {
            promises.push(Management.insertMany(data.management));
        }

        if (data.stories && data.stories.length > 0) {
            promises.push(Story.insertMany(data.stories));
        }

        await Promise.all(promises);

        console.log("Importação concluída com sucesso.");
        res.json({ msg: 'Dados importados com sucesso!' });

    } catch (err) {
        console.error("Erro na importação:", err);
        res.status(500).json({ msg: 'Falha crítica ao importar dados. Verifique o formato do arquivo.' });
    }
});

module.exports = router;