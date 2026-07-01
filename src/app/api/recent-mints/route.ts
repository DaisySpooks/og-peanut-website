export const runtime = 'edge';

const HELIUS_URL = 'https://mainnet.helius-rpc.com/';
const COLLECTION_MINT = 'Aw8BPgvehPvHM9hbPov7wgoheFiY9FcjwDaSd6pLD6dN';

interface RecentMint {
  name: string;
  image: string;
  mintAddress: string;
  solscanUrl: string;
}

export async function GET() {
  const apiKey = process.env.HELIUS_API_KEY;

  if (!apiKey) {
    return Response.json([]);
  }

  try {
    const res = await fetch(`${HELIUS_URL}?api-key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'recent-mints',
        method: 'getAssetsByGroup',
        params: {
          groupKey: 'collection',
          groupValue: COLLECTION_MINT,
          page: 1,
          limit: 3,
          sortBy: { sortBy: 'created', sortDirection: 'desc' },
        },
      }),
    });

    if (!res.ok) {
      return Response.json([]);
    }

    const data = await res.json();
    const items = data?.result?.items;

    if (!Array.isArray(items)) {
      return Response.json([]);
    }

    const mints: RecentMint[] = items.map((item) => ({
      name: item?.content?.metadata?.name ?? '',
      image: item?.content?.links?.image ?? '',
      mintAddress: item?.id ?? '',
      solscanUrl: `https://solscan.io/token/${item?.id ?? ''}`,
    }));

    return Response.json(mints);
  } catch {
    return Response.json([]);
  }
}
