'use client';
import { useState } from 'react';
import { getWalletData } from './utils/walletAnalyser';
import { analyzeWallet } from './utils/aiAnalyzer';

export default function Home() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  const analyzeWalletData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await getWalletData(address);
      setWalletData(data);
      
      // Get AI analysis
      const analysis = await analyzeWallet(data);
      setAiAnalysis(analysis);
    } catch (err) {
      setError('Error analyzing wallet. Please check the address and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">🦧 Solana Degen Analyzer</h1>
      
      <form onSubmit={analyzeWalletData} className="mb-8">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter SOL wallet address..."
          className="w-full p-2 rounded mb-4 bg-gray-800 text-white placeholder-gray-400 border border-gray-600"
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-purple-400"
        >
          {loading ? 'Analyzing...' : 'Check Wallet'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {walletData && (
        <div className="space-y-6">
          {/* AI Analysis Section */}
          {aiAnalysis && (
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-bold mb-4">🤖 Claude&apos;s Analysis</h2>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-purple-400">
                  Degen Score: {aiAnalysis.score}/100
                </div>
                <div className="text-gray-300">
                  <p className="mb-2">{aiAnalysis.explanation}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {aiAnalysis.observations.map((obs: string, i: number) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Token Holdings Section */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Token Holdings</h2>
            <div className="space-y-2">
              {walletData.tokens.map((token: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-gray-400">
                    {typeof token.amount === 'number' 
                      ? token.amount.toLocaleString(undefined, {maximumFractionDigits: 4})
                      : token.amount || '0'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions Section */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Recent Transactions</h2>
            <div className="space-y-2">
              {walletData.transactions.map((tx: any, i: number) => (
                <div key={i} className="text-sm">
                  <a 
                    href={`https://solscan.io/tx/${tx.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {tx.signature ? `${tx.signature.slice(0, 20)}...` : 'Unknown'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}