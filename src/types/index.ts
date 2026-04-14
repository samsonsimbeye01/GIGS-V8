// src/types/index.ts

type Gig = {
    id: string;
    title: string;
    description: string;
    userId: string;
    auctionId: string;
};


type User = {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
};


type Auction = {
    id: string;
    gigId: string;
    startingBid: number;
    endDate: Date;
};


type Notification = {
    id: string;
    userId: string;
    message: string;
    createdAt: Date;
};


type Transaction = {
    id: string;
    gigId: string;
    userId: string;
    amount: number;
    createdAt: Date;
};

export type { Gig, User, Auction, Notification, Transaction };