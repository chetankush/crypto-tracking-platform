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
            if (error.name === 'AbortError') {
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
            if (error.name === 'AbortError') {
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
        <div>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-6"></div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Coin Details</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">Fetching {props.cryptoName} data...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments</p>
                    </div>
                </div>
            ) : coinDetailData && coinDetailData.market_data ? <div>

                {coinDetailData && coinDetailData.market_data && <>

                    <nav className="container interFont lg:ml-20">
                        <ol className="list-reset py-4 pl-1 rounded flex bg-gray-50 dark:bg-dark-bg/50 text-gray-600 dark:text-gray-300">
                            <li className="px-2 text-gray-400 dark:text-gray-300"><a className="no-underline text-indigo-600 dark:text-indigo-400">Cryptocurrencies</a></li>
                            <li className="text-gray-400 dark:text-gray-300">/</li>
                            <li className="px-2 text-gray-400 dark:text-gray-300"><a className="no-underline text-indigo-600 dark:text-indigo-400">Coins</a></li>
                            <li className="text-gray-400 dark:text-gray-300">/</li>
                            <li className="px-2 capitalize text-gray-900 dark:text-white font-medium">{props.cryptoName}</li>
                            <li className="text-gray-400 dark:text-gray-300">/</li>
                            <li className="px-2 text-gray-400 dark:text-gray-300"><Link href={"/"} className="no-underline text-indigo-600 dark:text-indigo-400 hover:underline">Home</Link></li>
                        </ol>
                    </nav>

                    <div className="coinDetailHeaderParentHold interFont flex justify-start ml-4 md:ml-0 mt-8 md:mt-0 md:justify-evenly gap-8 flex-wrap items-center">

                        <div className="coinDetailParentOne mb-9 md:mb-0">
                            <div className='flex items-center gap-6'>
                                {<img src={coinDetailData.image.large} className='md:w-28 w-24 rounded-full' alt='ada' />}
                                <div className="flex flex-col gap-8 items-center -ml-4">
                                    <p className='font-normal text-xl uppercase text-gray-900 dark:text-white'> {coinDetailData.id} <span className='text-gray-400 dark:text-gray-300 font-normal text-sm relative -top-4'> #{coinDetailData.market_cap_rank} </span> </p>
                                    <p className='font-semibold text-2xl text-gray-900 dark:text-white'> ${coinDetailData.market_data.current_price.usd.toLocaleString()}


                                        <span className={coinDetailData.market_data.price_change_24h < 0 ? 'text-red-500' : 'text-green-500'}>
                                            {coinDetailData.market_data.price_change_24h < 0 ?
                                                <div className="flex items-center justify-end relative -top-14 left-5">
                                                    <span className='text-sm'>
                                                        {coinDetailData.market_data.price_change_24h.toFixed(0)}$
                                                    </span>
                                                </div>
                                                :
                                                <div className="flex items-center justify-end relative -top-14 left-5">
                                                    <span className='text-sm'>
                                                        +${coinDetailData.market_data.price_change_24h.toFixed(0)}
                                                    </span>
                                                </div>}
                                        </span>


                                    </p>
                                </div>
                            </div>

                        </div>

                        {  /* CHILD2 TRENDING COINS - DESKTOP */}

                        {trendingCoinsData.length > 0 && (
                            <div className='hidden md:flex justify-center items-center gap-10 coinDetailCarouselHold mb-9 md:mb-0 bg-white dark:bg-dark-card rounded-md shadow-lg dark:shadow-none border border-gray-200 dark:border-dark-border p-4'>
                                <Swiper spaceBetween={5} slidesPerView={5} loop={true} parallax={true} modules={[Autoplay]} autoplay={{ delay: 1000 }} breakpoints={{ 300: { slidesPerView: 2 }, 700: { slidesPerView: 3 }, 1280: { slidesPerView: 5 } }} className='swiperCaro' >
                                    {trendingCoinsData.map((coin, index) => {
                                        return (
                                            <div key={index}>
                                                <SwiperSlide>
                                                    <div >
                                                        <div className="flex gap-6 flex-wrap">
                                                            <img src={coin.item.small} alt="" className='bg-white rounded-full w-16' />
                                                            <p className='text-gray-400 dark:text-gray-300 font-semibold text-sm'> #{coin.item.market_cap_rank} </p>
                                                        </div>
                                                        <br />
                                                        <div className="flex flex-col gap-4">
                                                            <p className='text-base font-semibold text-gray-900 dark:text-white'>{coin.item.name.substring(0, 8)}</p>
                                                            <p className='text-gray-400 dark:text-gray-300 font-normal text-sm uppercase'> {coin.item.symbol} </p>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>

                                            </div>
                                        )
                                    })}
                                </Swiper>
                            </div>
                        )}
                    </div>

                </>}

                {trendingCoinsData.length > 0 && <div className="coinDetailTagsHold ml-4 md:flex-col flex-row flex w37percent items-center lg:flex">

                    <div className='flex items-center gap-4 justify-start w48percent w-full flex-wrap mt-3'>
                        {coinDetailData.categories && coinDetailData.categories[0] && <p className="bg-gray-200 dark:bg-dark-bg text-gray-700 dark:text-gray-200 w-auto pl-3 pr-3 flex justify-center shadow-sm dark:shadow-none border border-gray-300 dark:border-dark-border items-center rounded h-auto pt-2 pb-1"> {coinDetailData.categories[0]} </p>}
                        {coinDetailData.categories && coinDetailData.categories[1] && <p className="bg-gray-200 dark:bg-dark-bg text-gray-700 dark:text-gray-200 w-auto pl-3 pr-3 flex justify-center shadow-sm dark:shadow-none border border-gray-300 dark:border-dark-border items-center rounded h-auto pt-2 pb-1"> {coinDetailData.categories[1]} </p>}
                    </div>

                </div>}

                <br />

                {trendingCoinsData.length > 0 && <div className="coinDetailTagsHold ml-4 md:flex-col flex-row flex w37percent items-center lg:flex">

                    <div className='flex items-center gap-4 justify-start w48percent w-full flex-wrap mt-3'>
                        {coinDetailData.links && coinDetailData.links.homepage[0] && <Link href={`${coinDetailData.links.homepage[0]}`} target="_blank" className="bg-gray-200 dark:bg-dark-bg text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white w-auto pl-3 pr-3 flex justify-center items-center rounded-full h-9 shadow-sm dark:shadow-none border border-gray-300 dark:border-dark-border hover:shadow-md dark:hover:shadow-none hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200">  <IoHome className="text-lg" /> </Link>}
                        {coinDetailData.links && coinDetailData.links.repos_url.github[0] && <Link href={`${coinDetailData.links.repos_url.github[0]}`} target='_blank' className="bg-gray-200 dark:bg-dark-bg text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white w-auto pl-3 pr-3 flex justify-center items-center rounded-full h-9 shadow-sm dark:shadow-none border border-gray-300 dark:border-dark-border hover:shadow-md dark:hover:shadow-none hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200"> <FaGithub className="text-lg" /> </Link>}
                        {coinDetailData.links && coinDetailData.links.subreddit_url && <Link href={`${coinDetailData.links.subreddit_url}`} target='_blank' className="bg-gray-200 dark:bg-dark-bg text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white w-auto pl-3 pr-3 flex justify-center items-center rounded-full h-9 shadow-sm dark:shadow-none border border-gray-300 dark:border-dark-border hover:shadow-md dark:hover:shadow-none hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200"> <FaReddit className="text-lg" /> </Link>}

                    </div>

                </div>}

                {  /* CHILD2 TRENDING COINS - MOBILE */}

                {trendingCoinsData.length > 0 && (
                    <div className='flex md:hidden justify-center items-center gap-10 coinDetailCarouselHold mt-8 mb-9 bg-white dark:bg-dark-card rounded-md shadow-lg dark:shadow-none border border-gray-200 dark:border-dark-border p-4 ml-4 mr-4'>
                        <Swiper spaceBetween={5} slidesPerView={5} loop={true} parallax={true} modules={[Autoplay]} autoplay={{ delay: 1000 }} breakpoints={{ 300: { slidesPerView: 2 }, 700: { slidesPerView: 3 }, 1280: { slidesPerView: 5 } }} className='swiperCaro' >
                            {trendingCoinsData.map((coin, index) => {
                                return (
                                    <div key={index}>
                                        <SwiperSlide>
                                            <div >
                                                <div className="flex gap-6 flex-wrap">
                                                    <img src={coin.item.small} alt="" className='bg-white rounded-full w-16' />
                                                    <p className='text-gray-400 dark:text-gray-300 font-semibold text-sm'> #{coin.item.market_cap_rank} </p>
                                                </div>
                                                <br />
                                                <div className="flex flex-col gap-4">
                                                    <p className='text-base font-semibold text-gray-900 dark:text-white'>{coin.item.name.substring(0, 8)}</p>
                                                    <p className='text-gray-400 dark:text-gray-300 font-normal text-sm uppercase'> {coin.item.symbol} </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>

                                    </div>
                                )
                            })}
                        </Swiper>
                    </div>
                )}

                <br />
                <br />
                <br />

                {trendingCoinsData.length > 0 && (
                    <div className="coindDetailStats1Hold pr-4 pl-4 mx-4">
                        {/* Desktop Layout */}
                        <div className="hidden lg:flex items-center justify-evenly flex-wrap gap-10">
                            <div className="coinDetailStat1Hold items-center flex flex-col gap-8">
                                <p className='text-xl font-semibold w-full pl-4 text-gray-900 dark:text-white'>Market Cap</p>
                                <div className="pl-3">
                                    <div className="flex items-center gap-2">
                                        <span className='text-2xl font-semibold text-gray-400 dark:text-gray-300 interFont'>$</span>
                                        {coinDetailData.market_data && coinDetailData.market_data.market_cap.usd && <p className='font-semibold text-gray-800 dark:text-gray-100 interFont'>  {coinDetailData.market_data.market_cap.usd.toLocaleString()} </p>}
                                    </div>
                                </div>
                            </div>

                            <p className='bg-gray-100 dark:bg-dark-border coinDetailDivider h-28'></p>

                            <div className="coinDetailStat1Hold items-center flex flex-col gap-8">
                                <p className='text-xl font-semibold w-full pl-4 text-gray-900 dark:text-white'>Fully Diluted</p>
                                <div className="">
                                    <div className="flex items-center gap-2">
                                        <span className='text-2xl font-semibold text-gray-400 dark:text-gray-300 interFont'>$</span>
                                        {coinDetailData.market_data && coinDetailData.market_data.fully_diluted_valuation.usd && <p className='font-semibold text-gray-800 dark:text-gray-100 interFont'>  {coinDetailData.market_data.fully_diluted_valuation.usd.toLocaleString()} </p>}
                                    </div>
                                </div>
                            </div>

                            <p className='bg-gray-100 dark:bg-dark-border coinDetailDivider h-28'></p>

                            <div className="coinDetailStat1Hold items-center flex flex-col gap-8">
                                <p className='text-xl font-semibold w-full pl-4 text-gray-900 dark:text-white'>Volume</p>
                                <div className="pl-3">
                                    <div className="flex items-center gap-2">
                                        <span className='text-2xl font-semibold text-gray-400 dark:text-gray-300 interFont'>$</span>
                                        {coinDetailData.market_data && coinDetailData.market_data.total_volume.usd && <p className='font-semibold text-gray-800 dark:text-gray-100 interFont'>  {coinDetailData.market_data.total_volume.usd.toLocaleString()} </p>}
                                    </div>
                                </div>
                            </div>

                            <p className='bg-gray-100 dark:bg-dark-border coinDetailDivider h-28'></p>

                            <div className="coinDetailStat1Hold items-center flex flex-col gap-8">
                                <p className='text-xl font-semibold w-full pl-4 text-gray-900 dark:text-white'>Circulating Supply</p>
                                <div className="pl-3">
                                    <div className="flex items-center gap-2">
                                        <span className='text-2xl font-semibold text-gray-400 dark:text-gray-300 interFont'>$</span>
                                        {coinDetailData.market_data && coinDetailData.market_data.circulating_supply && coinDetailData.symbol && <p className='font-semibold text-gray-800 dark:text-gray-100 interFont'>  {Math.floor(coinDetailData.market_data.circulating_supply).toLocaleString()}<span className='text-gray-300 dark:text-gray-400 font-normal uppercase'> {coinDetailData.symbol} </span> </p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="lg:hidden grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-dark-border shadow-sm dark:shadow-none">
                                <p className='text-sm font-semibold text-gray-900 dark:text-white mb-2'>Market Cap</p>
                                <div className="flex items-center gap-1">
                                    <span className='text-lg font-semibold text-gray-400 dark:text-gray-300'>$</span>
                                    {coinDetailData.market_data && coinDetailData.market_data.market_cap.usd && <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{coinDetailData.market_data.market_cap.usd.toLocaleString()}</p>}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-dark-border shadow-sm dark:shadow-none">
                                <p className='text-sm font-semibold text-gray-900 dark:text-white mb-2'>Fully Diluted</p>
                                <div className="flex items-center gap-1">
                                    <span className='text-lg font-semibold text-gray-400 dark:text-gray-300'>$</span>
                                    {coinDetailData.market_data && coinDetailData.market_data.fully_diluted_valuation.usd && <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{coinDetailData.market_data.fully_diluted_valuation.usd.toLocaleString()}</p>}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-dark-border shadow-sm dark:shadow-none">
                                <p className='text-sm font-semibold text-gray-900 dark:text-white mb-2'>Volume</p>
                                <div className="flex items-center gap-1">
                                    <span className='text-lg font-semibold text-gray-400 dark:text-gray-300'>$</span>
                                    {coinDetailData.market_data && coinDetailData.market_data.total_volume.usd && <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{coinDetailData.market_data.total_volume.usd.toLocaleString()}</p>}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-dark-border shadow-sm dark:shadow-none">
                                <p className='text-sm font-semibold text-gray-900 dark:text-white mb-2'>Circulating Supply</p>
                                <div className="flex items-center gap-1">
                                    <span className='text-lg font-semibold text-gray-400 dark:text-gray-300'>$</span>
                                    {coinDetailData.market_data && coinDetailData.market_data.circulating_supply && coinDetailData.symbol && <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{Math.floor(coinDetailData.market_data.circulating_supply).toLocaleString()}<span className='text-gray-300 dark:text-gray-400 font-normal uppercase'> {coinDetailData.symbol}</span></p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <br />
                <br />
                <br />
                <br>
                </br>

                {trendingCoinsData.length > 0 && <CoinDetailChart cryptoName={coinName} specificCoinDetails={coinDetailData} />}

            </div>
                :
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
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