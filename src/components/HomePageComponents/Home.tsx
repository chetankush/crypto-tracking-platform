import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import styles from "../../styles/HomeComnponent.module.css"
import { FaSearch } from "react-icons/fa"
import { AiFillDollarCircle, AiOutlineStar, AiFillDelete } from "react-icons/ai"
import { RxCrossCircled, RxCross1 } from "react-icons/rx"
import { FiTrendingDown } from "react-icons/fi"
import { FiTrendingUp } from "react-icons/fi"
import { AiFillCaretDown } from "react-icons/ai"
import { AiOutlineDollarCircle, AiFillStar } from "react-icons/ai"
import { BiRupee } from "react-icons/bi"
import { useToast } from '@chakra-ui/react'
import { favouritesActions } from "../../ReduxStore/FavouritesSlice";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerContentProps,
    DrawerProps,

} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { HiOutlineArrowsUpDown } from "react-icons/hi2"
import { Tooltip } from '@chakra-ui/react'
import Footer from './Footer';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';

type topCoinObj = {
    coinName: string,
    image: string,
    percentChange: number,
    current_price: number,
    id: string,
    symbol: string,
    price_change_percentage_24h: number,
    market_cap: number,
    total_volume: number
}


type CryptoCoin = {
    id: string;
    price: number;
    image: string;
    name: string;
};

