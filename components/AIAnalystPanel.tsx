'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Database,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileCheck,
  Loader2
} from 'lucide-react';
import { FormattedInsight } from './FormattedInsight';

interface AIAnalystPanelProps {
  isCompact?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidence?: any[];
  model?: string;
  timestamp: string;
}

export const AIAnalystPanel: React.FC<AIAnalystPanelProps> = ({ isCompact = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Executive Summary:
The Indian Scheduled Commercial Banking system shows strong balance sheet health in FY2024, with Gross NPAs declining to 2.80% and RoA reaching +1.15%. However, rapid credit growth (+15.3% YoY) has pushed the system Credit-Deposit (CD) ratio to 80.34%, above the historical 75% comfort level.

Key Metrics:
- Total Deposits: ₹204.38 Lakh Cr (+11.4% YoY)
- Gross Advances: ₹164.20 Lakh Cr (+15.3% YoY)
- System CD Ratio: 80.34% (vs 75% historical benchmark)
- Gross NPA Ratio: 2.80% (Down from 11.18% in FY18)
- Return on Assets (RoA): +1.15%

Key Risks:
- Liquidity Gap: The 80.34% CD ratio increases reliance on higher-cost bulk deposits and squeezes net interest margins.
- Unsecured Retail Growth: Rapid credit expansion in personal loans requires active monitoring for potential slippages.

Recommended Actions:
1. Mobilize granular retail deposits to steer the CD ratio back toward 75%.
2. Maintain strict underwriting standards on unsecured personal loans.
3. Diversify lending to Tier-2/Tier-3 centers to reduce credit concentration in top states.`,
      evidence: [
        {
          metric: 'Total System Deposits',
          current_value: 20438000,
          period: 'FY2024',
          entity: 'SCBs All India',
          source: 'RBI DBIE',
          calculation_source: 'PostgreSQL View'
        },
        {
          metric: 'Gross NPA Ratio',
          current_value: 2.80,
          period: 'FY2024',
          entity: 'SCBs All India',
          source: 'RBI Returns',
          calculation_source: '(GNPA / Advances) * 100'
        },
        {
          metric: 'System CD Ratio',
          current_value: 80.34,
          period: 'FY2024',
          entity: 'SCBs All India',
          source: 'RBI DBIE',
          calculation_source: '(Advances / Deposits) * 100'
        }
      ],
      model: 'AI Banking Financial Intelligence Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);

  const suggestedQuestions = [
    'Why is the CD ratio at 80.34% and what is the liquidity impact?',
    'How did Gross NPAs drop from 11.18% to 2.80%?',
    'Which top 5 states absorb the most bank credit in India?',
    'What is the sectoral credit growth across industry & retail?'
  ];

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      const json = await res.json();

      if (json.success && json.data) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: json.data.response,
          evidence: json.data.evidence,
          model: json.data.model,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(json.error || 'Server error');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `**Analysis Notice:** Failed to retrieve dynamic AI response. Ensure server connection is active. Error detail: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-gradient-to-b from-[#faf7fd] to-white border border-violet-200/90 rounded-2xl shadow-md flex flex-col overflow-hidden ${
        isCompact ? 'h-[640px]' : 'h-[780px]'
      }`}
    >
      {/* Clean Themed Header */}
      <div className="p-4 border-b border-violet-900/40 bg-gradient-to-r from-[#0F2747] via-[#162142] to-[#2e1065] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-500 text-white flex items-center justify-center shadow-sm ring-2 ring-white/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              AI Banking Intelligence
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-violet-200/80 font-medium">RBI DBIE Analytics Engine</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/40 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          RBI Data-Backed
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-violet-50/40 via-slate-50/30 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-violet-700 to-indigo-700 text-white font-medium rounded-br-none shadow-sm'
                  : 'bg-white text-slate-800 border border-violet-200/80 rounded-bl-none shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? (
                <div className="whitespace-pre-line font-medium">{msg.text}</div>
              ) : (
                <FormattedInsight content={msg.text} isCompact={true} />
              )}

              {/* Evidence Panel Accordion for AI messages */}
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                  <button
                    onClick={() =>
                      setExpandedEvidenceId(expandedEvidenceId === msg.id ? null : msg.id)
                    }
                    className="flex items-center justify-between w-full text-[11px] font-bold text-violet-700 hover:text-violet-900 transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Audited Evidence Contract ({msg.evidence.length} metrics)
                    </span>
                    {expandedEvidenceId === msg.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {expandedEvidenceId === msg.id && (
                    <div className="mt-2 space-y-1.5 bg-violet-50/40 p-2.5 rounded-lg border border-violet-200/70 text-[10px]">
                      {msg.evidence.map((ev, idx) => (
                        <div key={idx} className="border-b border-violet-100 pb-1.5 last:border-b-0 last:pb-0">
                          <div className="font-bold text-slate-900 flex justify-between">
                            <span>{ev.metric}</span>
                            <span className="font-mono text-emerald-700 font-bold">
                              {typeof ev.current_value === 'number'
                                ? ev.current_value.toLocaleString()
                                : ev.current_value}
                            </span>
                          </div>
                          <div className="text-slate-500 text-[9px] flex justify-between mt-0.5">
                            <span>{ev.entity} • {ev.period}</span>
                            <span>Source: {ev.source}</span>
                          </div>
                          {ev.context_note && (
                            <div className="text-slate-600 italic mt-0.5">{ev.context_note}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-violet-800 bg-violet-50 p-3 rounded-lg border border-violet-200 w-fit font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
            <span>Validating SQL evidence & generating business interpretation...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-gradient-to-r from-slate-50 to-violet-50/30 border-t border-slate-200">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Suggested Analytical Inquiries
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-[10px] bg-white border border-slate-200 text-slate-700 hover:text-violet-700 hover:border-violet-300 px-2.5 py-1 rounded-md font-medium transition-all truncate max-w-full shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask question about banking data, anomalies, or KPIs..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs px-3 py-2 bg-slate-50/90 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-lg transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
