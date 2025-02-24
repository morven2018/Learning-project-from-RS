import { optionsType, methodType, funcType, RequestOptions, IResponse, getDataType } from '../../types';
import { ILoader } from '../../types/classes';

class Loader implements ILoader {
    private baseLink: string | undefined;
    private options: optionsType;

    constructor(baseLink: string, options: optionsType) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        { endpoint, options = {} }: { endpoint: string; options?: RequestOptions },
        callback: funcType = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', endpoint, callback, options);
    }

    errorHandler(res: IResponse): IResponse {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }
        return res;
    }

    makeUrl(options: RequestOptions, endpoint: string): string {
        const urlOptions = { ...this.options, ...options } as RequestOptions;
        let url = `${this.baseLink}${endpoint}?`;
        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    load(method: methodType, endpoint: string, callback: funcType, options: RequestOptions = {}): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res: IResponse): Promise<getDataType> => res.json())
            .then((data: Awaited<getDataType>): void => callback(data))
            .catch((err: Error): void => console.error(err));
    }
}

export default Loader;
