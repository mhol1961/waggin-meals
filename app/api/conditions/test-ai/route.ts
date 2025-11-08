import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { apiKey, model } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Test the OpenRouter API with a simple request
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://wagginmeals.com',
        'X-Title': 'Waggin Meals'
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-sonnet-4-5',
        messages: [
          {
            role: 'user',
            content: 'Reply with just the word "SUCCESS" if you can read this message.'
          }
        ],
        max_tokens: 50
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || 'API request failed', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';

    if (reply.toUpperCase().includes('SUCCESS')) {
      return NextResponse.json({
        success: true,
        message: 'AI connection successful!',
        model: model
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Connected, but unexpected response',
        reply: reply
      });
    }

  } catch (error: any) {
    console.error('AI test error:', error);
    return NextResponse.json(
      { error: 'Network error or invalid API key', details: error.message },
      { status: 500 }
    );
  }
}
