import React from 'react';
import './Wallet.css'; // Assuming a CSS file for styling

const Wallet = () => {
    const [balance, setBalance] = React.useState(0);
    const [escrowFunds, setEscrowFunds] = React.useState(0);
    const [transactions, setTransactions] = React.useState([]);

    React.useEffect(() => {
        // Fetch balance and transaction data from API (mock implementation)
        const fetchData = async () => {
            // Replace the URL with the actual endpoint
            const response = await fetch('/api/wallet');
            const data = await response.json();
            setBalance(data.balance);
            setEscrowFunds(data.escrowFunds);
            setTransactions(data.transactions);
        };
        fetchData();
    }, []);

    const handleWithdraw = () => {
        // Handle withdrawal logic
        alert('Withdrawal process initiated.');
    };

    return (
        <div className="wallet-page">
            <h1>Your Wallet</h1>
            <div className="wallet-balance">
                <h2>Balance: ${balance.toFixed(2)}</h2>
                <h3>Escrow Funds: ${escrowFunds.toFixed(2)}</h3>
            </div>
            <h2>Transaction Ledger</h2>
            <ul className="transaction-list">
                {transactions.map((transaction, index) => (
                    <li key={index}>{transaction.description} - ${transaction.amount.toFixed(2)}</li>
                ))}
            </ul>
            <button className="withdraw-button" onClick={handleWithdraw}>Withdraw Funds</button>
        </div>
    );
};

export default Wallet;