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
/*
type dataSourcesType = {
    status: 'ok' | 'error';
    sources: Array<sourcesType>;
};
type sourcesType = {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
};*/

type dataType = { articles: Array<articleType>; status: 'ok' | 'error'; totalResults: number };
type articleType = {
    source: {
        id: string;
        name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
};

/*interface ILoader {
    getResp: ( { endpoint: string; options: optionsType | null }, ): any;
    //status: 'ok' | 'error';

    //get ok(): bool;
}*/

type emptyType = '';

type getRespDataType = dataType | emptyType;

// type getRespType = ({ endpoint: string; options?: any }, callback: callbackType ) => void;

class Loader {
    private baseLink: string | undefined;
    private options: optionsType;

    constructor(baseLink: string | undefined, options: optionsType) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        { endpoint, options = {} }: { endpoint: string; options?: optionsType },
        callback: (data: getRespDataType) => void = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', endpoint, callback, options);
    }

    errorHandler(res: Response) {
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

    load(method: methodType, endpoint: string, callback: any, options = {}) {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;