const HomeComnponent = () => {
    const { isDark } = useTheme();

    const [cryptoData, setCryptoData] = useState<topCoinObj[]>([]);  // all coins
    const [filteredArray, setFilteredArray] = useState<topCoinObj[]>([]); // all coins
    const [seacrhTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState<number>(1);
    const [active, setActive] = useState(1);
    const [currencyModal, setCurrecnyModal] = useState(false);
    const [currency, setCurrency] = useState("usd");
    const [metaverseCoins, setMetavserseCoins] = useState<topCoinObj[]>([]) // metaverse coins
    const [metaverseFilter, setMetaverseFilter] = useState<topCoinObj[]>([]); // metaverse coins

    const [gamingCoins, setGamingCoins] = useState<topCoinObj[]>([]) // gaimng
    const [gamingFilter, setGamingFilter] = useState<topCoinObj[]>([]) // gaimng

    const [originalARR, setOriginalARR] = useState([]);
    const [tabState, setTabState] = useState("all coins");


    const pages = [1, 2, 3, 4];

    const reduxFavouritesARR: any[] = useSelector((state: any) => state.favourites.list);
    const toast = useToast();
    const dispacth = useDispatch();


    // Load favorites on component mount
    useEffect(() => {
        dispacth(favouritesActions.loadFavourites());
    }, [dispacth]);

    //fecthnig data
    useEffect(() => {
        // all coins
        fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=80&page=1&sparkline=false`
        )
            .then((response) => response.json())
            .then((data) => {
                setCryptoData(data)
                setOriginalARR(data);
                setFilteredArray(data);
            })
            .catch((error) => {
                // Handle error
                throw new Error('Error fetching all coins: ' + error);
            });

        // metaverse
        fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&category=metaverse&order=market_cap_desc&per_page=80&page=1&sparkline=false`
        )
            .then((response) => response.json())
            .then((data) => {
                setMetavserseCoins(data)
                setMetaverseFilter(data)
            })
            .catch((error) => {
                // Handle error
                throw new Error('Error fetching metaverse coins: ' + error);
            });

        // gaming
        /* fetch(
             `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&category=gaming&order=market_cap_desc&per_page=80&page=1&sparkline=false`
         )
             .then((response) => response.json())
             .then((data) => {
                 setGamingCoins(data)
                 setGamingFilter(data)
             })
             .catch((error) => {
                 // Handle error
                 throw new Error('Error fetching gaming coins: ' + error);
             });*/

    }, [currency]);




    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        // search for all coins
        if (tabState === "all coins") {

            if (filteredArray.length > 0) {
                const mutateArr = filteredArray.filter((item) => {
                    const coinName = item.id.toLowerCase().includes(searchTerm.toLowerCase());
                    const coinSymbol = item.symbol.toLowerCase().includes(searchTerm.toLowerCase());

                    return coinName || coinSymbol
                });

                setCryptoData(mutateArr);

                // Reset the active page to the first page
                setActive(1);
                setPage(1);
            }
        }

        // search for metaverse

        else if (tabState === "metaverse") {

            if (metaverseFilter.length > 0) {
                const mutateArr = metaverseFilter.filter((item) => {
                    const coinName = item.id.toLowerCase().includes(searchTerm.toLowerCase());
                    const coinSymbol = item.symbol.toLowerCase().includes(searchTerm.toLowerCase());

                    return coinName || coinSymbol
                });

                setCryptoData(mutateArr);

                // Reset the active page to the first page
                setActive(1);
                setPage(1);
            }
        }

        // search for gaming


        else if (tabState === "gaming") {

            if (gamingFilter.length > 0) {
                const mutateArr = gamingFilter.filter((item) => {
                    const coinName = item.id.toLowerCase().includes(searchTerm.toLowerCase());
                    const coinSymbol = item.symbol.toLowerCase().includes(searchTerm.toLowerCase());

                    return coinName || coinSymbol
                });

                setCryptoData(mutateArr);

                // Reset the active page to the first page
                setActive(1);
                setPage(1);
            }
        }



    };


    // redux methods
    const addToFavouritesHandler = (coin: topCoinObj) => {
        const isAlreadyFavorite = reduxFavouritesARR.some(fav => fav.id === coin.id);

        if (isAlreadyFavorite) {
            dispacth(favouritesActions.removeFromFavourites(coin));
            toast({
                title: "",
                description: "Removed from Favourites",
                status: "info",
                duration: 1500,
                isClosable: true,
            });
        } else {
            dispacth(favouritesActions.addToFavourites(coin));
            toast({
                title: "",
                description: "Added to Favourites",
                status: "success",
                duration: 1500,
                isClosable: true,
            });
        }
    }

    const removeFromFavHandler = (coin: topCoinObj) => {
        dispacth(favouritesActions.removeFromFavourites(coin))
    }



    // currecny modal
    const currencyModalToggle = () => {
        setCurrecnyModal(!currencyModal)
    }


    // tabs change 
    const metaVerseCategrotyHandler = () => {
        setCryptoData(metaverseCoins)
        setTabState("metaverse")
    }

    const gamingCoinsCategoryHandler = () => {
        setCryptoData(gamingCoins)
        setTabState("gaming")
    }

    const allCoinsHandler = () => {
        setCryptoData(originalARR)
        setTabState("all coins")
    }

    // add to favourites drawer 
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sortOrder, setSortOrder] = useState('none');


    const lowTOhighHanler = () => {

        const sortedData = [...cryptoData].sort((a, b) => a.current_price - b.current_price);
        setCryptoData(sortedData);
    }

    const highTOlowHandler = () => {
        const sortedData = [...cryptoData].sort((a, b) => b.current_price - a.current_price);
        setCryptoData(sortedData);
    }


    const MyDrawerContent: React.FC<DrawerProps> = ({ children }) => {
        // Your implementation here
        return <DrawerContent>{children}</DrawerContent>
    };

    const MyDrawerBody: React.FC<DrawerProps> = ({ children }) => {
        // Your implementation here
        return <DrawerBody>{children}</DrawerBody>
    };


    return (

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Cryptocurrency Markets
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Discover and track the top cryptocurrencies by market capitalization
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
                    {/* Search Bar */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search cryptocurrencies..."
                            value={seacrhTerm}
                            onChange={searchHandler}
                            className="pl-10 pr-4 py-3 w-full sm:w-80 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                        />
                    </div>

                    {/* Currency Selector */}
                    <div className="relative">
                        <button
                            onClick={currencyModalToggle}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium"
                        >
                            <span>Currency</span>
                            <AiFillCaretDown className={`transform transition-transform duration-200 ${currencyModal ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Currency Dropdown */}
                    {currencyModal && (
                        <div className="absolute top-14 right-0 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden min-w-[160px]">
                            <button
                                onClick={() => {
                                    setCurrency("usd");
                                    setCurrecnyModal(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium"
                            >
                                <AiOutlineDollarCircle className='text-xl' />
                                <span>USD</span>
                            </button>
                            <button
                                onClick={() => {
                                    setCurrency("inr");
                                    setCurrecnyModal(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium border-t border-gray-200 dark:border-dark-border"
                            >
                                <BiRupee className='text-xl' />
                                <span>INR</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3 items-center">
                    <button
                        onClick={allCoinsHandler}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                            tabState === "all coins"
                                ? "bg-primary-500 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                        All Coins
                    </button>
                    <button
                        onClick={metaVerseCategrotyHandler}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                            tabState === "metaverse"
                                ? "bg-primary-500 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                        Metaverse
                    </button>
                    <button
                        onClick={onOpen}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-all duration-200"
                    >
                        <AiOutlineStar className='text-lg' />
                        Favourites
                    </button>
                </div>

            </div>

            {/* Main Crypto Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-dark-border">
                {cryptoData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <RxCrossCircled className="text-5xl text-red-500 mb-4" />
                        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            No Results Found
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Try adjusting your search criteria
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-dark-bg/50">
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

                            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                                {cryptoData.slice(page * 20 - 20, page * 20).map((coin, index) => (
                                    <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
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
                                            {currency === "usd" ? "$" : "₹"}{coin.current_price.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-right text-gray-600 dark:text-gray-400 hidden md:table-cell">
                                            {currency === "usd" ? "$" : "₹"}{(coin.total_volume / 1e6).toFixed(1)}M
                                        </td>
                                        <td className="py-4 px-6 text-right text-gray-600 dark:text-gray-400">
                                            {currency === "usd" ? "$" : "₹"}{(coin.market_cap / 1e9).toFixed(2)}B
                                        </td>
                                        <td className={`py-4 px-6 text-right font-semibold ${
                                            coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
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
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
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
                <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-dark-border">
                    {pages.map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                setPage(item);
                                setActive(item);
                            }}
                            className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                                active === item
                                    ? "bg-primary-500 text-white shadow-lg transform scale-105"
                                    : "bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:transform hover:scale-105"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}


            {/* Favourites Drawer */}
            <Drawer onClose={onClose} isOpen={isOpen} size="md">
                <DrawerOverlay bg="blackAlpha.300" />
                <DrawerContent bg={isDark ? "#1e293b" : "white"} color={isDark ? "white" : "black"}>
                    <DrawerHeader borderBottomWidth="1px" borderColor={isDark ? "#334155" : "gray.200"}>
                        <div className="flex items-center gap-3">
                            <AiFillStar className="text-3xl text-yellow-500" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">My Favourites</span>
                        </div>
                    </DrawerHeader>
                    <DrawerBody className="p-6">
                        {reduxFavouritesARR.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <AiOutlineStar className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    No Favourites Yet
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-center">
                                    Start adding cryptocurrencies to your favourites list
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reduxFavouritesARR.map((item: any, index: number) => (
                                    <div
                                        key={item.id || index}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg/50 rounded-xl border border-gray-200 dark:border-dark-border hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={item.image}
                                                className="w-12 h-12 rounded-full"
                                                alt={item.name || 'cryptocurrency'}
                                                loading="lazy"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {item.name || item.id}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                                                    {item.symbol}
                                                </p>
                                                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                                    {currency === "usd" ? "$" : "₹"}{(item.current_price || item.price)?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromFavHandler(item)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <RxCrossCircled className="text-xl" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {   /* FOOTER  */}

            <Footer />




        </div>
    )
}

export default HomeComnponent
