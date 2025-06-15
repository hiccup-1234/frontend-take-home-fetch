import axios from 'axios';
import type { Dog, Location, Match, SearchParams, SearchResponse, LocationSearchParams, LocationSearchResponse, User } from '../types/api';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const login = async (user: User): Promise<void> => {
    await api.post('/auth/login', user);
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

export const getBreeds = async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/dogs/breeds');
    return data;
};

export const searchDogs = async (params: SearchParams): Promise<SearchResponse> => {
    const { data } = await api.get<SearchResponse>('/dogs/search', { params });
    return data;
};

export const getDogs = async (dogIds: string[]): Promise<Dog[]> => {
    const { data } = await api.post<Dog[]>('/dogs', dogIds);
    return data;
};

export const getMatch = async (dogIds: string[]): Promise<Match> => {
    const { data } = await api.post<Match>('/dogs/match', dogIds);
    return data;
};

export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
    const { data } = await api.post<Location[]>('/locations', zipCodes);
    return data;
};

export const searchLocations = async (params: LocationSearchParams): Promise<LocationSearchResponse> => {
    const { data } = await api.post<LocationSearchResponse>('/locations/search', params);
    return data;
}; 