type categoryType = 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology';
type optionsType = {
    apiKey?: string;
    country?: string;
    category?: categoryType;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
};

/*interface ILoader {
    getResp: ( { endpoint: string; options: optionsType | null }, ): any;
    //status: 'ok' | 'error';

    //get ok(): bool;
}*/

class Loader {
    private baseLink: string | undefined;
    private options: optionsType;

    constructor(baseLink: string | undefined, options: optionsType) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        { endpoint, options = {} },
        callback = (data: any) => {
            console.error('No callback for GET response');
        }
    ) {
        this.load('GET', endpoint, callback, options);
    }

    errorHandler(res: responseType) {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl(options: any, endpoint: string): string {
        const urlOptions = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    load(method: any, endpoint: string, callback: any, options = {}) {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;
