import React, { useState, useEffect } from 'react'
import { FiTrendingUp, FiTrendingDown, FiSearch } from 'react-icons/fi'
import { BiRupee } from 'react-icons/bi'
import { AiOutlineStar, AiFillCaretDown, AiOutlineDollarCircle, AiFillStar } from 'react-icons/ai'
import { FaSearch } from 'react-icons/fa'
import { RxCrossCircled } from 'react-icons/rx'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@chakra-ui/react'
import { favouritesActions } from '../../ReduxStore/FavouritesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip } from '@chakra-ui/react'
import Link from 'next/link'



type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
};

const Hero = () => {
  const { isDark } = useTheme();
  const [cryptoData, setCryptoData] = useState<Coin[]>([]);
  const [filteredArray, setFilteredArray] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [active, setActive] = useState(1);
  const [currencyModal, setCurrencyModal] = useState(false);
  const [currency, setCurrency] = useState('usd');
  const [tabState, setTabState] = useState('all coins');
  const [metaverseCoins, setMetaverseCoins] = useState<Coin[]>([]);
  const [metaverseFilter, setMetaverseFilter] = useState<Coin[]>([]);
  const [originalARR, setOriginalARR] = useState<Coin[]>([]);

  const pages = [1, 2, 3, 4];
  const reduxFavouritesARR: any[] = useSelector((state: any) => state.favourites.list);
  const toast = useToast();
  const dispatch = useDispatch();

  // Load favorites on component mount
  useEffect(() => {
    dispatch(favouritesActions.loadFavourites());
  }, [dispatch]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchCoins = async () => {
      try {
        setLoading(true);

        // Fetch all coins with abort signal
        const allCoinsResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=80&page=1&sparkline=false`,
          { signal: abortController.signal }
        );

        if (!allCoinsResponse.ok) {
          throw new Error(`HTTP error! status: ${allCoinsResponse.status}`);
        }

        const allCoinsData = await allCoinsResponse.json();

        // Only update state if we have valid data
        if (allCoinsData && Array.isArray(allCoinsData) && allCoinsData.length > 0) {
          setCryptoData(allCoinsData);
          setOriginalARR(allCoinsData);
          setFilteredArray(allCoinsData);
        }

        // Fetch metaverse coins with abort signal
        try {
          const metaverseResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&category=metaverse&order=market_cap_desc&per_page=80&page=1&sparkline=false`,
            { signal: abortController.signal }
          );

          if (metaverseResponse.ok) {
            const metaverseData = await metaverseResponse.json();
            if (metaverseData && Array.isArray(metaverseData)) {
              setMetaverseCoins(metaverseData);
              setMetaverseFilter(metaverseData);
            }
          }
        } catch (metaverseError) {
          console.warn('Metaverse coins fetch failed, continuing with main coins:', metaverseError);
        }

        setLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch was aborted');
          return;
        }
        console.error('Error fetching coins:', error);
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(() => {
      if (!abortController.signal.aborted) {
        fetchCoins();
      }
    }, 30000);

    return () => {
      abortController.abort();
      clearInterval(interval);
    };
  }, [currency]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (tabState === 'all coins') {
      if (filteredArray.length > 0) {
        const mutateArr = filteredArray.filter((item) => {
          const coinName = item.id.toLowerCase().includes(searchTerm.toLowerCase());
          const coinSymbol = item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
          return coinName || coinSymbol;
        });
        setCryptoData(mutateArr);
        setActive(1);
        setPage(1);
      }
    } else if (tabState === 'metaverse') {
      if (metaverseFilter.length > 0) {
        const mutateArr = metaverseFilter.filter((item) => {
          const coinName = item.id.toLowerCase().includes(searchTerm.toLowerCase());
          const coinSymbol = item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
          return coinName || coinSymbol;
        });
        setCryptoData(mutateArr);
        setActive(1);
        setPage(1);
      }
    }
  };

  const addToFavouritesHandler = (coin: Coin) => {
    const isAlreadyFavorite = reduxFavouritesARR.some(fav => fav.id === coin.id);

    if (isAlreadyFavorite) {
      dispatch(favouritesActions.removeFromFavourites(coin));
      toast({
        title: '',
        description: 'Removed from Favourites',
        status: 'info',
        duration: 1500,
        isClosable: true,
      });
    } else {
      dispatch(favouritesActions.addToFavourites(coin));
      toast({
        title: '',
        description: 'Added to Favourites',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const currencyModalToggle = () => {
    setCurrencyModal(!currencyModal);
  };

  const metaVerseCategrotyHandler = () => {
    setCryptoData(metaverseCoins);
    setTabState('metaverse');
  };

  const allCoinsHandler = () => {
    setCryptoData(originalARR);
    setTabState('all coins');
  };

  const lowTOhighHanler = () => {
    const sortedData = [...cryptoData].sort((a, b) => a.current_price - b.current_price);
    setCryptoData(sortedData);
  };

  const highTOlowHandler = () => {
    const sortedData = [...cryptoData].sort((a, b) => b.current_price - a.current_price);
    setCryptoData(sortedData);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-light dark:bg-gradient-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 dark:bg-primary-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 dark:bg-primary-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8">
            {/* Left side - Text content */}
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Track Crypto
                <span className="block bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                  Like a Pro
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
                Monitor real-time prices, track your portfolio, and stay ahead of the market with Ctracks comprehensive crypto tracking platform.
              </p>

              {/* Cryptocurrency Markets Section Header */}
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Cryptocurrency Markets
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover and track the top cryptocurrencies by market capitalization
                </p>
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white/20 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-dark-border">
                <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Digital Assets Tracked</div>
              </div>
              <div className="bg-white/20 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-dark-border">
                <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Global Exchanges</div>
              </div>
              <div className="bg-white/20 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-dark-border">
                <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">$5B+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Market Cap</div>
              </div>
            </div>
          </div>

          {/* Lower Half - Cryptocurrency Markets Data */}
          <div className="bg-white/10 dark:bg-dark-card/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 dark:border-dark-border shadow-lg dark:shadow-none">

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={searchHandler}
                  className="pl-10 pr-4 py-3 w-full sm:w-80 bg-white/50 dark:bg-dark-bg/50 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={currencyModalToggle}
                  className="flex items-center gap-2 px-4 py-3 bg-white/50 dark:bg-dark-bg/50 border border-gray-200 dark:border-dark-border rounded-xl hover:bg-white/70 dark:hover:bg-dark-bg/70 transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium"
                >
                  <span>Currency</span>
                  <AiFillCaretDown className={`transform transition-transform duration-200 ${currencyModal ? 'rotate-180' : ''}`} />
                </button>

                {/* Currency Dropdown */}
                {currencyModal && (
                  <div className="absolute top-14 right-0 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden min-w-[160px]">
                    <button
                      onClick={() => {
                        setCurrency('usd');
                        setCurrencyModal(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <AiOutlineDollarCircle className='text-xl' />
                      <span>USD</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrency('inr');
                        setCurrencyModal(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium border-t border-gray-200 dark:border-dark-border"
                    >
                      <BiRupee className='text-xl' />
                      <span>INR</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={allCoinsHandler}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  tabState === 'all coins'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white/30 dark:bg-dark-bg/30 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-dark-bg/50'
                }`}
              >
                All Coins
              </button>
              <button
                onClick={metaVerseCategrotyHandler}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  tabState === 'metaverse'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white/30 dark:bg-dark-bg/30 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-dark-bg/50'
                }`}
              >
                Metaverse
              </button>
            </div>
          </div>

          {/* Main Crypto Table */}
          <div className="overflow-hidden rounded-xl border border-white/20 dark:border-dark-border">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Loading cryptocurrency data...</p>
                </div>
              </div>
            ) : cryptoData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <RxCrossCircled className="text-5xl text-red-500 mb-4" />
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  No Results Found
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Try adjusting your search criteria or check your connection
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/30 dark:bg-dark-bg/30">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">#</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Coin</th>
                      <th className="text-right py-4 px-6">
                        <Tooltip label="Sort by Price" hasArrow>
                          <div>
                            <button
                              onClick={lowTOhighHanler}
                              className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors ml-auto"
                            >
                              Price
                              <span className="text-lg">↕</span>
                            </button>
                          </div>
                        </Tooltip>
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900 dark:text-white hidden md:table-cell">24h Volume</th>
                      <th className="text-right py-4 px-6">
                        <Tooltip label="Sort by Market Cap" hasArrow>
                          <div>
                            <button
                              onClick={highTOlowHandler}
                              className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors ml-auto"
                            >
                              Market Cap
                              <span className="text-lg">↕</span>
                            </button>
                          </div>
                        </Tooltip>
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900 dark:text-white">24h Change</th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 dark:divide-dark-border">
                    {cryptoData.slice(page * 20 - 20, page * 20).map((coin, index) => (
                      <tr key={coin.id} className="hover:bg-white/20 dark:hover:bg-dark-bg/30 transition-colors">
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">
                          {(page - 1) * 20 + index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <Link href={`/${coin.id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <img
                              src={coin.image}
                              className="w-10 h-10 rounded-full"
                              alt={coin.id}
                              loading="lazy"
                            />
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {coin.id.length > 15 ? `${coin.id.substring(0, 15)}...` : coin.id}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                                {coin.symbol}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold text-gray-900 dark:text-white">
                          {currency === 'usd' ? '$' : '₹'}{coin.current_price.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right text-gray-600 dark:text-gray-400 hidden md:table-cell">
                          {currency === 'usd' ? '$' : '₹'}{(coin.total_volume / 1e6).toFixed(1)}M
                        </td>
                        <td className="py-4 px-6 text-right text-gray-600 dark:text-gray-400">
                          {currency === 'usd' ? '$' : '₹'}{(coin.market_cap / 1e9).toFixed(2)}B
                        </td>
                        <td className={`py-4 px-6 text-right font-semibold ${
                          coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <div className="flex items-center justify-end space-x-1">
                            {coin.price_change_percentage_24h > 0 ? (
                              <FiTrendingUp className="w-4 h-4" />
                            ) : (
                              <FiTrendingDown className="w-4 h-4" />
                            )}
                            <span>{coin.price_change_percentage_24h.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => addToFavouritesHandler(coin)}
                            className="p-2 hover:bg-white/10 dark:hover:bg-dark-bg/30 rounded-lg transition-colors"
                          >
                            {reduxFavouritesARR.some(fav => fav.id === coin.id) ? (
                              <AiFillStar className="w-5 h-5 text-yellow-500 transition-colors" />
                            ) : (
                              <AiOutlineStar className="w-5 h-5 text-gray-400 hover:text-yellow-500 transition-colors" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {cryptoData.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-white/20 dark:border-dark-border">
              {pages.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPage(item);
                    setActive(item);
                  }}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                    active === item
                      ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                      : 'bg-white/20 dark:bg-dark-bg/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-dark-bg/30 hover:transform hover:scale-105'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
      
