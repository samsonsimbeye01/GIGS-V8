import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Target,
  Wallet,
  Calculator,
  CheckCircle,
  AlertCircle,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface DashboardStatsProps {
  responseRate: number;
  trustScore: number;
  aiAnalysis: {
    reliability: number;
    communication: number;
    skillLevel: number;
    punctuality: number;
  };
  earnings: {
    thisMonth: number;
    lastMonth: number;
    pending: number;
    available: number;
  };
  accountingData: {
    totalEarnings: number;
    totalGigs: number;
    avgRating: number;
    expenses: number;
    netIncome: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  responseRate,
  trustScore,
  aiAnalysis,
  earnings,
  accountingData
}) => {
  return (
    <>
      {/* Response Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Response Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Current Rate</span>
              <span className="font-bold text-2xl">{Math.round(responseRate)}%</span>
            </div>
            <Progress value={responseRate} className="h-3" />
            <p className="text-sm text-muted-foreground">
              You respond to messages within 2 hours on average
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Trust Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Trust Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Overall Score</span>
              <span className="font-bold text-2xl">{trustScore.toFixed(1)}/5.0</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Reliability</span>
                  <span>{aiAnalysis.reliability}%</span>
                </div>
                <Progress value={aiAnalysis.reliability} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Communication</span>
                  <span>{aiAnalysis.communication}%</span>
                </div>
                <Progress value={aiAnalysis.communication} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Skill Level</span>
                  <span>{aiAnalysis.skillLevel}%</span>
                </div>
                <Progress value={aiAnalysis.skillLevel} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Punctuality</span>
                  <span>{aiAnalysis.punctuality}%</span>
                </div>
                <Progress value={aiAnalysis.punctuality} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Payment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Available Balance</span>
              </div>
              <span className="font-bold text-green-600">TSH {earnings.available.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Pending Payments</span>
              </div>
              <span className="font-bold text-yellow-600">TSH {earnings.pending.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm">This Month</span>
              </div>
              <span className="font-bold text-blue-600">TSH {earnings.thisMonth.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounting Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="font-bold text-lg">TSH {accountingData.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className="font-bold text-lg">TSH {accountingData.netIncome.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Gigs Completed</span>
                <span className="font-medium">{accountingData.totalGigs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Rating</span>
                <span className="font-medium">{accountingData.avgRating}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Business Expenses</span>
                <span className="font-medium">TSH {accountingData.expenses.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardStats;