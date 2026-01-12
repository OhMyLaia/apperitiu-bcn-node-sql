import { axiosCreate } from "../../../config/api-connection-service.js";
import { createClient } from 'pexels';
import { ENV } from "../../../config/env.js";

// const client = createClient(ENV.PEXELS_API_KEY);
// const query = 'restaurant%20atmosphere/';

// client.photos.search({ query, per_page: 1 }).then(photos => {...});


const client = createClient(ENV.PEXELS_API_KEY);

export async function getRandomTerraceImage(keyword: string) {
    try {
        const randomPage = Math.floor(Math.random() * 20) + 1;

        const response = await client.photos.search({
            query: keyword,
            per_page: 1,
            page: randomPage,
            orientation: 'landscape'
        });

        if ('photos' in response && response.photos.length > 0) {
            return response.photos[0].src.large || response.photos[0].src.medium;
        }

        return getFallbackImageUrl();

    } catch (error) {
        console.error('Error fetching images from Pexels:', error);
        return getFallbackImageUrl();
    }
}

function getFallbackImageUrl(): string {

    const fallbackImages = [
        'https://images.pexels.com/photos/5738649/pexels-photo-5738649.jpeg',
        'https://images.pexels.com/photos/32460015/pexels-photo-32460015.jpeg',
        'https://images.pexels.com/photos/5847396/pexels-photo-5847396.jpeg',
        'https://images.pexels.com/photos/20351623/pexels-photo-20351623.jpeg',
        'https://images.pexels.com/photos/15567416/pexels-photo-15567416.jpeg'
    ];

    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[randomIndex];
}