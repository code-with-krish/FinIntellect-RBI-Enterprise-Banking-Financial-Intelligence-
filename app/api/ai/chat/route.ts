import { NextRequest, NextResponse } from 'next/server';
import { buildEvidenceForIntent } from '@/lib/ai/evidence';
import { generateBankingAnalysis } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, intent = 'general_inquiry' } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // 1. Build Evidence Bundle from Source of Truth (SQL / Python validated returns)
    const evidenceBundle = buildEvidenceForIntent(intent, query);

    // 2. Call Gemini interpretation layer (server-side only)
    const aiResponse = await generateBankingAnalysis(query, evidenceBundle);

    return NextResponse.json({
      success: true,
      data: {
        query,
        intent: evidenceBundle.intent,
        response: aiResponse.answer,
        evidence: evidenceBundle.evidence_items,
        sourceOfTruth: evidenceBundle.source_of_truth,
        model: aiResponse.model,
        generatedAt: aiResponse.generatedAt,
        isMockFallback: aiResponse.isMockFallback
      }
    });
  } catch (error: any) {
    console.error('AI Chat route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process AI query',
        detail: error?.message || 'Server-side error'
      },
      { status: 500 }
    );
  }
}
