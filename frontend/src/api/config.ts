import api from './axios';

export const getSiteStatus = async () => {
    try {
        const response = await api.get('/config/site-mode');
        return response.data; // { mode: 'coming_soon' | 'maintenance' | 'none' }
    } catch (error) {
        console.error('Error fetching site status:', error);
        return { mode: 'none' };
    }
};

export const getPlans = async () => {
    try {
        const response = await api.get('/config/plans');
        return response.data;
    } catch (error) {
        console.error('Error fetching plans:', error);
        return [];
    }
};
