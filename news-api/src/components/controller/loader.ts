import { OptionsType, MethodType, FuncType, RequestOptions, IResponse, GetDataType } from '../../types';
import { ILoader } from '../../types/classes';

class Loader implements ILoader {
    private baseLink: string | undefined;
    private options: OptionsType;

    constructor(baseLink: string, options: OptionsType) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        { endpoint, options = {} }: { endpoint: string; options?: RequestOptions },
        callback: FuncType = () => {
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

    load(method: MethodType, endpoint: string, callback: FuncType, options: RequestOptions = {}): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res: IResponse): Promise<GetDataType> => res.json())
            .then((data: Awaited<GetDataType>): void => callback(data))
            .catch((err: Error): void => console.error(err));
    }
}

export default Loader;
