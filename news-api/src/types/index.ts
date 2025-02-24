import { categoryType, LanguageType, CountryType, statusType } from './literalsEnums';

export interface RequestOptions {
    [key: string]: string | number | undefined;
    apiKey?: string;
    category?: categoryType;
    language?: LanguageType;
    country?: CountryType;
    sources?: string;
}

export interface IResponse extends Response {
    sources?: Array<sourcesType>;
}

export type dataSourcesType = {
    status: statusType;
    sources: Array<sourcesType>;
};

export type sourcesType = {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
};

export type GroupedType<T> = { [key: string]: T[] };

export interface Articles {
    articles: Array<articleType>;
    status: 'ok' | 'error';
    totalResults: number;
}

export type articleType = {
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
export type emptyType = '';
export type getDataType = Articles | emptyType | IResponse;

type BaseOptions = {
    apiKey: string;
    sources: string;
    country?: string;
    category?: categoryType;
    q?: string;
    pageSize?: number;
    page?: number;
};

type ApiKeyAndSourcesOptions = Pick<BaseOptions, 'apiKey' | 'sources'> & Partial<BaseOptions>;
type SourcesOnlyOptions = Pick<BaseOptions, 'sources'> & Partial<BaseOptions>;
type ApiKeyOnlyOptions = Pick<BaseOptions, 'apiKey'> & Partial<BaseOptions>;

export type optionsType = ApiKeyAndSourcesOptions | SourcesOnlyOptions | ApiKeyOnlyOptions | Record<string, never>;

/* export type optionsType =
    | {
          [key: string]: string | number | undefined;
          apiKey: string;
          sources: string;
          country?: string;
          category?: categoryType;

          q?: string;
          pageSize?: number;
          page?: number;
      }
    | {
          [key: string]: string | number | undefined;
          sources: string;
      }
    | {
          [key: string]: string | number | undefined;
          apiKey: string;
      }
    | Record<string, never>;*/

export type methodType = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type funcType<T = getDataType> = (data: T) => void;
