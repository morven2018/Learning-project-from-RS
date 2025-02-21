import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        const apiURL = process.env.API_URL || 'https://rss-news-api.onrender.com/mocks/';
        const apiKey = process.env.API_KEY || '';
        super(apiURL, {
            apiKey: apiKey,
        });
    }
}

export default AppLoader;
