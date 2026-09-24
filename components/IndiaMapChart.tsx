'use client';

import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

export interface StateData {
  state: string;
  credit: number;
  deposits: number;
  cd_ratio: number;
  offices?: number;
}

export interface IndiaMapChartProps {
  data: StateData[];
  metric?: 'credit' | 'cd_ratio' | 'offices';
  height?: number | string;
  selectedState?: string | null;
  onSelectState?: (state: StateData) => void;
  showLegend?: boolean;
}

// GeoJSON NAME_1 → our analytics data state name
const STATE_NAME_MAP: Record<string, string> = {
  'Andaman and Nicobar':    'Andaman & Nicobar',
  'Andhra Pradesh':         'Andhra Pradesh',
  'Arunachal Pradesh':      'Arunachal Pradesh',
  'Assam':                  'Assam',
  'Bihar':                  'Bihar',
  'Chandigarh':             'Chandigarh',
  'Chhattisgarh':           'Chhattisgarh',
  'Dadra and Nagar Haveli': 'Dadra & NH',
  'Daman and Diu':          'Daman & Diu',
  'Delhi':                  'Delhi',
  'Goa':                    'Goa',
  'Gujarat':                'Gujarat',
  'Haryana':                'Haryana',
  'Himachal Pradesh':       'Himachal Pradesh',
  'Jammu and Kashmir':      'Jammu & Kashmir',
  'Jharkhand':              'Jharkhand',
  'Karnataka':              'Karnataka',
  'Kerala':                 'Kerala',
  'Lakshadweep':            'Lakshadweep',
  'Madhya Pradesh':         'Madhya Pradesh',
  'Maharashtra':            'Maharashtra',
  'Manipur':                'Manipur',
  'Meghalaya':              'Meghalaya',
  'Mizoram':                'Mizoram',
  'Nagaland':               'Nagaland',
  'Orissa':                 'Odisha',
  'Puducherry':             'Puducherry',
  'Punjab':                 'Punjab',
  'Rajasthan':              'Rajasthan',
  'Sikkim':                 'Sikkim',
  'Tamil Nadu':             'Tamil Nadu',
  'Telangana':              'Telangana',
  'Tripura':                'Tripura',
  'Uttar Pradesh':          'Uttar Pradesh',
  'Uttaranchal':            'Uttarakhand',
  'West Bengal':            'West Bengal',
};

