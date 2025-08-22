
import {config} from "./config";
// [
// 	{
// 		"month": "January",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "February",
// 		"year": "2025",
// 		"total": 32
// 	},
// 	{
// 		"month": "March",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "April",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "May",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "June",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "July",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "August",
// 		"year": "2025",
// 		"total": 45
// 	},
// 	{
// 		"month": "September",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "October",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "November",
// 		"year": "2025",
// 		"total": 0
// 	},
// 	{
// 		"month": "December",
// 		"year": "2025",
// 		"total": 0
// 	}
// ]

export type MonthlyReportResponse = {
  month: string;
  year: string;
  cost: number;
}

export type MonthlySubscriptions = {
  month: string;
  year: string;
  subscription_channel_id: string;
  cost: number;
  status: string;
  next_due_date: string;
}

export type MonthtoMonthReportResponse = {
  subscriptions: MonthlySubscriptions[];
  total_cost: number;
}

export type MonthlyReportResult = {
  data?: MonthlyReportResponse[];
  error?: string;
}

export type MonthtoMonthReportResult = {
  data?: MonthtoMonthReportResponse;
  error?: string;
}

export const fetchMonthlyReport = async (): Promise<MonthlyReportResult> => {
  try {
    // Get token based on local storage or use the user object
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {
        error: 'No token found'
      }
    }

    const response = await fetch(`${config.api_url}/v1/analysis/monthly-report`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log("Failed to fetch monthly report", response);
      return {
        error: 'Failed to fetch monthly report'
      }
    }

    const data: MonthlyReportResponse[] = await response.json();
    return { data };
    
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export const fetchMonthtoMonthReport = async (): Promise<MonthtoMonthReportResult> => {
  try {
    // Get token based on local storage or use the user object
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {
        error: 'No token found'
      }
    }

    const response = await fetch(`${config.api_url}/v1/analysis/month-by-month-report`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log("Failed to fetch month-to-month report", response);
      return {
        error: 'Failed to fetch month-to-month report'
      }
    }

    const data: MonthtoMonthReportResponse = await response.json();
    return { data };
    
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}