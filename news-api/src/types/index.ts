// export interface <имя интерфейса> { ... }

export type dataSourcesType = {
    status: 'ok' | 'error';
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

export type dataType = { articles: Array<articleType>; status: 'ok' | 'error'; totalResults: number };
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
export type getRespDataType = dataType | emptyType | dataSourcesType;

type categoryType = 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology';
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
export type methodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type funcType = (data: getRespDataType) => void;

// type getRespType = ({ endpoint: string; options?: any }, callback: callbackType ) => void;