function getCdHealthTier(cdRatio: number) {
  if (cdRatio > 85) return { label: 'Strained (>85%)', color: 'bg-amber-100 text-amber-900 border-amber-300' };
  if (cdRatio >= 75) return { label: 'Optimal (75-85%)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
  if (cdRatio >= 60) return { label: 'Moderate (60-75%)', color: 'bg-blue-100 text-blue-900 border-blue-300' };
  return { label: 'Under-deployed (<60%)', color: 'bg-rose-100 text-rose-900 border-rose-300' };
}

function getFillColor(
  stateData: StateData | undefined,
  metric: 'credit' | 'cd_ratio' | 'offices',
  maxCredit: number,
  maxOffices: number
): string {
  if (!stateData) return '#F1F5F9'; // neutral slate for no data

  if (metric === 'cd_ratio') {
    const cd = stateData.cd_ratio;
    if (cd > 85) return '#D97706'; // Strained - Amber/Orange
    if (cd >= 75) return '#059669'; // Optimal - Emerald Green
    if (cd >= 60) return '#2563EB'; // Moderate - Blue
    return '#6366F1';              // Under-deployed - Indigo
  }

  if (metric === 'offices') {
    const off = stateData.offices || 0;
    const ratio = off / (maxOffices || 1);
    if (ratio > 0.8) return '#0F766E';
    if (ratio > 0.6) return '#0D9488';
    if (ratio > 0.4) return '#14B8A6';
    if (ratio > 0.2) return '#5EEAD4';
    return '#CCFBF1';
  }

  // default: credit
  const ratio = stateData.credit / (maxCredit || 1);
  if (ratio > 0.80) return '#1E3A8A'; // top tier — deep navy
  if (ratio > 0.60) return '#1D4ED8'; // dark blue
  if (ratio > 0.40) return '#2563EB'; // medium blue
  if (ratio > 0.25) return '#3B82F6'; // blue
  if (ratio > 0.12) return '#60A5FA'; // light blue
  if (ratio > 0.05) return '#93C5FD'; // pale blue
  return '#BAE6FD';                   // minimal
}

export const IndiaMapChart: React.FC<IndiaMapChartProps> = ({
  data,
  metric = 'credit',
  height = '440px',
  selectedState = null,
  onSelectState,
  showLegend = true
}) => {
  const [tooltip, setTooltip] = useState<{
    name: string;
    credit: number;
    deposits: number;
    cd_ratio: number;
    offices?: number;
    x: number;
    y: number;
  } | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/india-states.json')
      .then((r) => r.json())
      .then((json) => {
        // Strip CRS field — react-simple-maps only needs type + features
        setGeoData({ type: json.type, features: json.features });
      })
      .catch(console.error);
  }, []);

  // Build lookup map: normalized name → data
  const dataMap = new Map<string, StateData>();
  data.forEach((d) => dataMap.set(d.state.toLowerCase().trim(), d));

  const maxCredit = Math.max(...data.map((d) => d.credit || 0), 1);
  const maxOffices = Math.max(...data.map((d) => d.offices || 0), 1);

  const lookupState = (geoName: string): StateData | undefined => {
    const mapped = STATE_NAME_MAP[geoName] || geoName;
    return dataMap.get(mapped.toLowerCase().trim());
  };

  if (!geoData) {
    return (
      <div
        className="w-full flex items-center justify-center text-slate-400 text-sm bg-slate-50/50 rounded-xl border border-slate-200"
        style={{ height }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading High-Resolution India Geospatial Layer…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {/* Dynamic Legend */}
      {showLegend && (
        <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 shadow-md text-[10px] font-semibold text-slate-700 border border-slate-200/80">
          <div className="mb-1.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
            {metric === 'credit'
              ? 'Credit Deployed Scale'
              : metric === 'cd_ratio'
              ? 'CD Ratio Health Scale'
              : 'Branch Network Density'}
          </div>

          {metric === 'credit' && (
            <>
              {[
                { color: '#1E3A8A', label: 'Top Tier (> ₹350k Cr)' },
                { color: '#2563EB', label: 'High (₹200k - ₹350k Cr)' },
                { color: '#3B82F6', label: 'Medium (₹100k - ₹200k Cr)' },
                { color: '#60A5FA', label: 'Moderate (₹30k - ₹100k Cr)' },
                { color: '#BAE6FD', label: 'Emerging (< ₹30k Cr)' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 mb-1">
                  <div className="w-3.5 h-3.5 rounded-xs border border-slate-200" style={{ backgroundColor: color }} />
                  <span>{label}</span>
                </div>
              ))}
            </>
          )}

          {metric === 'cd_ratio' && (
            <>
              {[
                { color: '#D97706', label: 'Strained (> 85%)' },
                { color: '#059669', label: 'Optimal (75 - 85%)' },
                { color: '#2563EB', label: 'Moderate (60 - 75%)' },
                { color: '#6366F1', label: 'Under-deployed (< 60%)' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 mb-1">
                  <div className="w-3.5 h-3.5 rounded-xs border border-slate-200" style={{ backgroundColor: color }} />
                  <span>{label}</span>
                </div>
              ))}
            </>
          )}

          {metric === 'offices' && (
            <>
              {[
                { color: '#0F766E', label: 'Dense (> 3,500 Branches)' },
                { color: '#0D9488', label: 'High (2,500 - 3,500)' },
                { color: '#14B8A6', label: 'Medium (1,500 - 2,500)' },
                { color: '#5EEAD4', label: 'Moderate (500 - 1,500)' },
                { color: '#CCFBF1', label: 'Sparse (< 500)' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 mb-1">
                  <div className="w-3.5 h-3.5 rounded-xs border border-slate-200" style={{ backgroundColor: color }} />
                  <span>{label}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Rich Fixed Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none z-[9999] bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl px-4 py-3 shadow-2xl border border-indigo-500/40 min-w-[210px]"
          style={{ position: 'fixed', left: tooltip.x + 16, top: tooltip.y - 95 }}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-800">
            <span className="font-extrabold text-blue-300 text-sm tracking-tight">{tooltip.name}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {tooltip.cd_ratio.toFixed(1)}% CD
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">💳 Credit:</span>
              <span className="font-bold text-white font-mono">₹{Math.round(tooltip.credit).toLocaleString()} Cr</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">🏦 Deposits:</span>
              <span className="font-bold text-slate-200 font-mono">₹{Math.round(tooltip.deposits).toLocaleString()} Cr</span>
            </div>
            {tooltip.offices ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">🏢 Branches:</span>
                <span className="font-semibold text-emerald-300 font-mono">{tooltip.offices.toLocaleString()}</span>
              </div>
            ) : null}
            <div className="pt-1 mt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Liquidity Status:</span>
              <span className={`font-bold ${tooltip.deposits >= tooltip.credit ? 'text-emerald-400' : 'text-amber-400'}`}>
                {tooltip.deposits >= tooltip.credit ? 'Deposit Surplus' : 'Credit Strained'}
              </span>
            </div>
          </div>
          {onSelectState && (
            <div className="mt-2 pt-1 border-t border-slate-800/80 text-[10px] text-blue-300/80 font-medium text-center">
              Click to pin state dossier
            </div>
          )}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [80, 22],
          scale: 820,
        }}
        width={500}
        height={560}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoName =
                geo.properties?.NAME_1 ||
                geo.properties?.ST_NM ||
                geo.properties?.name ||
                '';
              const stateData = lookupState(geoName);
              const mappedName = STATE_NAME_MAP[geoName] || geoName;
              const isSelected = selectedState && selectedState.toLowerCase() === mappedName.toLowerCase();

              const fill = isSelected
                ? '#F59E0B'
                : getFillColor(stateData, metric, maxCredit, maxOffices);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={isSelected ? '#1E1B4B' : '#FFFFFF'}
                  strokeWidth={isSelected ? 1.8 : 0.7}
                  style={{
                    default: { outline: 'none', transition: 'all 200ms' },
                    hover:   { fill: '#F59E0B', outline: 'none', cursor: 'pointer', stroke: '#1E1B4B', strokeWidth: 1.5 },
                    pressed: { fill: '#D97706', outline: 'none' },
                  } as any}
                  onClick={() => {
                    if (stateData && onSelectState) {
                      onSelectState(stateData);
                    }
                  }}
                  onMouseEnter={(e: React.MouseEvent) => {
                    setTooltip({
                      name: mappedName,
                      credit: stateData?.credit ?? 0,
                      deposits: stateData?.deposits ?? 0,
                      cd_ratio: stateData?.cd_ratio ?? 0,
                      offices: stateData?.offices,
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }}
                  onMouseMove={(e: React.MouseEvent) => {
                    setTooltip((prev) =>
                      prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                    );
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};
