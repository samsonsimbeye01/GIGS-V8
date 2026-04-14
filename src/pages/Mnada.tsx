import React, { useState, useEffect } from 'react';

const LiveAuction = () => {
    const [bids, setBids] = useState([]);
    const [currentBid, setCurrentBid] = useState(0);
    const [newBid, setNewBid] = useState(0);

    useEffect(() => {
        // Fetch initial bids from API or real-time source
        fetchBids();
    }, []);

    const fetchBids = async () => {
        // Implementation for fetching bids (this could be replaced with a real-time subscription)
        const response = await fetch('/api/bids'); // Example API endpoint
        const data = await response.json();
        setBids(data);
        setCurrentBid(data.length > 0 ? Math.max(...data.map(bid => bid.amount)) : 0);
    };

    const placeBid = async () => {
        if (newBid > currentBid) {
            // Call API to place a new bid
            const response = await fetch('/api/bids', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ amount: newBid }),
            });
            if (response.ok) {
                setNewBid(0);
                fetchBids();  // Refresh bids after placing a new bid
            }
        } else {
            alert('Your bid must be higher than the current bid!');
        }
    };

    return (
        <div>
            <h1>Live Auction</h1>
            <h2>Current Bid: ${currentBid}</h2>
            <div>
                <input 
                    type="number" 
                    value={newBid} 
                    onChange={(e) => setNewBid(Number(e.target.value))} 
                    placeholder="Enter your bid" 
                />
                <button onClick={placeBid}>Place Bid</button>
            </div>
            <h3>Bid History</h3>
            <ul>
                {bids.map((bid, index) => (
                    <li key={index}>${bid.amount} by {bid.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default LiveAuction;