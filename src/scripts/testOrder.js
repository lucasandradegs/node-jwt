// Script para testar a criação de pedidos
// Execute com: node src/scripts/testOrder.js

const orderExample = {
    user_id: 1,
    total_amount: 85.50,
    items: [
        {
            product_name: "Pizza Margherita",
            quantity: 2,
            unit_price: 25.00,
            total_price: 50.00
        },
        {
            product_name: "Refrigerante 2L",
            quantity: 1,
            unit_price: 8.50,
            total_price: 8.50
        },
        {
            product_name: "Batata Frita Grande",
            quantity: 1,
            unit_price: 27.00,
            total_price: 27.00
        }
    ]
};

console.log('Exemplo de pedido para testar:');
console.log(JSON.stringify(orderExample, null, 2));

console.log('\n🔗 Endpoints disponíveis:');
console.log('GET    /api/orders                    - Listar todos os pedidos (com paginação)');
console.log('POST   /api/orders                    - Criar pedido');
console.log('GET    /api/orders/:id               - Buscar pedido por ID');
console.log('GET    /api/orders/user/:userId      - Buscar pedidos do usuário');
console.log('PATCH  /api/orders/:id/status        - Atualizar status do pedido');

console.log('\n📋 Parâmetros de consulta para GET /api/orders:');
console.log('- page: número da página (padrão: 1)');
console.log('- limit: itens por página (padrão: 10, máx: 100)');
console.log('- status: filtrar por status (opcional)');

console.log('\n📋 Status válidos para pedidos:');
console.log('- pending (padrão)');
console.log('- confirmed');
console.log('- preparing');
console.log('- ready');
console.log('- delivered');
console.log('- cancelled');

console.log('\n💡 Exemplos de uso com curl:');

console.log('\n📝 Criar pedido:');
console.log(`curl -X POST http://localhost:3001/api/orders \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(orderExample)}'`);

console.log('\n📄 Listar todos os pedidos:');
console.log('curl -X GET http://localhost:3001/api/orders');

console.log('\n📄 Listar com paginação:');
console.log('curl -X GET "http://localhost:3001/api/orders?page=1&limit=5"');

console.log('\n📄 Filtrar por status:');
console.log('curl -X GET "http://localhost:3001/api/orders?status=pending"');

console.log('\n📄 Combinar filtros:');
console.log('curl -X GET "http://localhost:3001/api/orders?page=1&limit=3&status=delivered"');

console.log('\n🔄 Atualizar status:');
console.log(`curl -X PATCH http://localhost:3001/api/orders/1/status \\
  -H "Content-Type: application/json" \\
  -d '{"status": "confirmed"}'`); 