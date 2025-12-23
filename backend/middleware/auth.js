const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Ler o token do header
    const token = req.header('x-auth-token');

    // Verificar se não há token
    if (!token) {
        return res.status(401).json({ msg: 'Sem token, autorização negada' });
    }

    // Verificar token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token inválido' });
    }
};