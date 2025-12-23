const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    logo: String,
    title: { type: String, required: true },
    description: String,
    tags: [String],
    image: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);