import React from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/HomePageComponents/Navbar';
import CoinDetailHero from '@/components/CoinDetailPageComponents/CoinDetailHero';
import Footer from '@/components/HomePageComponents/Footer';
import CoinDetailChart from '@/components/CoinDetailPageComponents/CoinDetailChart';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { favouritesActions } from '@/ReduxStore/FavouritesSlice'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { RxCrossCircled } from 'react-icons/rx'
import { useTheme } from '@/contexts/ThemeContext'

const Coindetail = () => {
  const { isDark } = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const reduxFavouritesARR: any[] = useSelector((state: any) => state.favourites.list);
  const dispatch = useDispatch();

  const router = useRouter();
  const coinName = router.query.id;

  const removeFromFavHandler = (coin: any) => {
    dispatch(favouritesActions.removeFromFavourites(coin));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="h-28">
        <Navbar onFavoritesClick={onOpen} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CoinDetailHero cryptoName={coinName} />
      </div>

      <Footer />

      {/* Global Favourites Drawer */}
      <Drawer onClose={onClose} isOpen={isOpen} size="sm" placement="right">
        <DrawerOverlay bg="blackAlpha.300" onClick={onClose} />
        <DrawerContent
          bg={isDark ? "#1e293b" : "white"}
          color={isDark ? "white" : "black"}
          maxWidth="33vw"
          minWidth="400px"
          as="section"
        >
          <DrawerHeader borderBottomWidth="1px" borderColor={isDark ? "#334155" : "gray.200"}>
            <div className="flex items-center gap-3">
              <AiFillStar className="text-3xl text-yellow-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">My Favourites</span>
            </div>
            <DrawerCloseButton />
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
                          ${(item.current_price || item.price)?.toLocaleString()}
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
    </div>
  )
}

export default Coindetail

/**
   <div className="coinDetailTagsHold flex flex-col w40Percent items-center">

        <p className=' font-semibold text-lg flex justify-start w40Percent'>Tags</p>
        <div className='flex items-center gap-4 justify-start flex-wrap mt-3'>
          {coinDetailData.categories && coinDetailData.categories[0] && <p className="bg-gray-300 w-auto pl-3 pr-3 flex justify-center items-center rounded h-8"> {coinDetailData.categories[0]} </p>}
          {coinDetailData.categories && coinDetailData.categories[1] && <p className="bg-gray-300 w-auto pl-3 pr-3 flex justify-center items-center rounded h-8"> {coinDetailData.categories[1]} </p>}
          {coinDetailData.categories && coinDetailData.categories[2] && <p className="bg-gray-300 w-auto pl-3 pr-3 flex justify-center items-center rounded h-8"> {coinDetailData.categories[2]} </p>}
          {coinDetailData.categories && coinDetailData.categories[3] && <p className="bg-gray-300 w-auto pl-3 pr-3 flex justify-center items-center rounded h-8"> {coinDetailData.categories[3]} </p>}
        </div>

      </div>




                  {coinDetailData.maket_data && coinDetailData.market_data.market_cap_change_percentage_24h && <p className={`${coinDetailData.market_data.market_cap_change_percentage_24h > 0 ? "mt-1 text-sm font-semibold text-green-500 interFont" : "mt-1 text-sm font-semibold text-red-500 interFont"}`}> <span> {coinDetailData.market_data.market_cap_change_percentage_24h > 0 ? <span>+</span> : <span>-</span>} </span> {coinDetailData.market_data.market_cap_change_percentage_24h.toFixed(2)} </p>}
            {coinDetailData.maket_data && coinDetailData.market_data.price_change_percentage_24h && <p className={`${coinDetailData.market_data.price_change_percentage_24h > 0 ? "mt-1 text-sm font-semibold text-green-500 interFont" : "mt-1 text-sm font-semibold text-red-500 interFont"}`}> <span> {coinDetailData.market_data.price_change_percentage_24h > 0 ? <span>+</span> : <span>-</span>} </span> {coinDetailData.market_data.price_change_percentage_24h.toFixed(2)} </p>}


 */