const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HomeContent = require('../models/HomeContent');
const Project = require('../models/Project');
const Management = require('../models/Management');
const Story = require('../models/Story');

// --- HOME ---
router.get('/home', async (req, res) => {
    try {
        // Retorna o primeiro documento ou cria um vazio
        let content = await HomeContent.findOne();
        if(!content) content = new HomeContent();
        res.json(content);
    } catch (err) { res.status(500).send('Erro'); }
});

router.put('/home', auth, async (req, res) => {
    try {
        let content = await HomeContent.findOne();
        if (!content) content = new HomeContent();
        
        // Atualiza campos
        const { whoWeAre, learnMoreVideo, results, partners } = req.body;
        if(whoWeAre) content.whoWeAre = whoWeAre;
        if(learnMoreVideo) content.learnMoreVideo = learnMoreVideo;
        if(results) content.results = results;
        if(partners) content.partners = partners;

        await content.save();
        res.json(content);
    } catch (err) { res.status(500).send('Erro ao atualizar Home'); }
});

// --- PROJETOS ---
router.get('/projects', async (req, res) => res.json(await Project.find().sort({ createdAt: -1 })));

router.post('/projects', auth, async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const project = await newProject.save();
        res.json(project);
    } catch (err) { res.status(500).send('Erro ao criar projeto'); }
});

router.put('/projects/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(project);
    } catch (err) { res.status(500).send('Erro ao atualizar projeto'); }
});

router.delete('/projects/:id', auth, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Projeto removido' });
    } catch (err) { res.status(500).send('Erro ao remover projeto'); }
});

// --- GESTÃO (Apenas Leitura e Edição, sem Delete/Create para o usuário final, mas o admin pode editar) ---
router.get('/management', async (req, res) => res.json(await Management.find()));

router.put('/management/:id', auth, async (req, res) => {
    try {
        // Permite editar apenas nome e imagem, mantendo cargo fixo
        const { name, image } = req.body;
        const member = await Management.findByIdAndUpdate(req.params.id, { $set: { name, image } }, { new: true });
        res.json(member);
    } catch (err) { res.status(500).send('Erro ao atualizar membro'); }
});

// --- HISTÓRIAS ---
router.get('/stories', async (req, res) => res.json(await Story.find().sort({ createdAt: -1 })));

router.get('/stories/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if(!story) return res.status(404).json({ msg: 'História não encontrada' });
        res.json(story);
    } catch (err) { res.status(500).send('Erro ao buscar história'); }
});

router.post('/stories', auth, async (req, res) => {
    try {
        const newStory = new Story(req.body);
        const story = await newStory.save();
        res.json(story);
    } catch (err) { res.status(500).send('Erro ao criar história'); }
});

router.put('/stories/:id', auth, async (req, res) => {
    try {
        const { title, videoUrl, description } = req.body;
        const story = await Story.findByIdAndUpdate(req.params.id, { $set: { title, videoUrl, description } }, { new: true });
        res.json(story);
    } catch (err) { res.status(500).send('Erro ao atualizar história'); }
});

router.delete('/stories/:id', auth, async (req, res) => {
    try {
        await Story.findByIdAndDelete(req.params.id);
        res.json({ msg: 'História removida' });
    } catch (err) { res.status(500).send('Erro ao remover história'); }
});

module.exports = router;