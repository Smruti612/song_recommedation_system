import axios from 'axios';

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getRecommendations = async (artist) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recommendations`, {
            params: { artist }
        });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || 
            'Failed to fetch recommendations'
        );
    }
};
