'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

interface MultiYearTrendProps {
  data: Array<{
    fiscal_year: string;
    deposits: number;
    advances: number;
    gross_npa: number;
    net_npa: number;
    gnpa_ratio: number;
    roa: number;
  }>;
}

export const DepositCreditTrendChart: React.FC<MultiYearTrendProps> = ({ data }) => {
  return (
    <div className="h-72 w-full rounded-xl overflow-hidden bg-pink-400/25 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#0F9D76" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0F9D76" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="fiscal_year"
            stroke="#000"
            fontSize={11}
            tick={{ fill: '#000', fontWeight: 700 }}
          />
          <YAxis
            stroke="#000"
            fontSize={11}
            tick={{ fill: '#000', fontWeight: 700 }}
            tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L Cr`}
          />
          <Tooltip
            formatter={(value: any) => [`₹${Number(value).toLocaleString()} Cr`, '']}
            contentStyle={{ backgroundColor: '#0F2747', borderColor: '#1E3A8A', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: '#000', fontWeight: 700 }}
          />
          <Area
            type="monotone"
            dataKey="deposits"
            name="Total Deposits (₹ Cr)"
            stroke="#2563EB"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorDeposits)"
          />
          <Area
            type="monotone"
            dataKey="advances"
            name="Gross Bank Credit (₹ Cr)"
            stroke="#0F9D76"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorCredit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};


export const AssetQualityTrendChart: React.FC<MultiYearTrendProps> = ({ data }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 15, left: 0, bottom: 0 }}>
          <defs>
            {/* Gradient for GNPA bars: Coral-Rose to Pink */}
            <linearGradient id="gnpaBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E11D48" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#FB7185" stopOpacity={0.7} />
            </linearGradient>

            {/* Gradient for RoA area: Luminous Emerald to Transparent */}
            <linearGradient id="roaAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />

          <XAxis
            dataKey="fiscal_year"
            stroke="#0F172A"
            tick={{ fill: '#0F172A', fontWeight: 800, fontSize: 11 }}
          />

          {/* Left Y-Axis for GNPA % (Rose/Red) */}
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#E11D48"
            tick={{ fill: '#9F1239', fontWeight: 800, fontSize: 11 }}
            tickFormatter={(val) => `${val}%`}
            domain={[0, 10]}
          />

          {/* Right Y-Axis for RoA % (Emerald Green) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#059669"
            tick={{ fill: '#065F46', fontWeight: 800, fontSize: 11 }}
            tickFormatter={(val) => `${val.toFixed(1)}%`}
            domain={[-0.5, 1.5]}
          />

          <Tooltip
            formatter={(val: any, name: string) => [`${Number(val).toFixed(2)}%`, name]}
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#334155',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.25)'
            }}
          />

          <Legend
            wrapperStyle={{
              fontSize: '12px',
              fontWeight: 800,
              paddingTop: '8px'
            }}
          />

          {/* Bar representation for GNPA Ratio (Decline) */}
          <Bar
            yAxisId="left"
            dataKey="gnpa_ratio"
            name="Gross NPA Ratio (%) [Bar]"
            fill="url(#gnpaBarGrad)"
            radius={[5, 5, 0, 0]}
            barSize={24}
          />

          {/* Area & Line curve representation for Return on Assets (Expansion) */}
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="roa"
            name="Return on Assets (%) [RoA]"
            stroke="#059669"
            strokeWidth={3}
            fill="url(#roaAreaGrad)"
            dot={{ r: 4, stroke: '#047857', strokeWidth: 2, fill: '#FFFFFF' }}
            activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2, fill: '#10B981' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

interface StateBarChartProps {
  data: Array<{
    state: string;
    credit: number;
    deposits: number;
    cd_ratio: number;
  }>;
}

export const StateComparisonBarChart: React.FC<StateBarChartProps> = ({ data }) => {
  const top10 = data.slice(0, 8);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top10} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
          <XAxis
            dataKey="state"
            stroke="#0F172A"
            tick={{ fill: '#0F172A', fontWeight: 800, fontSize: 12 }}
            angle={-18}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            stroke="#0F172A"
            tick={{ fill: '#0F172A', fontWeight: 800, fontSize: 11 }}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k Cr`}
          />
          <Tooltip
            formatter={(val: any) => [`₹${Number(val).toLocaleString()} Cr`, '']}
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E3A8A',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.25)'
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#0F172A',
              paddingTop: '15px'
            }}
          />
          <Bar dataKey="credit" name="Credit Deployed (₹ Cr)" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="deposits" name="Deposits Mobilized (₹ Cr)" fill="#60A5FA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
