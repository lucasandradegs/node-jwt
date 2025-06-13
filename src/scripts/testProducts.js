// Script para demonstrar o uso da API de produtos
// Execute com: node src/scripts/testProducts.js

console.log('🍕 API de Gerenciamento de Cardápio');
console.log('=====================================\n');

console.log('🔗 Endpoints disponíveis:');
console.log('GET    /api/products        - Listar todos os produtos');
console.log('POST   /api/products        - Criar novo produto');
console.log('GET    /api/products/:id    - Buscar produto por ID');
console.log('PATCH  /api/products/:id    - Atualizar produto (nome e/ou preço)');
console.log('DELETE /api/products/:id    - Deletar produto');

console.log('\n💡 Exemplos de uso com curl:');

console.log('\n📄 Listar todos os produtos:');
console.log('curl -X GET http://localhost:3001/api/products');

console.log('\n➕ Criar novo produto:');
console.log(`curl -X POST http://localhost:3001/api/products \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Pizza Calabresa", "price": 26.99}'`);

console.log('\n🔍 Buscar produto específico (ID 1):');
console.log('curl -X GET http://localhost:3001/api/products/1');

console.log('\n✏️ Atualizar apenas o nome:');
console.log(`curl -X PATCH http://localhost:3001/api/products/1 \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Pizza Margherita Premium"}'`);

console.log('\n💰 Atualizar apenas o preço:');
console.log(`curl -X PATCH http://localhost:3001/api/products/1 \\
  -H "Content-Type: application/json" \\
  -d '{"price": 29.99}'`);

console.log('\n🔄 Atualizar nome e preço:');
console.log(`curl -X PATCH http://localhost:3001/api/products/1 \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Pizza Margherita Especial", "price": 27.50}'`);

console.log('\n🗑️ Deletar produto:');
console.log('curl -X DELETE http://localhost:3001/api/products/16');

console.log('\n📋 Formato da resposta para GET /api/products:');
console.log(`[
  {
    "id": 1,
    "name": "Pizza Margherita",
    "price": 25.99,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Pizza Pepperoni",
    "price": 28.99,
    "created_at": "2024-01-15T10:31:00.000Z",
    "updated_at": "2024-01-15T10:31:00.000Z"
  }
]`);

console.log('\n📝 Formato da resposta para POST /api/products:');
console.log(`{
  "id": 16,
  "name": "Pizza Calabresa",
  "price": 26.99,
  "created_at": "2024-01-15T12:00:00.000Z",
  "updated_at": "2024-01-15T12:00:00.000Z",
  "message": "Produto criado com sucesso"
}`);

console.log('\n📝 Formato da resposta para PATCH:');
console.log(`{
  "id": 1,
  "name": "Pizza Margherita Premium",
  "price": 29.99,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T11:45:00.000Z",
  "message": "Produto atualizado com sucesso"
}`);

console.log('\n📝 Formato da resposta para DELETE:');
console.log(`{
  "id": 16,
  "name": "Pizza Calabresa",
  "message": "Produto deletado com sucesso"
}`);

console.log('\n⚠️ Regras de validação:');
console.log('- Nome é obrigatório e não pode estar vazio');
console.log('- Preço é obrigatório e deve ser maior que zero');
console.log('- Não é permitido criar produtos com nomes duplicados');
console.log('- Para atualização: pelo menos nome OU preço deve ser fornecido');
console.log('- Não é possível deletar produtos que já foram usados em pedidos');

console.log('\n📦 Exemplos de produtos para criar:');
console.log(`{
  "name": "Pizza Calabresa",
  "price": 26.99
}`);

console.log(`{
  "name": "Sanduíche Natural",
  "price": 12.50
}`);

console.log(`{
  "name": "Café Expresso",
  "price": 4.00
}`);

console.log('\n⚠️ Importante sobre deleção:');
console.log('- Produtos que já foram usados em pedidos NÃO podem ser deletados');
console.log('- Isso mantém a integridade dos dados históricos');
console.log('- Se precisar "remover" um produto, considere desativá-lo ao invés de deletar');

console.log('\n🚀 Para começar:');
console.log('1. Execute: node src/scripts/seedProducts.js (inserir dados de exemplo)');
console.log('2. Inicie o servidor: npm start');
console.log('3. Teste os endpoints com os exemplos acima!');

module.exports = {}; 