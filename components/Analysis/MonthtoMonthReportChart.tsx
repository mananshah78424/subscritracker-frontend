'use client';

import React, { useEffect, useState } from 'react';
import SubscriptionChart from '../Charts/lineChart';
import { fetchMonthtoMonthReport, MonthlyReportResponse, MonthtoMonthReportResponse } from '../../utils/monthly-report';

export default function MonthtoMonthReportChart() {
  const [monthToMonthReport, setMonthToMonthReport] = useState<MonthtoMonthReportResponse | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMonthlyReport = async () => {
      try {
        setLoading(true);
        const result = await fetchMonthtoMonthReport();
        
        if (result.data) {
          console.log("Got the month-to-month report as", result.data);
          setMonthToMonthReport(result.data);
        } else if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch month-to-month report');
      } finally {
        setLoading(false);
      }
    };

    getMonthlyReport();
  }, []);

  // Transform API data to work with SubscriptionChart
  const transformMonthlyData = (data: MonthtoMonthReportResponse) => {
    return data.subscriptions.map(item => ({
      subscription: `Subscription ${item.subscription_channel_id}`,
      cost: item.cost,
    }));
  };

  // Create chart configuration for the monthly report
  const monthlyChartConfig = {
    data: monthToMonthReport ? transformMonthlyData(monthToMonthReport) : [],
      title: `Monthly Subscription Costs Breakdown for ${monthToMonthReport?.subscriptions[0]?.
        month || 'Current Month'}`,
    description: "",
    xAxisKey: "subscription",
    lineKeys: ['cost'],
    yAxisPrefix: "$",
    height: 350,
    chartType: "bar", // Use bar chart for individual subscription costs
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mt-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
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

  if (!monthToMonthReport || monthToMonthReport.subscriptions.length === 0) {
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

  return (
    <div className="flex flex-row bg-white p-6 h-[600px]">
      {/* Summary Cards Row */}
      <div className='w-1/3 mr-[20px]'>
        <div className='flex flex-col gap-4 h-full'>
          <div className='bg-gray-50 rounded-lg p-6 text-center h-1/2 flex flex-col gap-[50px]'>
            <h3 className="text-gray-900 mb-4 text-[40px]">Total Cost</h3>
            <p className="text-2xl font-bold text-gray-900 text-[80px]">${monthToMonthReport.total_cost}</p>
          </div>


          <div className='bg-gray-50 rounded-lg p-6 text-center h-1/2 flex flex-col gap-[50px]'>
            <h3 className="text-gray-900 mb-4 text-[40px]">Active Subscriptions</h3>
            <p className="text-2xl font-bold text-gray-900 text-[80px]">{monthToMonthReport.subscriptions.length}</p>
          </div>
          
          
        </div>
      
      </div>
      <div className='w-2/3'>
      <div className='flex flex-col'>
        <p className='text-[40px] pl-6'>Monthly Analysis for {monthToMonthReport.subscriptions?.[0]?.month}</p>
      <div className="p-6">
        <SubscriptionChart {...monthlyChartConfig} />
      </div>
      </div>
      </div>
      
      
    </div>
  );
} 