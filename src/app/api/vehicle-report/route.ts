import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Proxying vehicle report request:', body);
    // Call the Firebase Cloud Function (v1 format)
    const response = await fetch('https://us-central1-autohunter-pro.cloudfunctions.net/resolveVehicleDataHttp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Firebase function error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in vehicle report proxy:', error);
    return NextResponse.json(
      { error: 'Failed to generate vehicle report' },
      { status: 500 }
    );
  }
}