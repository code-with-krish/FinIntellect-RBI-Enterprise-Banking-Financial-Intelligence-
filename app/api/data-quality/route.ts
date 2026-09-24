import { NextResponse } from 'next/server';
import { BankingAnalyticsService } from '@/lib/analytics';

export async function GET() {
  try {
    const dq = BankingAnalyticsService.getDataQualityMetrics();
    const meta = BankingAnalyticsService.getMetadata();
    return NextResponse.json({
      success: true,
      data: dq,
      metadata: meta
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve data quality metrics', detail: error?.message },
      { status: 500 }
    );
  }
}
