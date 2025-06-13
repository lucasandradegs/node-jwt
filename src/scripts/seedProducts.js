const { db } = require('../config/database');

function seedProducts() {
    console.log('Inserindo produtos de exemplo no cardápio...');
    
    const products = [
        { name: 'Pizza Margherita', price: 25.99 },
        { name: 'Pizza Pepperoni', price: 28.99 },
        { name: 'Pizza Quatro Queijos', price: 32.99 },
        { name: 'Pizza Portuguesa', price: 30.99 },
        { name: 'Hambúrguer Clássico', price: 18.50 },
        { name: 'Hambúrguer Bacon', price: 22.90 },
        { name: 'Batata Frita Pequena', price: 12.00 },
        { name: 'Batata Frita Grande', price: 18.00 },
        { name: 'Refrigerante Lata', price: 5.50 },
        { name: 'Refrigerante 2L', price: 9.90 },
        { name: 'Suco Natural 500ml', price: 8.00 },
        { name: 'Água Mineral', price: 3.50 },
        { name: 'Lasanha Bolonhesa', price: 24.90 },
        { name: 'Salada Caesar', price: 16.90 },
        { name: 'Sobremesa Pudim', price: 8.50 }
    ];
    
    db.serialize(() => {
        // Limpar produtos existentes se houver
        db.run('DELETE FROM products');
        
        // Inserir produtos
        const stmt = db.prepare(`
            INSERT INTO products (name, price) 
            VALUES (?, ?)
        `);
        
        products.forEach(product => {
            stmt.run([product.name, product.price]);
        });
        
        stmt.finalize();
        
        console.log(`${products.length} produtos inseridos com sucesso!`);
        
        // Mostrar os produtos inseridos
        db.all('SELECT id, name, price FROM products ORDER BY name', [], (err, rows) => {
            if (!err && rows) {
                console.log('\n📋 Produtos no cardápio:');
                rows.forEach(product => {
                    console.log(`${product.id}. ${product.name} - R$ ${product.price}`);
                });
            }
        });
    });
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
    seedProducts();
}

module.exports = { seedProducts }; 