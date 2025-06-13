const productService = require('../services/ProductService');

class ProductController {
    async createProduct(req, res) {
        try {
            const productData = req.body;
            const result = await productService.createProduct(productData);
            res.status(201).json(result);
        } catch (error) {
            if (error.message === 'Nome do produto é obrigatório' ||
                error.message === 'Preço deve ser um número maior que zero' ||
                error.message === 'Já existe um produto com este nome') {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao criar produto:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.json(products);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            res.json(product);
        } catch (error) {
            if (error.message === 'Produto não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const result = await productService.updateProduct(id, updateData);
            res.json(result);
        } catch (error) {
            if (error.message === 'Produto não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('É necessário fornecer') || 
                error.message.includes('não pode estar vazio') ||
                error.message.includes('deve ser um número')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao atualizar produto:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const result = await productService.deleteProduct(id);
            res.json(result);
        } catch (error) {
            if (error.message === 'Produto não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'Não é possível deletar produto que já foi usado em pedidos') {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao deletar produto:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}

module.exports = new ProductController(); 