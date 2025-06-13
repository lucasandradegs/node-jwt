// Script para demonstrar autenticação nas APIs
// Execute com: node src/scripts/testAuth.js

console.log('🔐 Autenticação JWT - Todas as Rotas Protegidas');
console.log('===============================================\n');

console.log('📝 Resumo da Proteção:');
console.log('✅ Dashboard - Token obrigatório');
console.log('✅ Orders - Token obrigatório');
console.log('✅ Products - Token obrigatório (ADMIN para modificações)');
console.log('✅ Users - Token obrigatório (já estava protegido)');
console.log('🔓 Auth - Login/Register SEM token (acesso público)\n');

console.log('🎯 Como usar:');
console.log('1. Primeiro faça login para obter o token');
console.log('2. Use o token no header Authorization das próximas requisições\n');

console.log('📝 1. Fazer Login (obter token):');
console.log(`curl -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username": "admin", "password": "admin123"}'`);

console.log('\n📄 Resposta esperada do login:');
console.log(`{
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`);

console.log('\n🔑 2. Usar o token nas outras rotas:');

console.log('\n📊 Dashboard (requer token):');
console.log(`curl -X GET http://localhost:3001/api/dashboard/stats \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI"`);

console.log('\n📦 Listar produtos (requer token):');
console.log(`curl -X GET http://localhost:3001/api/products \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI"`);

console.log('\n➕ Criar produto (requer token + ADMIN):');
console.log(`curl -X POST http://localhost:3001/api/products \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\
  -d '{"name": "Novo Produto", "price": 15.99}'`);

console.log('\n📋 Listar pedidos (requer token):');
console.log(`curl -X GET http://localhost:3001/api/orders \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI"`);

console.log('\n➕ Criar pedido (requer token):');
console.log(`curl -X POST http://localhost:3001/api/orders \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\
  -d '{
    "user_id": 1,
    "total_amount": 35.50,
    "items": [
      {
        "product_name": "Pizza Margherita",
        "quantity": 1,
        "unit_price": 25.99,
        "total_price": 25.99
      }
    ]
  }'`);

console.log('\n👤 Ver perfil (requer token):');
console.log(`curl -X GET http://localhost:3001/api/users/profile \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI"`);

console.log('\n⚠️ Níveis de Acesso:');
console.log('🟢 Qualquer usuário autenticado:');
console.log('   - Ver dashboard, produtos, pedidos, perfil');
console.log('   - Criar pedidos');
console.log('   - Ver pedidos específicos');
console.log('');
console.log('🔴 Apenas ADMIN:');
console.log('   - Criar, editar, deletar produtos');
console.log('   - Ver todos os usuários');
console.log('   - Alterar roles de usuários');

console.log('\n❌ Erros comuns:');
console.log('- 401: Token não fornecido ou inválido');
console.log('- 403: Token válido, mas sem permissão (não é ADMIN)');
console.log('- 500: Erro de configuração (JWT_SECRET não definido)');

console.log('\n🎯 Exemplo completo de uso:');
console.log('# 1. Login');
console.log('TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"username": "admin", "password": "admin123"}\' | jq -r \'.token\')');
console.log('');
console.log('# 2. Usar token');
console.log('curl -X GET http://localhost:3001/api/dashboard/stats \\');
console.log('  -H "Authorization: Bearer $TOKEN"');

module.exports = {}; 