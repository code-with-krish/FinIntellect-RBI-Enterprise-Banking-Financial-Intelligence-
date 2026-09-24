import { NextResponse } from 'next/server';
import { BankingAnalyticsService } from '@/lib/analytics';

export async function GET() {
  try {
    const anomalies = BankingAnalyticsService.getAnomalies();
    return NextResponse.json({
      success: true,
      count: anomalies.length,
      data: anomalies
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve anomalies', detail: error?.message },
      { status: 500 }
    );
  }
}
