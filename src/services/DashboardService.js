const { db } = require('../config/database');

class DashboardService {
    async getDashboardStats() {
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            // Formatando datas para SQLite (YYYY-MM-DD HH:MM:SS)
            const todayStart = new Date(today).setHours(0, 0, 0, 0);
            const todayEnd = new Date(today).setHours(23, 59, 59, 999);
            const yesterdayStart = new Date(yesterday).setHours(0, 0, 0, 0);
            const yesterdayEnd = new Date(yesterday).setHours(23, 59, 59, 999);

            // Converter para formato de string para SQLite
            const todayStartStr = new Date(todayStart).toISOString();
            const todayEndStr = new Date(todayEnd).toISOString();
            const yesterdayStartStr = new Date(yesterdayStart).toISOString();
            const yesterdayEndStr = new Date(yesterdayEnd).toISOString();

            // Executar todas as consultas em paralelo
            const [
                todaySales,
                yesterdaySales,
                totalSales,
                todayOrders,
                yesterdayOrders,
                totalOrders,
                cancelledOrders
            ] = await Promise.all([
                this.getTodaySales(todayStartStr, todayEndStr),
                this.getYesterdaySales(yesterdayStartStr, yesterdayEndStr),
                this.getTotalSales(),
                this.getTodayOrders(todayStartStr, todayEndStr),
                this.getYesterdayOrders(yesterdayStartStr, yesterdayEndStr),
                this.getTotalOrders(),
                this.getCancelledOrders()
            ]);

            // Calcular mudanças percentuais
            const salesChange = yesterdaySales > 0 
                ? ((todaySales - yesterdaySales) / yesterdaySales * 100)
                : 0;

            const ordersChange = yesterdayOrders > 0 
                ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100)
                : 0;

            // Calcular ticket médio
            const averageTicket = todayOrders > 0 ? (todaySales / todayOrders) : 0;
            const yesterdayAverage = yesterdayOrders > 0 ? (yesterdaySales / yesterdayOrders) : 0;
            const ticketChange = yesterdayAverage > 0 
                ? ((averageTicket - yesterdayAverage) / yesterdayAverage * 100)
                : 0;

            return {
                todaySales: Number(todaySales.toFixed(2)),
                salesChange: Number(salesChange.toFixed(1)),
                totalSales: Number(totalSales.toFixed(2)),
                todayOrders,
                ordersChange: Number(ordersChange.toFixed(1)),
                averageTicket: Number(averageTicket.toFixed(2)),
                ticketChange: Number(ticketChange.toFixed(1)),
                totalOrders,
                cancelledOrders
            };

        } catch (error) {
            throw new Error(`Erro ao buscar estatísticas do dashboard: ${error.message}`);
        }
    }

    getTodaySales(todayStart, todayEnd) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(total_amount), 0) as todaySales 
                FROM orders 
                WHERE status != 'cancelled' 
                AND created_at BETWEEN ? AND ?
            `, [todayStart, todayEnd], (err, row) => {
                if (err) reject(err);
                else resolve(row.todaySales);
            });
        });
    }

    getYesterdaySales(yesterdayStart, yesterdayEnd) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(total_amount), 0) as yesterdaySales 
                FROM orders 
                WHERE status != 'cancelled' 
                AND created_at BETWEEN ? AND ?
            `, [yesterdayStart, yesterdayEnd], (err, row) => {
                if (err) reject(err);
                else resolve(row.yesterdaySales);
            });
        });
    }

    getTotalSales() {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(total_amount), 0) as totalSales 
                FROM orders 
                WHERE status != 'cancelled'
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row.totalSales);
            });
        });
    }

    getTodayOrders(todayStart, todayEnd) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as todayOrders 
                FROM orders 
                WHERE status != 'cancelled' 
                AND created_at BETWEEN ? AND ?
            `, [todayStart, todayEnd], (err, row) => {
                if (err) reject(err);
                else resolve(row.todayOrders);
            });
        });
    }

    getYesterdayOrders(yesterdayStart, yesterdayEnd) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as yesterdayOrders 
                FROM orders 
                WHERE status != 'cancelled' 
                AND created_at BETWEEN ? AND ?
            `, [yesterdayStart, yesterdayEnd], (err, row) => {
                if (err) reject(err);
                else resolve(row.yesterdayOrders);
            });
        });
    }

    getTotalOrders() {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as totalOrders 
                FROM orders 
                WHERE status != 'cancelled'
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row.totalOrders);
            });
        });
    }

    getCancelledOrders() {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as cancelledOrders 
                FROM orders 
                WHERE status = 'cancelled'
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row.cancelledOrders);
            });
        });
    }
}

module.exports = new DashboardService(); 