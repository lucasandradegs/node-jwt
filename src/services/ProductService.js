const { db } = require('../config/database');

class ProductService {
    async createProduct(productData) {
        return new Promise((resolve, reject) => {
            // Validações
            if (!productData.name || productData.name.trim() === '') {
                return reject(new Error('Nome do produto é obrigatório'));
            }

            if (!productData.price || productData.price <= 0 || isNaN(productData.price)) {
                return reject(new Error('Preço deve ser um número maior que zero'));
            }

            const name = productData.name.trim();
            const price = parseFloat(productData.price);

            // Verificar se já existe um produto com o mesmo nome
            db.get('SELECT id FROM products WHERE name = ?', [name], (err, existingProduct) => {
                if (err) {
                    reject(new Error(`Erro ao verificar produto existente: ${err.message}`));
                    return;
                }

                if (existingProduct) {
                    reject(new Error('Já existe um produto com este nome'));
                    return;
                }

                // Inserir novo produto
                const query = `
                    INSERT INTO products (name, price) 
                    VALUES (?, ?)
                `;

                db.run(query, [name, price], function(err) {
                    if (err) {
                        reject(new Error(`Erro ao criar produto: ${err.message}`));
                    } else {
                        // Buscar o produto criado para retornar
                        db.get('SELECT id, name, price, created_at, updated_at FROM products WHERE id = ?', 
                               [this.lastID], 
                               (err, newProduct) => {
                            if (err) {
                                reject(new Error(`Erro ao buscar produto criado: ${err.message}`));
                            } else {
                                resolve({
                                    ...newProduct,
                                    message: 'Produto criado com sucesso'
                                });
                            }
                        });
                    }
                });
            });
        });
    }

    async getAllProducts() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, name, price, created_at, updated_at
                FROM products 
                ORDER BY name ASC
            `;
            
            db.all(query, [], (err, products) => {
                if (err) {
                    reject(new Error(`Erro ao buscar produtos: ${err.message}`));
                } else {
                    resolve(products || []);
                }
            });
        });
    }

    async getProductById(productId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, name, price, created_at, updated_at
                FROM products 
                WHERE id = ?
            `;
            
            db.get(query, [productId], (err, product) => {
                if (err) {
                    reject(new Error(`Erro ao buscar produto: ${err.message}`));
                } else if (!product) {
                    reject(new Error('Produto não encontrado'));
                } else {
                    resolve(product);
                }
            });
        });
    }

    async updateProduct(productId, updateData) {
        return new Promise((resolve, reject) => {
            // Validações
            if (!updateData.name && !updateData.price) {
                return reject(new Error('É necessário fornecer pelo menos nome ou preço para atualizar'));
            }

            if (updateData.name && updateData.name.trim() === '') {
                return reject(new Error('Nome do produto não pode estar vazio'));
            }

            if (updateData.price && (updateData.price <= 0 || isNaN(updateData.price))) {
                return reject(new Error('Preço deve ser um número maior que zero'));
            }

            // Primeiro verificar se o produto existe
            this.getProductById(productId)
                .then(() => {
                    // Construir query dinâmica baseada nos campos fornecidos
                    let updateFields = [];
                    let values = [];

                    if (updateData.name) {
                        updateFields.push('name = ?');
                        values.push(updateData.name.trim());
                    }

                    if (updateData.price) {
                        updateFields.push('price = ?');
                        values.push(updateData.price);
                    }

                    updateFields.push('updated_at = CURRENT_TIMESTAMP');
                    values.push(productId);

                    const query = `
                        UPDATE products 
                        SET ${updateFields.join(', ')}
                        WHERE id = ?
                    `;

                    db.run(query, values, function(err) {
                        if (err) {
                            reject(new Error(`Erro ao atualizar produto: ${err.message}`));
                        } else {
                            // Buscar o produto atualizado para retornar
                            db.get('SELECT id, name, price, created_at, updated_at FROM products WHERE id = ?', 
                                   [productId], 
                                   (err, updatedProduct) => {
                                if (err) {
                                    reject(new Error(`Erro ao buscar produto atualizado: ${err.message}`));
                                } else {
                                    resolve({
                                        ...updatedProduct,
                                        message: 'Produto atualizado com sucesso'
                                    });
                                }
                            });
                        }
                    });
                })
                .catch(reject);
        });
    }

    async deleteProduct(productId) {
        return new Promise((resolve, reject) => {
            // Primeiro verificar se o produto existe
            this.getProductById(productId)
                .then((product) => {
                    // Verificar se o produto está sendo usado em algum pedido
                    db.get('SELECT COUNT(*) as count FROM order_items WHERE product_name = ?', 
                           [product.name], 
                           (err, result) => {
                        if (err) {
                            reject(new Error(`Erro ao verificar uso do produto: ${err.message}`));
                            return;
                        }

                        if (result.count > 0) {
                            reject(new Error('Não é possível deletar produto que já foi usado em pedidos'));
                            return;
                        }

                        // Deletar o produto
                        const query = 'DELETE FROM products WHERE id = ?';
                        
                        db.run(query, [productId], function(err) {
                            if (err) {
                                reject(new Error(`Erro ao deletar produto: ${err.message}`));
                            } else {
                                resolve({
                                    id: parseInt(productId),
                                    name: product.name,
                                    message: 'Produto deletado com sucesso'
                                });
                            }
                        });
                    });
                })
                .catch(reject);
        });
    }
}

module.exports = new ProductService(); 