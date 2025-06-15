import { create } from 'zustand';
import type { Dog, SearchParams } from '../types/api';

interface DogState {
    favoriteDogs: Dog[];
    searchParams: SearchParams;
    setSearchParams: (params: Partial<SearchParams>) => void;
    addFavorite: (dog: Dog) => void;
    removeFavorite: (dogId: string) => void;
    clearFavorites: () => void;
}

export const useDogStore = create<DogState>((set) => ({
    favoriteDogs: [],
    searchParams: {
        size: 25,
        sort: 'breed:asc',
    },
    setSearchParams: (params) =>
        set((state) => ({
            searchParams: { ...state.searchParams, ...params },
        })),
    addFavorite: (dog) =>
        set((state) => ({
            favoriteDogs: [...state.favoriteDogs, dog],
        })),
    removeFavorite: (dogId) =>
        set((state) => ({
            favoriteDogs: state.favoriteDogs.filter((dog) => dog.id !== dogId),
        })),
    clearFavorites: () => set({ favoriteDogs: [] }),
})); 