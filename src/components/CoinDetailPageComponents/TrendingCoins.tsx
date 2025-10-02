import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';
import { BsArrowUpRight } from "react-icons/bs"
import { FiTrendingDown } from "react-icons/fi"
import { FiTrendingUp } from "react-icons/fi"
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';

type topCoinObj = {
  coinName: string,
  image: string,
  percentChange: number,
  current_price: number,
  id: number,
  symbol: string,
  price_change_percentage_24h: number,
  high_24h: number,
  low_24h: number

}

const TrendingCoins = () => {
  const { isDark } = useTheme();
  const [topCoins, setTopCoins] = useState<topCoinObj[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchCoinData = async (signal: AbortSignal, retryCount = 0) => {
    try {
      setLoading(true);
      setHasError(false);

      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
        { signal }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Only update state if we have valid data
      if (data && Array.isArray(data) && data.length > 0) {
        setTopCoins(data);
        setLoading(false);
        setHasError(false);
      } else {
        // Retry up to 2 times if no data
        if (retryCount < 2) {
          setTimeout(() => {
            fetchCoinData(signal, retryCount + 1);
          }, 1000);
        } else {
          setLoading(false);
          setHasError(true);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Trending coins fetch was cancelled');
        return;
      }
      console.warn('Error fetching trending coins:', error);

      // Retry up to 2 times on error
      if (retryCount < 2) {
        setTimeout(() => {
          fetchCoinData(signal, retryCount + 1);
        }, 2000);
      } else {
        setLoading(false);
        setHasError(true);
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    fetchCoinData(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);


  const responsive = {
    0: {
      items: 1,
      stagePadding: {
        paddingLeft: 20,
        paddingRight: 20,
      },
    },
    768: {
      items: 2,
      stagePadding: {
        paddingLeft: 10,
        paddingRight: 10,
      },
    },

    1150: {
      items: 4,
      stagePadding: {
        paddingLeft: 40,
        paddingRight: 40,
      },
    },
  };



  return (
    <div className="mb-20">
      <div className="mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-12">
          Market Trends
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Top performing cryptocurrencies in the market
        </p>
      </div>

      <div className="relative">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading top 20 cryptocurrencies...</p>
            </div>
          </div>
        ) : hasError || topCoins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Market Data Unavailable
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Unable to load trending cryptocurrencies at the moment
              </p>
              <button
                onClick={() => {
                  setHasError(false);
                  setLoading(true);
                  const abortController = new AbortController();
                  fetchCoinData(abortController.signal);
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <AliceCarousel
            autoPlay={true}
            autoPlayInterval={3000}
            animationDuration={800}
            mouseTracking
            infinite={true}
            disableButtonsControls={true}
            disableDotsControls={true}
            responsive={responsive}
            paddingLeft={20}
            paddingRight={20}
          >
            {topCoins.map((item, index) => (
              <div
                key={item.id + index}
                className="mx-2 bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-none transition-all duration-300 hover:transform hover:scale-105"
              >
                <Link href={`/${item.id}`} className="block">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        className="w-10 h-10 rounded-full"
                        alt={item.symbol}
                        loading="lazy"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white uppercase text-sm">
                          {item.symbol.substring(0, 8)}
                        </p>
                        <span className="inline-block bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg text-xs font-medium capitalize">
                          {item.id.toString().substring(0, 11)}
                        </span>
                      </div>
                    </div>
                    <BsArrowUpRight className="text-gray-400 dark:text-gray-300 text-xl hover:text-primary-500 dark:hover:text-primary-400 transition-colors" />
                  </div>

                  <div className="border-t border-gray-200 dark:border-dark-border pt-4 mb-4"></div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Current Price
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        ${item.current_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        24h Change
                      </p>
                      <div className={`flex items-center gap-1 font-semibold ${
                        item.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.price_change_percentage_24h > 0 ? (
                          <FiTrendingUp className="w-4 h-4" />
                        ) : (
                          <FiTrendingDown className="w-4 h-4" />
                        )}
                        <span>{item.price_change_percentage_24h.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        24H High
                      </p>
                      <div className="flex items-center gap-1 text-green-500 font-medium">
                        <span>${item.high_24h.toLocaleString()}</span>
                        <FiTrendingUp className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        24H Low
                      </p>
                      <div className="flex items-center gap-1 text-red-500 font-medium">
                        <span>${item.low_24h.toLocaleString()}</span>
                        <FiTrendingDown className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </AliceCarousel>
        )}
      </div>
    </div>
  );
};

export default TrendingCoins;

/*

                  <div className='flex gap-2 text-sm'>
                  </div>


*/