const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET não está definido no arquivo .env');
        return res.status(500).json({ message: 'Erro de configuração do servidor' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

function authorizeRole(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Não autorizado' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        next();
    };
}

module.exports = {
    authenticateToken,
    authorizeRole
}; 