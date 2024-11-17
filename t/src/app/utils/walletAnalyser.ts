import { Connection, PublicKey } from '@solana/web3.js';

interface TokenData {
  symbol: string;
  amount: number;
  mint: string;
}

export async function getWalletData(addressString: string) {
  const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=548b891a-510b-4fc6-8ba9-44b826fca36d`);
  
  try {
    const address = new PublicKey(addressString);
    
    // Get token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      address,
      { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
    );

    // Get Jupiter token list for names only
    const jupiterResponse = await fetch('https://token.jup.ag/all');
    const jupiterTokens = await jupiterResponse.json();
    
    // Process tokens
    const tokens: TokenData[] = tokenAccounts.value
      .map((ta: any) => {
        const mintAddress = ta.account.data.parsed.info.mint;
        const tokenInfo = jupiterTokens.find((t: any) => t.address === mintAddress);
        const amount = ta.account.data.parsed.info.tokenAmount.uiAmount;
        
        return {
          symbol: tokenInfo?.symbol || 'Unknown',
          amount,
          mint: mintAddress
        };
      })
      // Filter out zero balances
      .filter(token => token.amount > 0)
      // Sort by amount
      .sort((a, b) => b.amount - a.amount);

    const signatures = await connection.getSignaturesForAddress(
      address,
      { limit: 50 }
    );

    return {
      tokens,
      transactions: signatures,
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    throw error;
  }
}