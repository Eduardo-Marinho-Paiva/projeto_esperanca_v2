const mongoose = require('mongoose');

const ManagementSchema = new mongoose.Schema({
    role: { type: String, required: true }, // Ex: Presidente (Fixo)
    category: { type: String, required: true }, // Ex: coordenacao, eclesiastica, conselho
    name: String,
    image: String,
    isFixed: { type: Boolean, default: true } // Impede deleção via API
});

module.exports = mongoose.model('Management', ManagementSchema);