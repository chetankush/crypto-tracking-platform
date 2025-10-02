import React from 'react'
import Link from 'next/link'
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Autoplay } from "swiper"
import Loading from './Loading';
import { IoHome } from "react-icons/io5"
import { FaGithub, FaReddit } from "react-icons/fa"
import CoinDetailChart from '@/components/CoinDetailPageComponents/CoinDetailChart';



interface CoinDetailDataType {
    image: {
        large: string;
    },

    market_data: {
        current_price: {
            usd: number
        },
        price_change_24h: number,
        market_cap: {
            usd: number
        },
        fully_diluted_valuation: {
            usd: number
        },
        total_volume: {
            usd: number
        },
        circulating_supply: number
    },

    id: string,
    market_cap_rank: number,
    categories: string[],
    symbol: string,
    links: {
        homepage: string[],
        repos_url: {
            github: string[]
        },
        subreddit_url: string,
    }

}


type CoinData = {
    item: {
        id: number;
        name: string;
        price: number;
        symbol: string;
        market_cap_rank: number;
        small: string
        // add other properties as needed
    };
};



const CoinDetailHero = (props: any) => {

    const [coinDetailData, setCoinDetailData] = useState<CoinDetailDataType>({
        image: {
            large: ''
        },

        market_data: {
            current_price: {
                usd: 0
            },
            price_change_24h: 0,
            market_cap: {
                usd: 0
            },
            fully_diluted_valuation: {
                usd: 0
            },
            total_volume: {
                usd: 0
            },
            circulating_supply: 0
        },

        id: '',
        market_cap_rank: 0,
        categories: [],
        symbol: '',
        links: {
            homepage: [""],
            repos_url: {
                github: [""]
            },
            subreddit_url: "",
        }
    })
    const [trendingCoinsData, setTrendingCoinsData] = useState<CoinData[]>([])
    const [coinName, setCoinName] = useState<string>("")
    const [loading, setLoading] = useState(true)


    const fetchDataHandler = async (signal: AbortSignal) => {
        console.log('🚀 Starting to fetch coin details for:', props.cryptoName);
        setLoading(true);

        try {
            console.log('📡 Fetching coin detail data...');
            const response1 = await fetch(
                `https://api.coingecko.com/api/v3/coins/${props.cryptoName}?tickers=false&community_data=false&developer_data=false`,
                { signal }
            );
            if (!response1.ok) {
                throw new Error(`Error fetching coin detail data: ${response1.status} ${response1.statusText}`);
            }
            const data1 = await response1.json();
            console.log('✅ Coin detail data loaded:', data1.id, data1.name);
            setCoinDetailData(data1);
            setCoinName(data1.id);

        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('⚠️ Coin detail fetch was cancelled');
                return;
            }
            console.error('❌ Error fetching coin detail data:', error);
            setLoading(false);
            return;
        }

        try {
            console.log('📡 Fetching trending coins data...');
            const response2 = await fetch('https://api.coingecko.com/api/v3/search/trending', { signal });
            if (!response2.ok) {
                throw new Error(`Error fetching trending coins data: ${response2.status} ${response2.statusText}`);
            }
            const data2 = await response2.json();
            console.log('✅ Trending coins data loaded:', data2.coins.length, 'coins');
            setTrendingCoinsData(data2.coins);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('⚠️ Trending coins fetch was cancelled');
                return;
            }
            console.error('❌ Error fetching trending coins data:', error);
        }

        console.log('🎉 All coin data loading completed!');
        setLoading(false);
    };


    useEffect(() => {
        if (props.cryptoName) {
            const abortController = new AbortController();
            fetchDataHandler(abortController.signal);

            return () => {
                abortController.abort();
            };
        }
    }, [props.cryptoName])




    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Coin Details</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">Fetching {props.cryptoName} data...</p>
                    </div>
                </div>
            ) : coinDetailData && coinDetailData.market_data ? <div className="max-w-7xl mx-auto px-4 py-6">

                {coinDetailData && coinDetailData.market_data && <>

                    <nav className="mb-6">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li className="text-gray-500 dark:text-gray-400">Cryptocurrencies</li>
                            <li className="text-gray-400 dark:text-gray-600">/</li>
                            <li className="text-gray-500 dark:text-gray-400">Coins</li>
                            <li className="text-gray-400 dark:text-gray-600">/</li>
                            <li className="capitalize text-gray-900 dark:text-white font-medium">{props.cryptoName}</li>
                            <li className="text-gray-400 dark:text-gray-600">/</li>
                            <li><Link href={"/"} className="text-blue-600 dark:text-blue-400 hover:underline">Home</Link></li>
                        </ol>
                    </nav>

                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border p-6 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-6">
                            <div className="flex items-center gap-4">
                                <img src={coinDetailData.image.large} className='w-16 h-16 rounded-full' alt={coinDetailData.id} />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className='text-2xl font-bold uppercase text-gray-900 dark:text-white'>{coinDetailData.id}</h1>
                                        <span className='bg-gray-100 dark:bg-dark-border px-2 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-300'>
                                            #{coinDetailData.market_cap_rank}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-3">
                                        <p className='text-3xl font-bold text-gray-900 dark:text-white'>
                                            ${coinDetailData.market_data.current_price.usd.toLocaleString()}
                                        </p>
                                        <span className={`text-sm font-semibold ${coinDetailData.market_data.price_change_24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {coinDetailData.market_data.price_change_24h < 0 ? '' : '+'}
                                            ${coinDetailData.market_data.price_change_24h.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {coinDetailData.links && coinDetailData.links.homepage[0] && (
                                    <Link href={coinDetailData.links.homepage[0]} target="_blank" className="p-2 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                        <IoHome className="text-lg text-gray-600 dark:text-gray-300" />
                                    </Link>
                                )}
                                {coinDetailData.links && coinDetailData.links.repos_url.github[0] && (
                                    <Link href={coinDetailData.links.repos_url.github[0]} target='_blank' className="p-2 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                        <FaGithub className="text-lg text-gray-600 dark:text-gray-300" />
                                    </Link>
                                )}
                                {coinDetailData.links && coinDetailData.links.subreddit_url && (
                                    <Link href={coinDetailData.links.subreddit_url} target='_blank' className="p-2 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                        <FaReddit className="text-lg text-gray-600 dark:text-gray-300" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {coinDetailData.categories && coinDetailData.categories.length > 0 && (
                            <div className="flex items-center gap-2 mt-4">
                                {coinDetailData.categories[0] && (
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                                        {coinDetailData.categories[0]}
                                    </span>
                                )}
                                {coinDetailData.categories[1] && (
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                                        {coinDetailData.categories[1]}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                </>}

                {trendingCoinsData.length > 0 && (
                    <div className='bg-white dark:bg-dark-card rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border p-6 mb-6'>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trending Coins</h2>
                        <Swiper spaceBetween={15} slidesPerView={5} loop={true} parallax={true} modules={[Autoplay]} autoplay={{ delay: 2000 }} breakpoints={{ 300: { slidesPerView: 2 }, 700: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }} className='swiperCaro' >
                            {trendingCoinsData.map((coin, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div className="flex flex-col items-center text-center p-3 hover:bg-gray-50 dark:hover:bg-dark-border rounded-lg transition-colors">
                                            <img src={coin.item.small} alt={coin.item.name} className='w-12 h-12 rounded-full mb-2' />
                                            <p className='text-xs text-gray-400 dark:text-gray-500 mb-1'>#{coin.item.market_cap_rank}</p>
                                            <p className='text-sm font-semibold text-gray-900 dark:text-white mb-1'>{coin.item.name.substring(0, 10)}</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 uppercase'>{coin.item.symbol}</p>
                                        </div>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </div>
                )}

                {trendingCoinsData.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium'>Market Cap</p>
                            <p className='text-xl font-bold text-gray-900 dark:text-white'>
                                ${coinDetailData.market_data && coinDetailData.market_data.market_cap.usd && coinDetailData.market_data.market_cap.usd.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium'>Fully Diluted</p>
                            <p className='text-xl font-bold text-gray-900 dark:text-white'>
                                ${coinDetailData.market_data && coinDetailData.market_data.fully_diluted_valuation.usd && coinDetailData.market_data.fully_diluted_valuation.usd.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium'>24h Volume</p>
                            <p className='text-xl font-bold text-gray-900 dark:text-white'>
                                ${coinDetailData.market_data && coinDetailData.market_data.total_volume.usd && coinDetailData.market_data.total_volume.usd.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-border">
                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium'>Circulating Supply</p>
                            <p className='text-xl font-bold text-gray-900 dark:text-white'>
                                {coinDetailData.market_data && coinDetailData.market_data.circulating_supply && Math.floor(coinDetailData.market_data.circulating_supply).toLocaleString()}
                                <span className='text-sm text-gray-400 dark:text-gray-500 font-normal ml-1 uppercase'>{coinDetailData.symbol}</span>
                            </p>
                        </div>
                    </div>
                )}

                {trendingCoinsData.length > 0 && <CoinDetailChart cryptoName={coinName} specificCoinDetails={coinDetailData} />}

            </div>
                :
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center p-8 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-6"></div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Coin Data</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">Failed to load {props.cryptoName} details</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Please try refreshing the page</p>
                    </div>
                </div>

            }
        </div>
    )
}

export default CoinDetailHero