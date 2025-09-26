import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type CryptoCoin = {
  id: string;
  price: number;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
};

// Function to load favorites from localStorage
const loadFavoritesFromStorage = (): CryptoCoin[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('crypto-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Function to save favorites to localStorage
const saveFavoritesToStorage = (favorites: CryptoCoin[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('crypto-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }
};

const favouriteSlice = createSlice({
    name: "favourites",
    initialState: { list: loadFavoritesFromStorage() },

    reducers: {
        addToFavourites(state, action) {
            const newItem = action.payload;
            const existingItem = state.list.find((item) => item.id === newItem.id);

            if (!existingItem) {
                const favoriteItem = {
                    id: newItem.id,
                    price: newItem.current_price,
                    image: newItem.image,
                    name: newItem.name || newItem.id,
                    symbol: newItem.symbol,
                    current_price: newItem.current_price,
                };
                state.list.push(favoriteItem);
                saveFavoritesToStorage(state.list);
            }
        },

        removeFromFavourites(state, action) {
            const itemId = action.payload.id;
            state.list = state.list.filter(item => item.id !== itemId);
            saveFavoritesToStorage(state.list);
        },

        loadFavourites(state) {
            state.list = loadFavoritesFromStorage();
        }
    }
})

const store = configureStore({ reducer: { favourites: favouriteSlice.reducer } });

export default store;

export const favouritesActions=favouriteSlice.actions;

