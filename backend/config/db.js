const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/projeto_esperanca');
        console.log('MongoDB Conectado...');
    } catch (err) {
        console.error('Erro ao conectar no MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;