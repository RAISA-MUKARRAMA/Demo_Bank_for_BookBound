const express = require('express');
const router = express.Router();
const Transaction = require('../model/transactionSchema');
const Account = require('../model/accountSchema');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:7002';
const BOOKBOUND_URL = process.env.BOOKBOUND_SERVER_URL || "http://localhost:5002";

// Fetch all accounts
router.get('/getAccounts', async (req, res) => {
  try {
    console.log('Fetching all accounts');
    const accounts = await Account.find({}, 'accountNumber accountType balance -_id');
    res.json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Redirect to frontend transaction form
router.get('/', (req, res) => {
  const query = new URLSearchParams(req.query).toString();
  const redirectURL = `${FRONTEND_URL}/?${query}`;
  console.log('Redirecting to:', redirectURL);
  res.redirect(redirectURL);
});

// Handle transaction submission from frontend
router.post('/create', async (req, res) => {
  try {
    const {
      senderAccountNumber,
      senderPin,
      receiverAccountNumber,
      amount,
      type,
      purchaseId,
      email,
      bookIds // now expecting array
    } = req.body;

    if (!senderAccountNumber || !senderPin || !receiverAccountNumber || !amount || !type || !purchaseId || !email || !bookIds) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: 'bookIds must be a non-empty array.' });
    }

    // Find sender and receiver accounts
    const sender = await Account.findOne({ accountNumber: senderAccountNumber });
    const receiver = await Account.findOne({ accountNumber: receiverAccountNumber });

    if (!sender) return res.status(404).json({ message: 'Sender account not found.' });
    if (!receiver) return res.status(404).json({ message: 'Receiver account not found.' });

    // Verify PIN
    if (sender.pin !== senderPin) {
      return res.status(401).json({ message: 'Invalid PIN.' });
    }

    const n_amount = Number(amount);

    // Check sufficient balance
    if ((type === 'transfer' || type === 'withdraw') && sender.balance < n_amount) {
      return res.status(400).json({ message: 'Insufficient balance.' });
    }

    // Perform transaction logic
    if (type === 'transfer') {
      sender.balance -= n_amount;
      receiver.balance += n_amount;
    } else if (type === 'deposit') {
      receiver.balance += n_amount;
    } else if (type === 'withdraw') {
      sender.balance -= n_amount;
    }

    // Save updated balances
    await sender.save();
    await receiver.save();

    // Record transaction
    const transaction = new Transaction({
      senderAccount: sender._id,
      receiverAccount: receiver._id,
      amount: n_amount,
      transactionType: type,
    });
    await transaction.save();

    // Redirect back to BookBound backend with purchaseId and bookIds
    const redirectURL = `${BOOKBOUND_URL}/api/purchase/complete?purchaseId=${purchaseId}&status=completed&books=${bookIds.join(',')}`;

    return res.status(200).json({ 
      message: 'Transaction complete',
      redirectURL
    });

  } catch (err) {
    console.error('Transaction error:', err);

    // Redirect to BookBound backend with failed status
    const { purchaseId } = req.body;
    const redirectURL = `${BOOKBOUND_URL}/api/purchase/complete?purchaseId=${purchaseId}&status=failed`;
    return res.redirect(redirectURL);
  }
});

module.exports = router;
