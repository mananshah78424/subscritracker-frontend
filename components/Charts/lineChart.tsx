'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/*
USAGE EXAMPLES:

// 1. Subscription Spending Chart
<SubscriptionChart
  data={subscriptionData}
  title="Monthly Subscription Spending"
  description="Track your subscription costs throughout the year"
  xAxisKey="month"
  lineKeys={['Netflix', 'Spotify', 'Gym', 'Total']}
  yAxisPrefix="$"
  height={400}
/>

// 2. Website Traffic Chart
<SubscriptionChart
  data={trafficData}
  title="Daily Website Traffic"
  description="Monitor your website performance"
  xAxisKey="date"
  lineKeys={['Visitors', 'PageViews', 'BounceRate']}
  yAxisSuffix="%"
  height={300}
/>

// 3. Sales Performance Chart
<SubscriptionChart
  data={salesData}
  title="Quarterly Sales Performance"
  description="Track revenue across different regions"
  xAxisKey="quarter"
  lineKeys={['North', 'South', 'East', 'West']}
  yAxisPrefix="$"
  yAxisSuffix="k"
  height={350}
/>

// 4. Simple Chart with Auto-stats
<SubscriptionChart
  data={simpleData}
  title="Simple Data Visualization"
  xAxisKey="period"
  lineKeys={['Value1', 'Value2']}
  height={250}
/>
*/

// Define the data structure
export interface ChartDataPoint {
  [key: string]: string | number;
}

// Define the component props
export interface SubscriptionChartProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
  xAxisKey: string; // The key for X-axis (e.g., 'month', 'date', 'week')
  lineKeys: string[]; // Array of keys for the lines to display
  colors?: string[]; // Custom colors for each line
  height?: number; // Chart height
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  yAxisPrefix?: string; // e.g., '$', '€', ''
  yAxisSuffix?: string; // e.g., 'k', 'M', ''
  tooltipFormatter?: (value: number) => string;
  summaryStats?: {
    label: string;
    value: string | number;
    description?: string;
  }[];
}

// Default colors for lines
const defaultColors = [
  '#e50914', // Netflix red
  '#1db954', // Spotify green
  '#3b82f6', // Blue
  '#f59e0b', // Orange
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f97316', // Orange
];

// Default tooltip formatter
const defaultTooltipFormatter = (value: number, prefix = '', suffix = '') => 
  `${prefix}${value.toFixed(2)}${suffix}`;

export default function SubscriptionChart({
  data,
  title = 'Chart Data',
  description = 'Visualize your data over time',
  xAxisKey,
  lineKeys,
  colors = defaultColors,
  height = 320,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  yAxisPrefix = '',
  yAxisSuffix = '',
  tooltipFormatter,
  summaryStats,
}: SubscriptionChartProps) {
  // Use custom tooltip formatter or default
  const formatTooltip = tooltipFormatter || 
    ((value: number) => [defaultTooltipFormatter(value, yAxisPrefix, yAxisSuffix), '']);

  // Calculate summary stats if not provided
  const calculatedStats = summaryStats || [
    {
      label: 'Total Items',
      value: data.length,
    },
    {
      label: 'Data Range',
      value: `${data[0]?.[xAxisKey]} - ${data[data.length - 1]?.[xAxisKey]}`,
    },
    {
      label: 'Lines Displayed',
      value: lineKeys.length,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            )}
            <XAxis 
              dataKey={xAxisKey}
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${yAxisPrefix}${value}${yAxisSuffix}`}
              domain={[0, (dataMax: number) => dataMax + 10]} // Auto-scale with some padding
            />
            {showTooltip && (
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={formatTooltip}
                labelStyle={{ color: '#374151' }}
              />
            )}
            {showLegend && <Legend />}
            
            {/* Render lines dynamically based on lineKeys */}
            {lineKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ 
                  fill: colors[index % colors.length], 
                  strokeWidth: 2, 
                  r: 4 
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: colors[index % colors.length], 
                  strokeWidth: 2, 
                  fill: 'white' 
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats */}
      {calculatedStats.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {calculatedStats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900">
                {stat.value}
              </p>
              {stat.description && (
                <p className="text-xs text-gray-500">{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}