export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as const;
export const PREDICT_ADDRESS = '0xd833eDF5bC48BF4aE788D39798911Cd62f02FeBD' as const;
export const REVIEW_ADDRESS = '0xCdb8409A80bE8b3CE4CCb244C1580267dB2EF65B' as const;

export const ARC_TESTNET = {
  id: 5042002,
  name: 'ARC Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 6 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
  blockExplorers: { default: { name: 'Arcscan', url: 'https://testnet.arcscan.app' } },
} as const;

export const ERC20_ABI = [
  {"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
] as const;

export const PREDICT_ABI = [
  {"inputs":[{"internalType":"address","name":"_usdc","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"string","name":"username","type":"string"},{"internalType":"uint256","name":"followerCount","type":"uint256"},{"internalType":"bool","name":"verified","type":"bool"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"linkXAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint8","name":"cryptoChoice","type":"uint8"},{"internalType":"uint8","name":"weatherChoice","type":"uint8"},{"internalType":"uint8","name":"marketChoice","type":"uint8"},{"internalType":"uint8","name":"trendingChoice","type":"uint8"}],"name":"predict","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"currentDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"stakeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getMyUser","outputs":[{"components":[{"internalType":"string","name":"xUsername","type":"string"},{"internalType":"uint256","name":"followerCount","type":"uint256"},{"internalType":"bool","name":"isVerified","type":"bool"},{"internalType":"uint256","name":"predictions","type":"uint256"},{"internalType":"uint256","name":"correct","type":"uint256"},{"internalType":"uint256","name":"streak","type":"uint256"},{"internalType":"uint256","name":"lastDay","type":"uint256"}],"internalType":"struct VibeCheckV2.User","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUser","outputs":[{"components":[{"internalType":"string","name":"xUsername","type":"string"},{"internalType":"uint256","name":"followerCount","type":"uint256"},{"internalType":"bool","name":"isVerified","type":"bool"},{"internalType":"uint256","name":"predictions","type":"uint256"},{"internalType":"uint256","name":"correct","type":"uint256"},{"internalType":"uint256","name":"streak","type":"uint256"},{"internalType":"uint256","name":"lastDay","type":"uint256"}],"internalType":"struct VibeCheckV2.User","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"day","type":"uint256"}],"name":"getPredictorCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"day","type":"uint256"}],"name":"getDayPredictors","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"string","name":"xUsername","type":"string"},{"internalType":"uint256","name":"followerCount","type":"uint256"},{"internalType":"bool","name":"isVerified","type":"bool"},{"internalType":"uint256","name":"predictions","type":"uint256"},{"internalType":"uint256","name":"correct","type":"uint256"},{"internalType":"uint256","name":"streak","type":"uint256"},{"internalType":"uint256","name":"lastDay","type":"uint256"}],"stateMutability":"view","type":"function"},
] as const;

export const REVIEW_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"uint8","name":"_category","type":"uint8"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_origin","type":"string"},{"internalType":"uint8","name":"_rating","type":"uint8"},{"internalType":"string","name":"_reviewText","type":"string"},{"internalType":"string","name":"_photoUrl1","type":"string"},{"internalType":"string","name":"_photoUrl2","type":"string"}],"name":"submitReview","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getReview","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"reviewer","type":"address"},{"internalType":"uint8","name":"category","type":"uint8"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"origin","type":"string"},{"internalType":"uint8","name":"rating","type":"uint8"},{"internalType":"string","name":"reviewText","type":"string"},{"internalType":"string","name":"photoUrl1","type":"string"},{"internalType":"string","name":"photoUrl2","type":"string"},{"internalType":"uint256","name":"submittedAt","type":"uint256"}],"internalType":"struct RialoTempleReview.Review","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"offset","type":"uint256"},{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"getLatestReviews","outputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address[]","name":"reviewers","type":"address[]"},{"internalType":"uint8[]","name":"categories","type":"uint8[]"},{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"uint8[]","name":"ratings","type":"uint8[]"},{"internalType":"uint256[]","name":"timestamps","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getReviewCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"reviewFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ARC_USDC","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"CAT_FOOD","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"CAT_MOVIE","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
] as const;

export const CATEGORIES = [
  { id: 'crypto', label: 'Crypto Market', icon: 'TrendingUp', description: 'Fear & Greed mood' },
  { id: 'weather', label: 'Global Weather', icon: 'Cloud', description: 'Weather vibe' },
  { id: 'market', label: 'Market Volatility', icon: 'Activity', description: 'BTC volatility' },
  { id: 'trending', label: 'Trending Topic', icon: 'Hash', description: 'Social trend' },
] as const;

export const VIBES = [
  { id: 0, label: 'CHILL', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)' },
  { id: 1, label: 'HECTIC', color: '#F97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)' },
  { id: 2, label: 'BULLISH', color: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)' },
  { id: 3, label: 'DOOMER', color: '#A855F7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.35)' },
] as const;
