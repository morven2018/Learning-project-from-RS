import { categoryType, languageType, countryType, statusType } from './literals';

export interface RequestOptions {
    [key: string]: string | number | undefined;
    apiKey?: string;
    category?: categoryType;
    language?: languageType;
    country?: countryType;
    sources?: string;
}

export interface Response {
    status: statusType;
    sources: Array<sourcesType>;
    code?: number;
    message?: string;
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

export type groupedCategoryType = { [key: string]: sourcesType[] };

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
export type getDataType = Articles | emptyType | Response;

export type optionsType =
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
    | Record<string, never>;

export type funcType = (data: getDataType) => void;
export type methodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

// type getRespType = ({ endpoint: string; options?: any }, callback: callbackType ) => void;
