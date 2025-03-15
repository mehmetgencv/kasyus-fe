import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
    if (!apiUrl) throw new Error('API Gateway URL is missing');

    const response = await fetch(`${apiUrl}/auth-service/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
        role: 'ROLE_USER',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Kayıt başarısız');
    }

    return NextResponse.json({
      success: true,
      message: 'Kayıt başarılı, lütfen giriş yapın',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Kayıt başarısız' },
        { status: 400 }
    );
  }
}