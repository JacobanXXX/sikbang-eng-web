import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const STIBEE_API_KEY = process.env.STIBEE_API_KEY;
    const STIBEE_LIST_ID = process.env.STIBEE_LIST_ID;

    if (!STIBEE_API_KEY || !STIBEE_LIST_ID) {
      console.error('Stibee API key or List ID not configured');
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.stibee.com/v1/lists/${STIBEE_LIST_ID}/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'AccessToken': STIBEE_API_KEY,
        },
        body: JSON.stringify({
          eventOccurredBy: 'SUBSCRIBER',
          confirmEmailYN: 'N',
          subscribers: [{ email }],
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
