const { db } = require('../config/database');

function seedDashboardData() {
    console.log('Inserindo dados de exemplo...');
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Inserir alguns pedidos de hoje
    const todayOrders = [
        { user_id: 1, total_amount: 45.99, status: 'delivered', created_at: today.toISOString() },
        { user_id: 1, total_amount: 32.50, status: 'confirmed', created_at: today.toISOString() },
        { user_id: 1, total_amount: 18.75, status: 'delivered', created_at: today.toISOString() },
        { user_id: 1, total_amount: 67.20, status: 'preparing', created_at: today.toISOString() },
        { user_id: 1, total_amount: 89.99, status: 'delivered', created_at: today.toISOString() }
    ];
    
    // Inserir alguns pedidos de ontem
    const yesterdayOrders = [
        { user_id: 1, total_amount: 23.40, status: 'delivered', created_at: yesterday.toISOString() },
        { user_id: 1, total_amount: 56.80, status: 'delivered', created_at: yesterday.toISOString() },
        { user_id: 1, total_amount: 34.20, status: 'delivered', created_at: yesterday.toISOString() },
        { user_id: 1, total_amount: 12.50, status: 'cancelled', created_at: yesterday.toISOString() }
    ];
    
    // Inserir alguns pedidos históricos
    const historicalOrders = [
        { user_id: 1, total_amount: 78.90, status: 'delivered', created_at: oneWeekAgo.toISOString() },
        { user_id: 1, total_amount: 45.60, status: 'delivered', created_at: oneWeekAgo.toISOString() },
        { user_id: 1, total_amount: 123.45, status: 'delivered', created_at: oneWeekAgo.toISOString() },
        { user_id: 1, total_amount: 89.99, status: 'cancelled', created_at: oneWeekAgo.toISOString() }
    ];
    
    const allOrders = [...todayOrders, ...yesterdayOrders, ...historicalOrders];
    
    db.serialize(() => {
        // Limpar dados existentes se houver
        db.run('DELETE FROM order_items');
        db.run('DELETE FROM orders');
        
        // Inserir pedidos
        const stmt = db.prepare(`
            INSERT INTO orders (user_id, total_amount, status, created_at) 
            VALUES (?, ?, ?, ?)
        `);
        
        allOrders.forEach(order => {
            stmt.run([order.user_id, order.total_amount, order.status, order.created_at]);
        });
        
        stmt.finalize();
        
        console.log('Dados de exemplo inseridos com sucesso!');
    });
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
    seedDashboardData();
}

module.exports = { seedDashboardData }; 