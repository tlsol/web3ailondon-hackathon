interface TokenData {
    symbol: string;
    amount: number;
    mint: string;
  }
  
  interface WalletData {
    tokens: TokenData[];
    transactions: any[];
  }
  
  export async function analyzeWallet(data: WalletData) {
    try {
      if (!data || !data.tokens || !data.transactions) {
        throw new Error('Invalid wallet data structure');
      }

      console.log('Sending data to API:', {
        tokenCount: data.tokens.length,
        transactionCount: data.transactions.length
      });
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('API response:', result);
  
      return result;
    } catch (error) {
      console.error('Error in analyzeWallet:', error);
      throw error;
    }
  }