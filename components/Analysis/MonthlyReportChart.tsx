'use client';

import React, { useEffect, useState } from 'react';
import SubscriptionChart from '../Charts/lineChart';
import { fetchMonthlyReport, MonthlyReportResponse } from '../../utils/monthly-report';

export default function MonthlyReportChart() {
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMonthlyReport = async () => {
      try {
        setLoading(true);
        const result = await fetchMonthlyReport();
        
        if (result.data) {
          setMonthlyReport(result.data);
        } else if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch monthly report');
      } finally {
        setLoading(false);
      }
    };

    getMonthlyReport();
  }, []);

  // Transform API data to work with SubscriptionChart
  const transformMonthlyData = (data: MonthlyReportResponse[]) => {
    return data.map(item => ({
      month: item.month.substring(0, 3), // Convert "January" to "Jan"
        'Monthly Total': item.cost,
    }));
  };

  // Create chart configuration for the monthly report
  const monthlyChartConfig = {
    data: transformMonthlyData(monthlyReport),
    title: "Monthly Subscription Spending",
    description: "Track your subscription costs throughout the year",
    xAxisKey: "month",
    lineKeys: ['Monthly Total'],
    yAxisPrefix: "$",
    height: 300,
    summaryStats: monthlyReport.length > 0 ? [
      {
        label: 'Total Months',
        value: monthlyReport.length,
        description: 'Months tracked'
      },
      {
        label: 'Total Spending',
        value: `$${monthlyReport.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}`,
        description: 'Total annual cost'
      },
      {
        label: 'Highest Month',
        value: monthlyReport.reduce((max, item) => item.cost > max.cost ? item : max).month,
        description: 'Month with highest spending'
      },
      {
        label: 'Average Monthly',
        value: `$${(monthlyReport.reduce((sum, item) => sum + item.cost, 0) / monthlyReport.length).toFixed(2)}`,
        description: 'Average monthly spending'
      },
    ] : []
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Report</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (monthlyReport.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">No monthly report data found.</p>
      </div>
    );
  }

  return <SubscriptionChart {...monthlyChartConfig} />;
} 