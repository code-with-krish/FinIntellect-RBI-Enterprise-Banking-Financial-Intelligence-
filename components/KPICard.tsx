import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export type AccentColor =
  | 'blue'
  | 'teal'
  | 'indigo'
  | 'rose'
  | 'green'
  | 'purple'
  | 'violet'
  | 'amber'
  | 'cyan'
  | 'slate'
  | 'yellow'
  | 'pink'
  | 'brown'
  | 'orange'
  | 'emerald'
  | 'fuchsia';

interface AccentTokens {
  cardBg: string;        // full card gradient
  cardShadow: string;    // shadow colour
  titleText: string;     // label above value
  valueText: string;     // big number
  unitText: string;      // unit suffix
  divider: string;       // footer divider
  footerBg: string;      // footer strip
  changeBadge: string;   // % change pill
  benchmarkText: string; // benchmark label value
  sourceBadge: string;   // source tag
  infoIcon: string;      // info icon
}

function getTokens(accent: AccentColor): AccentTokens {
  switch (accent) {
    case 'blue':
      return {
        cardBg:        'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100',
        cardShadow:    'shadow-blue-200/60',
        titleText:     'text-blue-600',
        valueText:     'text-blue-800',
        unitText:      'text-blue-500',
        divider:       'border-blue-200/60',
        footerBg:      'bg-blue-100/60',
        changeBadge:   'bg-blue-600 text-white border-blue-700',
        benchmarkText: 'text-blue-700',
        sourceBadge:   'bg-blue-200 text-blue-800',
        infoIcon:      'text-blue-400 hover:text-blue-600',
      };
    case 'green':
    case 'emerald':
      return {
        cardBg:        'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100',
        cardShadow:    'shadow-emerald-200/60',
        titleText:     'text-emerald-600',
        valueText:     'text-emerald-800',
        unitText:      'text-emerald-500',
        divider:       'border-emerald-200/60',
        footerBg:      'bg-emerald-100/60',
        changeBadge:   'bg-emerald-600 text-white border-emerald-700',
        benchmarkText: 'text-emerald-700',
        sourceBadge:   'bg-emerald-200 text-emerald-800',
        infoIcon:      'text-emerald-400 hover:text-emerald-600',
      };
    case 'indigo':
      return {
        cardBg:        'bg-gradient-to-br from-indigo-100 via-indigo-50 to-violet-100',
        cardShadow:    'shadow-indigo-200/60',
        titleText:     'text-indigo-600',
        valueText:     'text-indigo-800',
        unitText:      'text-indigo-500',
        divider:       'border-indigo-200/60',
        footerBg:      'bg-indigo-100/60',
        changeBadge:   'bg-indigo-600 text-white border-indigo-700',
        benchmarkText: 'text-indigo-700',
        sourceBadge:   'bg-indigo-200 text-indigo-800',
        infoIcon:      'text-indigo-400 hover:text-indigo-600',
      };
    case 'rose':
    case 'pink':
      return {
        cardBg:        'bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100',
        cardShadow:    'shadow-rose-200/60',
        titleText:     'text-rose-600',
        valueText:     'text-rose-800',
        unitText:      'text-rose-500',
        divider:       'border-rose-200/60',
        footerBg:      'bg-rose-100/60',
        changeBadge:   'bg-rose-600 text-white border-rose-700',
        benchmarkText: 'text-rose-700',
        sourceBadge:   'bg-rose-200 text-rose-800',
        infoIcon:      'text-rose-400 hover:text-rose-600',
      };
    case 'teal':
      return {
        cardBg:        'bg-gradient-to-br from-teal-100 via-teal-50 to-cyan-100',
        cardShadow:    'shadow-teal-200/60',
        titleText:     'text-teal-600',
        valueText:     'text-teal-800',
        unitText:      'text-teal-500',
        divider:       'border-teal-200/60',
        footerBg:      'bg-teal-100/60',
        changeBadge:   'bg-teal-600 text-white border-teal-700',
        benchmarkText: 'text-teal-700',
        sourceBadge:   'bg-teal-200 text-teal-800',
        infoIcon:      'text-teal-400 hover:text-teal-600',
      };
    case 'purple':
      return {
        cardBg:        'bg-gradient-to-br from-purple-100 via-purple-50 to-fuchsia-100',
        cardShadow:    'shadow-purple-200/60',
        titleText:     'text-purple-600',
        valueText:     'text-purple-800',
        unitText:      'text-purple-500',
        divider:       'border-purple-200/60',
        footerBg:      'bg-purple-100/60',
        changeBadge:   'bg-purple-600 text-white border-purple-700',
        benchmarkText: 'text-purple-700',
        sourceBadge:   'bg-purple-200 text-purple-800',
        infoIcon:      'text-purple-400 hover:text-purple-600',
      };
    case 'violet':
      return {
        cardBg:        'bg-gradient-to-br from-violet-100 via-violet-50 to-purple-100',
        cardShadow:    'shadow-violet-200/60',
        titleText:     'text-violet-600',
        valueText:     'text-violet-800',
        unitText:      'text-violet-500',
        divider:       'border-violet-200/60',
        footerBg:      'bg-violet-100/60',
        changeBadge:   'bg-violet-600 text-white border-violet-700',
        benchmarkText: 'text-violet-700',
        sourceBadge:   'bg-violet-200 text-violet-800',
        infoIcon:      'text-violet-400 hover:text-violet-600',
      };
    case 'amber':
    case 'yellow':
      return {
        cardBg:        'bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100',
        cardShadow:    'shadow-amber-200/60',
        titleText:     'text-amber-600',
        valueText:     'text-amber-800',
        unitText:      'text-amber-500',
        divider:       'border-amber-200/60',
        footerBg:      'bg-amber-100/60',
        changeBadge:   'bg-amber-600 text-white border-amber-700',
        benchmarkText: 'text-amber-700',
        sourceBadge:   'bg-amber-200 text-amber-800',
        infoIcon:      'text-amber-400 hover:text-amber-600',
      };
    case 'cyan':
      return {
        cardBg:        'bg-gradient-to-br from-cyan-100 via-cyan-50 to-sky-100',
        cardShadow:    'shadow-cyan-200/60',
        titleText:     'text-cyan-600',
        valueText:     'text-cyan-800',
        unitText:      'text-cyan-500',
        divider:       'border-cyan-200/60',
        footerBg:      'bg-cyan-100/60',
        changeBadge:   'bg-cyan-600 text-white border-cyan-700',
        benchmarkText: 'text-cyan-700',
        sourceBadge:   'bg-cyan-200 text-cyan-800',
        infoIcon:      'text-cyan-400 hover:text-cyan-600',
      };
    case 'orange':
      return {
        cardBg:        'bg-gradient-to-br from-orange-100 via-orange-50 to-red-100',
        cardShadow:    'shadow-orange-200/60',
        titleText:     'text-orange-600',
        valueText:     'text-orange-800',
        unitText:      'text-orange-500',
        divider:       'border-orange-200/60',
        footerBg:      'bg-orange-100/60',
        changeBadge:   'bg-orange-600 text-white border-orange-700',
        benchmarkText: 'text-orange-700',
        sourceBadge:   'bg-orange-200 text-orange-800',
        infoIcon:      'text-orange-400 hover:text-orange-600',
      };
    case 'fuchsia':
      return {
        cardBg:        'bg-gradient-to-br from-fuchsia-100 via-fuchsia-50 to-pink-100',
        cardShadow:    'shadow-fuchsia-200/60',
        titleText:     'text-fuchsia-600',
        valueText:     'text-fuchsia-800',
        unitText:      'text-fuchsia-500',
        divider:       'border-fuchsia-200/60',
        footerBg:      'bg-fuchsia-100/60',
        changeBadge:   'bg-fuchsia-600 text-white border-fuchsia-700',
        benchmarkText: 'text-fuchsia-700',
        sourceBadge:   'bg-fuchsia-200 text-fuchsia-800',
        infoIcon:      'text-fuchsia-400 hover:text-fuchsia-600',
      };
    case 'slate':
    case 'brown':
    default:
      return {
        cardBg:        'bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100',
        cardShadow:    'shadow-slate-200/60',
        titleText:     'text-slate-600',
        valueText:     'text-slate-800',
        unitText:      'text-slate-500',
        divider:       'border-slate-200/60',
        footerBg:      'bg-slate-100/60',
        changeBadge:   'bg-slate-600 text-white border-slate-700',
        benchmarkText: 'text-slate-700',
        sourceBadge:   'bg-slate-200 text-slate-800',
        infoIcon:      'text-slate-400 hover:text-slate-600',
      };
  }
}


interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  benchmark?: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  tooltip?: string;
  source?: string;
  accent?: AccentColor;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  change,
  changeLabel = 'vs FY2023',
  benchmark,
  status = 'neutral',
  tooltip,
  source = 'RBI DBIE',
  accent = 'blue'
}) => {
  const t = getTokens(accent);

  return (
    <div
      className={`relative rounded-2xl ${t.cardBg} shadow-lg ${t.cardShadow} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
    >
      {/* Subtle inner glow overlay */}
      <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none" />

      {/* Body */}
      <div className="relative px-5 pt-5 pb-4">
        {/* Title row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest truncate ${t.titleText}`}>
            {title}
          </span>
          {tooltip && (
            <span title={tooltip} className={`cursor-help shrink-0 transition-colors ${t.infoIcon}`}>
              <Info className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Big value */}
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl md:text-4xl font-extrabold tracking-tight font-mono drop-shadow-sm ${t.valueText}`}>
            {value}
          </span>
          {unit && (
            <span className={`text-sm font-semibold ${t.unitText}`}>{unit}</span>
          )}
        </div>
      </div>

      {/* Footer strip */}
      <div className={`relative px-5 py-3 border-t ${t.divider} ${t.footerBg} flex items-center justify-between text-xs`}>
        {change !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${t.changeBadge}`}
            >
              {change > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : change < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
            <span className={`text-[11px] font-medium ${t.titleText}`}>{changeLabel}</span>
          </div>
        ) : benchmark ? (
          <span className={`text-[11px] font-medium ${t.titleText}`}>
            <span className={`font-bold ${t.benchmarkText}`}>{benchmark}</span>
          </span>
        ) : (
          <span className={`text-[11px] font-medium ${t.titleText}`}>Target Range Optimal</span>
        )}

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${t.sourceBadge}`}>
          {source}
        </span>
      </div>
    </div>
  );
};
