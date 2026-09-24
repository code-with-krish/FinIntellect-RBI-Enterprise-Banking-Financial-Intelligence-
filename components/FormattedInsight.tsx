'use client';

import React from 'react';

interface FormattedInsightProps {
  content: string;
  isCompact?: boolean;
}

// Cleanly renders inline text by converting **bold** to <strong>
export const renderCleanInlineText = (text: string): React.ReactNode => {
  const cleaned = text.replace(/^[-*•]\s*/, '').trim();
  const parts = cleaned.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2).replace(/[*#]/g, '').trim();
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {inner}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const inner = part.slice(1, -1).replace(/[*#]/g, '').trim();
      return (
        <strong key={idx} className="font-medium text-slate-900">
          {inner}
        </strong>
      );
    }
    const cleanText = part.replace(/[*#]/g, '');
    return <React.Fragment key={idx}>{cleanText}</React.Fragment>;
  });
};

export const FormattedInsight: React.FC<FormattedInsightProps> = ({ content, isCompact = false }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className={`space-y-2 text-slate-700 leading-relaxed ${isCompact ? 'text-xs' : 'text-sm'}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Filter out unnecessary disclaimers / boundaries
        const lower = trimmed.toLowerCase();
        if (
          lower.startsWith('data boundary') ||
          lower.startsWith('macroeconomic & data boundary') ||
          lower.startsWith('disclaimer')
        ) {
          return null;
        }

        // Section header
        const isHeader =
          trimmed.startsWith('#') ||
          (trimmed.endsWith(':') &&
            trimmed.length < 60 &&
            !trimmed.includes('₹') &&
            !trimmed.includes('%') &&
            !trimmed.startsWith('-') &&
            !trimmed.startsWith('*') &&
            !/^\d+\./.test(trimmed));

        if (isHeader) {
          const title = trimmed
            .replace(/^[#\s*]+/, '')
            .replace(/[:#*]+$/g, '')
            .trim();

          return (
            <div key={idx} className="pt-3 pb-1 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                {title}
              </h4>
            </div>
          );
        }

        const isBullet = trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•');
        const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/);

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-slate-400 font-bold select-none">•</span>
              <div className="flex-1 text-slate-800 leading-relaxed">
                {renderCleanInlineText(trimmed)}
              </div>
            </div>
          );
        }

        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="font-bold text-violet-700 min-w-4 text-xs">
                {numMatch[1]}.
              </span>
              <div className="flex-1 text-slate-800 leading-relaxed">
                {renderCleanInlineText(numMatch[2])}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-800 leading-relaxed">
            {renderCleanInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
