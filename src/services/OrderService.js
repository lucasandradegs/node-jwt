const { db } = require('../config/database');

class OrderService {
    async createOrder(orderData) {
        return new Promise((resolve, reject) => {
            // Validações básicas
            if (!orderData.user_id) {
                return reject(new Error('ID do usuário é obrigatório'));
            }
            
            if (!orderData.items || orderData.items.length === 0) {
                return reject(new Error('Pedido deve ter pelo menos um item'));
            }
            
            if (!orderData.total_amount || orderData.total_amount <= 0) {
                return reject(new Error('Total do pedido deve ser maior que zero'));
            }

            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                
                // Inserir pedido principal
                const orderQuery = `
                    INSERT INTO orders (user_id, total_amount, status) 
                    VALUES (?, ?, 'pending')
                `;
                
                db.run(orderQuery, [orderData.user_id, orderData.total_amount], function(err) {
                    if (err) {
                        db.run("ROLLBACK");
                        return reject(new Error(`Erro ao criar pedido: ${err.message}`));
                    }
                    
                    const orderId = this.lastID;
                    
                    // Inserir itens do pedido
                    const itemQuery = `
                        INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    
                    let completedItems = 0;
                    const totalItems = orderData.items.length;
                    let hasError = false;
                    
                    orderData.items.forEach(item => {
                        if (hasError) return;
                        
                        // Validar item
                        if (!item.product_name || !item.quantity || !item.unit_price || !item.total_price) {
                            db.run("ROLLBACK");
                            hasError = true;
                            return reject(new Error('Todos os campos do item são obrigatórios'));
                        }
                        
                        db.run(itemQuery, [
                            orderId,
                            item.product_name,
                            item.quantity,
                            item.unit_price,
                            item.total_price
                        ], function(err) {
                            if (err || hasError) {
                                if (!hasError) {
                                    db.run("ROLLBACK");
                                    hasError = true;
                                    return reject(new Error(`Erro ao inserir item: ${err.message}`));
                                }
                                return;
                            }
                            
                            completedItems++;
                            
                            if (completedItems === totalItems) {
                                db.run("COMMIT", (err) => {
                                    if (err) {
                                        return reject(new Error(`Erro ao confirmar transação: ${err.message}`));
                                    }
                                    resolve({ 
                                        id: orderId, 
                                        status: 'pending',
                                        message: 'Pedido criado com sucesso'
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    }

    async getAllOrders(options = {}) {
        return new Promise((resolve, reject) => {
            const { page = 1, limit = 10, status } = options;
            const offset = (page - 1) * limit;
            
            // Construir query base
            let query = `
                SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, o.updated_at
                FROM orders o
            `;
            
            let countQuery = `SELECT COUNT(*) as total FROM orders o`;
            let params = [];
            let countParams = [];
            
            // Adicionar filtro de status se fornecido
            if (status) {
                query += ` WHERE o.status = ?`;
                countQuery += ` WHERE o.status = ?`;
                params.push(status);
                countParams.push(status);
            }
            
            // Ordenação e paginação
            query += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);
            
            // Primeiro buscar o total de registros
            db.get(countQuery, countParams, (err, countResult) => {
                if (err) {
                    reject(new Error(`Erro ao contar pedidos: ${err.message}`));
                    return;
                }
                
                const total = countResult.total;
                const totalPages = Math.ceil(total / limit);
                
                // Buscar os pedidos
                db.all(query, params, (err, orders) => {
                    if (err) {
                        reject(new Error(`Erro ao buscar pedidos: ${err.message}`));
                    } else {
                        resolve({
                            orders: orders || [],
                            pagination: {
                                page: parseInt(page),
                                limit: parseInt(limit),
                                total,
                                totalPages,
                                hasNext: page < totalPages,
                                hasPrev: page > 1
                            }
                        });
                    }
                });
            });
        });
    }

    async getOrderById(orderId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, o.updated_at
                FROM orders o
                WHERE o.id = ?
            `;
            
            db.get(query, [orderId], (err, order) => {
                if (err) {
                    reject(new Error(`Erro ao buscar pedido: ${err.message}`));
                } else if (!order) {
                    reject(new Error('Pedido não encontrado'));
                } else {
                    // Buscar itens do pedido
                    const itemsQuery = `
                        SELECT id, product_name, quantity, unit_price, total_price
                        FROM order_items 
                        WHERE order_id = ?
                    `;
                    
                    db.all(itemsQuery, [orderId], (err, items) => {
                        if (err) {
                            reject(new Error(`Erro ao buscar itens do pedido: ${err.message}`));
                        } else {
                            resolve({
                                ...order,
                                items: items || []
                            });
                        }
                    });
                }
            });
        });
    }

    async getOrdersByUserId(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, total_amount, status, created_at, updated_at
                FROM orders 
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;
            
            db.all(query, [userId], (err, orders) => {
                if (err) {
                    reject(new Error(`Erro ao buscar pedidos do usuário: ${err.message}`));
                } else {
                    resolve(orders || []);
                }
            });
        });
    }

    async updateOrderStatus(orderId, newStatus) {
        return new Promise((resolve, reject) => {
            const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
            
            if (!validStatuses.includes(newStatus)) {
                return reject(new Error('Status inválido'));
            }

            const query = `
                UPDATE orders 
                SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            db.run(query, [newStatus, orderId], function(err) {
                if (err) {
                    reject(new Error(`Erro ao atualizar status do pedido: ${err.message}`));
                } else if (this.changes === 0) {
                    reject(new Error('Pedido não encontrado'));
                } else {
                    resolve({ 
                        id: orderId, 
                        status: newStatus,
                        message: 'Status do pedido atualizado com sucesso'
                    });
                }
            });
        });
    }
}

module.exports = new OrderService(); 