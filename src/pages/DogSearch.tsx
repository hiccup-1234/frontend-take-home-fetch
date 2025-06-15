import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    TextField,
    MenuItem,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useQuery } from '@tanstack/react-query';
import { useDogStore } from '../store/dogStore';
import { getBreeds, searchDogs, getDogs, getMatch } from '../services/api';
import type { Dog } from '../types/api';

const DogSearch = () => {
    const {
        favoriteDogs,
        searchParams,
        setSearchParams,
        addFavorite,
        removeFavorite,
        clearFavorites,
    } = useDogStore();

    const [page, setPage] = useState(1);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [sortField, setSortField] = useState<'breed' | 'name' | 'age'>('breed');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [matchDialogOpen, setMatchDialogOpen] = useState(false);
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [loadingMatch, setLoadingMatch] = useState(false);

    const { data: breeds = [] } = useQuery({
        queryKey: ['breeds'],
        queryFn: getBreeds,
    });

    const { data: searchResults, isLoading: isLoadingSearch } = useQuery({
        queryKey: ['dogs', searchParams, page],
        queryFn: async () => {
            const results = await searchDogs(searchParams);
            if (results.resultIds.length > 0) {
                const dogs = await getDogs(results.resultIds);
                return { dogs, total: results.total, next: results.next, prev: results.prev };
            }
            return { dogs: [], total: 0 };
        },
    });

    const handleBreedChange = (event: SelectChangeEvent<string[]>) => {
        const { value } = event.target;
        const newBreeds = typeof value === 'string' ? value.split(',') : value;
        setSelectedBreeds(newBreeds);
        setSearchParams({
            ...searchParams,
            breeds: newBreeds.length > 0 ? newBreeds : undefined,
        });
    };

    const handleSortFieldChange = (event: SelectChangeEvent<string>) => {
        const newSortField = event.target.value as 'breed' | 'name' | 'age';
        setSortField(newSortField);
        setSearchParams({
            ...searchParams,
            sort: `${newSortField}:${sortDirection}`,
        });
    };

    const handleSortDirectionChange = (event: SelectChangeEvent<string>) => {
        const newSortDirection = event.target.value as 'asc' | 'desc';
        setSortDirection(newSortDirection);
        setSearchParams({
            ...searchParams,
            sort: `${sortField}:${newSortDirection}`,
        });
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleMatch = async () => {
        if (favoriteDogs.length === 0) return;
        setLoadingMatch(true);
        try {
            const { match } = await getMatch(favoriteDogs.map((dog) => dog.id));
            const matchedDogData = favoriteDogs.find((dog) => dog.id === match);
            if (matchedDogData) {
                setMatchedDog(matchedDogData);
                setMatchDialogOpen(true);
            }
        } catch (error) {
            console.error('Error getting match:', error);
        } finally {
            setLoadingMatch(false);
        }
    };

    const isFavorite = (dogId: string) => favoriteDogs.some((dog) => dog.id === dogId);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid xs={12}>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Breeds</InputLabel>
                            <Select
                                multiple
                                value={selectedBreeds}
                                onChange={handleBreedChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {breeds.map((breed) => (
                                    <MenuItem key={breed} value={breed}>
                                        {breed}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select value={sortField} onChange={handleSortFieldChange}>
                                <MenuItem value="breed">Breed</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="age">Age</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Order</InputLabel>
                            <Select value={sortDirection} onChange={handleSortDirectionChange}>
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleMatch}
                            disabled={favoriteDogs.length === 0 || loadingMatch}
                            sx={{ ml: 'auto' }}
                        >
                            {loadingMatch ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                `Find Match (${favoriteDogs.length} selected)`
                            )}
                        </Button>
                    </Box>
                </Grid>

                {isLoadingSearch ? (
                    <Grid xs={12} sx={{ textAlign: 'center' }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    searchResults?.dogs.map((dog) => (
                        <Grid xs={12} sm={6} md={4} key={dog.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={dog.img}
                                    alt={dog.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {dog.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Breed: {dog.breed}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Age: {dog.age} years
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Location: {dog.zip_code}
                                    </Typography>
                                    <IconButton
                                        onClick={() =>
                                            isFavorite(dog.id)
                                                ? removeFavorite(dog.id)
                                                : addFavorite(dog)
                                        }
                                        color="primary"
                                        sx={{ mt: 1 }}
                                    >
                                        {isFavorite(dog.id) ? (
                                            <FavoriteIcon />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {searchResults && searchResults.total > 0 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={Math.ceil(searchResults.total / (searchParams.size || 25))}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            <Dialog open={matchDialogOpen} onClose={() => setMatchDialogOpen(false)}>
                <DialogTitle>Your Perfect Match!</DialogTitle>
                <DialogContent>
                    {matchedDog && (
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={matchedDog.img}
                                alt={matchedDog.name}
                                style={{ maxWidth: '100%', maxHeight: 300, marginBottom: 16 }}
                            />
                            <Typography variant="h6">{matchedDog.name}</Typography>
                            <Typography>Breed: {matchedDog.breed}</Typography>
                            <Typography>Age: {matchedDog.age} years</Typography>
                            <Typography>Location: {matchedDog.zip_code}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMatchDialogOpen(false)}>Close</Button>
                    <Button
                        onClick={() => {
                            setMatchDialogOpen(false);
                            clearFavorites();
                        }}
                        color="primary"
                    >
                        Start New Search
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DogSearch; 