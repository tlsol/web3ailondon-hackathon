import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const prompt = `You are an expert Solana blockchain analyst. Analyze this wallet and give it a degen score from 1-100, where 100 is the most degen. Consider:
- Number of tokens: ${data.tokens?.length || 0}
- Token types: ${data.tokens?.map((t: any) => t.symbol || 'Unknown').filter(Boolean).join(', ') || 'None'}
- Transaction count: ${data.transactions?.length || 0}

Please provide:
1. A numerical score (1-100)
2. A brief explanation of the score
3. Notable observations about the wallet's activity

Format your response as JSON like this:
{
  "score": number,
  "explanation": "string",
  "observations": ["string"]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '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',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to get response from Claude');
    }

    return NextResponse.json(JSON.parse(result.content[0].text));

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Failed to analyze wallet' }, { status: 500 });
  }
}