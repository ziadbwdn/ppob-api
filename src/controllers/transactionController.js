// TransactionController
class TransactionController {
    // Helper method to generate invoice number
    generateInvoiceNumber() {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `INV${dateStr}-${randomNum}`;
    }
  
    // GET /balance
    async getBalance(req, res, next) {
      try {
        const userId = req.user.id;
        
        const query = 'SELECT balance FROM users WHERE id = ?';
        const [users] = await pool.execute(query, [userId]);
        
        const balance = users[0]?.balance || 0;
  
        res.status(200).json({
          status: 0,
          message: 'Get Balance Berhasil',
          data: {
            balance: Number(balance)
          }
        });
      } catch (error) {
        next(error);
      }
    }
  
    // POST /topup
    async topup(req, res, next) {
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        const { top_up_amount } = req.validatedData;
        const userId = req.user.id;
  
        // Get current balance
        const [users] = await connection.execute(
          'SELECT balance FROM users WHERE id = ? FOR UPDATE',
          [userId]
        );
        
        const currentBalance = Number(users[0].balance);
        const newBalance = currentBalance + Number(top_up_amount);
  
        // Update user balance
        await connection.execute(
          'UPDATE users SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newBalance, userId]
        );
  
        // Generate invoice number
        const invoiceNumber = this.generateInvoiceNumber();
  
        // Insert transaction record
        const transactionQuery = `
          INSERT INTO transactions 
          (user_id, invoice_number, transaction_type, description, total_amount, balance_before, balance_after)
          VALUES (?, ?, 'TOPUP', 'Top Up balance', ?, ?, ?)
        `;
        
        await connection.execute(transactionQuery, [
          userId, invoiceNumber, top_up_amount, currentBalance, newBalance
        ]);
  
        await connection.commit();
  
        res.status(200).json({
          status: 0,
          message: 'Top Up Balance berhasil',
          data: {
            balance: newBalance
          }
        });
      } catch (error) {
        await connection.rollback();
        next(error);
      } finally {
        connection.release();
      }
    }
  
    // POST /transaction
    async makeTransaction(req, res, next) {
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        const { service_code } = req.validatedData;
        const userId = req.user.id;
  
        // Get service details
        const [services] = await connection.execute(
          'SELECT service_name, service_tariff FROM services WHERE service_code = ? AND is_active = TRUE',
          [service_code]
        );
  
        if (services.length === 0) {
          await connection.rollback();
          return res.status(400).json({
            status: 102,
            message: 'Service atau Layanan tidak ditemukan',
            data: null
          });
        }
  
        const service = services[0];
        const transactionAmount = Number(service.service_tariff);
  
        // Get current balance with row lock
        const [users] = await connection.execute(
          'SELECT balance FROM users WHERE id = ? FOR UPDATE',
          [userId]
        );
        
        const currentBalance = Number(users[0].balance);
  
        // Check if balance is sufficient
        if (currentBalance < transactionAmount) {
          await connection.rollback();
          return res.status(400).json({
            status: 102,
            message: 'Saldo tidak mencukupi',
            data: null
          });
        }
  
        const newBalance = currentBalance - transactionAmount;
  
        // Update user balance
        await connection.execute(
          'UPDATE users SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newBalance, userId]
        );
  
        // Generate invoice number
        const invoiceNumber = this.generateInvoiceNumber();
  
        // Insert transaction record
        const transactionQuery = `
          INSERT INTO transactions 
          (user_id, invoice_number, transaction_type, description, total_amount, service_code, service_name, balance_before, balance_after)
          VALUES (?, ?, 'PAYMENT', ?, ?, ?, ?, ?, ?)
        `;
        
        await connection.execute(transactionQuery, [
          userId, invoiceNumber, service.service_name, transactionAmount, 
          service_code, service.service_name, currentBalance, newBalance
        ]);
  
        await connection.commit();
  
        res.status(200).json({
          status: 0,
          message: 'Transaksi berhasil',
          data: {
            invoice_number: invoiceNumber,
            service_code: service_code,
            service_name: service.service_name,
            transaction_type: 'PAYMENT',
            total_amount: transactionAmount,
            created_on: new Date().toISOString()
          }
        });
      } catch (error) {
        await connection.rollback();
        next(error);
      } finally {
        connection.release();
      }
    }
  
    // GET /transaction/history
    async getTransactionHistory(req, res, next) {
      try {
        const userId = req.user.id;
        const offset = parseInt(req.query.offset) || 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
  
        let query = `
          SELECT invoice_number, transaction_type, description, total_amount, created_at as created_on
          FROM transactions 
          WHERE user_id = ? 
          ORDER BY created_at DESC
        `;
        
        const params = [userId];
  
        if (limit !== null) {
          query += ' LIMIT ? OFFSET ?';
          params.push(limit, offset);
        } else if (offset > 0) {
          query += ' LIMIT 18446744073709551615 OFFSET ?';
          params.push(offset);
        }
  
        const [transactions] = await pool.execute(query, params);
  
        // Format the response data
        const formattedTransactions = transactions.map(transaction => ({
          invoice_number: transaction.invoice_number,
          transaction_type: transaction.transaction_type,
          description: transaction.description,
          total_amount: Number(transaction.total_amount),
          created_on: transaction.created_on.toISOString()
        }));
  
        res.status(200).json({
          status: 0,
          message: 'Get History Berhasil',
          data: {
            offset: offset,
            limit: limit,
            records: formattedTransactions
          }
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new TransactionController();