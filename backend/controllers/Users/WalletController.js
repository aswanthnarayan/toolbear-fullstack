import Wallet from '../../models/WalletSchema.js';
import Order from '../../models/OrderSchema.js';

// Get wallet details
export const getWallet = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
    }

    // Get total count of transactions
    const totalTransactions = wallet.transactions.length;

    // Get paginated transactions in reverse order
    const reversedTransactions = [...wallet.transactions].reverse();
    const paginatedTransactions = reversedTransactions.slice(skip, skip + limit);

    res.status(200).json({
      balance: wallet.balance,
      transactions: paginatedTransactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTransactions / limit),
        totalTransactions,
        hasMore: skip + limit < totalTransactions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet details', error: error.message });
  }
};

// API endpoint for processing refund
export const processOrderRefund = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, amount } = req.body;

    // Find or create wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
    }

    // Add refund transaction
    wallet.transactions.push({
      type: 'refund',
      amount: amount,
      description: `Refund for cancelled order #${orderId}`,
      orderId: orderId,
      date: new Date()
    });

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save();

    res.status(200).json(wallet);
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ message: 'Error processing refund', error: error.message });
  }
};