import { NextResponse } from 'next/server';
import { BankingAnalyticsService } from '@/lib/analytics';

export async function GET() {
  try {
    const states = BankingAnalyticsService.getGeographicRankings(36);
    return NextResponse.json({
      success: true,
      data: states
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve branch geography', detail: error?.message },
      { status: 500 }
    );
  }
}
