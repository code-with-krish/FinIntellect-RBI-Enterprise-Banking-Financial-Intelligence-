import { NextResponse } from 'next/server';
import { BankingAnalyticsService } from '@/lib/analytics';

export async function GET() {
  try {
    const sectors = BankingAnalyticsService.getSectoralDistribution();
    return NextResponse.json({
      success: true,
      data: sectors
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve sector analysis', detail: error?.message },
      { status: 500 }
    );
  }
}
