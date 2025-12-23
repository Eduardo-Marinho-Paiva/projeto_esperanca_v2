const mongoose = require('mongoose');

// Conteúdo único da Home
const HomeContentSchema = new mongoose.Schema({
    whoWeAre: {
        text: String,
        image: String
    },
    learnMoreVideo: String,
    results: {
        year: Number,
        stats: [{ title: String, count: Number }]
    },
    partners: [{ image: String }] // Array de URLs
});

module.exports = mongoose.model('HomeContent', HomeContentSchema);