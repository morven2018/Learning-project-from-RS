import { RequestTypes } from '../types/enums';
import type { IMessage, IUserData } from '../types/interfaces';
// import { WebSocket } from 'ws';

const baseURL = 'ws://127.0.0.1:4000';

export default class ApiClient {
  public user: IUserData | undefined;
  public ws: WebSocket | undefined = undefined;
  /* private authSuccessCallbacks: Map<string, (userData: IUserData) => void> =
    new Map(); */

  constructor() {
    this.ws = new WebSocket(baseURL);
    this.connect();
  }
  private connect(): void {
    if (!this.ws) return;

    this.ws.onopen = () => console.log('WebSocket connected!');

    this.ws.onclose = () => console.log('WebSocket disconnected');

    this.ws.onerror = (error) => console.error('WebSocket error:', error);
  }

  public static generateId(): string {
    return crypto.randomUUID();
  }

  public setMessageHandler(handler: (data: string) => void): void {
    if (this.ws) {
      this.ws.onmessage = (event) => handler(event.data);
    }
  }

  public login(userData: IUserData): string | void {
    this.user = userData;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
      console.log('some problem. socket is not open');
    //console.log('login start');
    if (userData.password) {
      const id = ApiClient.generateId();
      const message = {
        id: id,
        type: RequestTypes.UserLogin,
        payload: {
          user: { login: userData.login, password: userData.password },
        },
      };
      this.ws?.send(JSON.stringify(message));
      //console.log('login start', id);
      return id;
    }
  }

  public logout(userData: IUserData): string | void {
    if (userData.password) {
      const id = ApiClient.generateId();
      const message = {
        id: id,
        type: RequestTypes.UserLogout,
        payload: {
          user: { login: userData.login, password: userData.password },
        },
      };
      this.ws?.send(JSON.stringify(message));
      return id;
    }
  }

  public getallActiveUsers(): string {
    const id = ApiClient.generateId();
    const message = {
      id: id,
      type: RequestTypes.UserActive,
      payload: null,
    };
    this.ws?.send(JSON.stringify(message));
    return id;
  }

  public getallInactiveUsers(): string {
    const id = ApiClient.generateId();
    const message = {
      id: id,
      type: RequestTypes.UserInactive,
      payload: null,
    };
    this.ws?.send(JSON.stringify(message));
    return id;
  }

  public sendMessage(messageContent: IMessage): string {
    const id = ApiClient.generateId();
    const message = {
      id: id,
      type: RequestTypes.MessageSend,
      payload: {
        message: messageContent,
      },
    };
    this.ws?.send(JSON.stringify(message));
    return id;
  }

  public getHistory(login: string): string {
    const id = ApiClient.generateId();
    const message = {
      id: id,
      type: RequestTypes.MessageFromUser,
      payload: {
        user: {
          login: login,
        },
      },
    };
    this.ws?.send(JSON.stringify(message));
    return id;
  }

  public editStatusOnReaded(messageId: string): string {
    const id = ApiClient.generateId();
    const message = {
      id: id,
      type: RequestTypes.MessageRead,
      payload: {
        message: {
          id: messageId,
        },
      },
    };
    this.ws?.send(JSON.stringify(message));
    return id;
  }

  public deleteMessage(messageId: string): string {
    const id = ApiClient.generateId();
    const message = {
      id: id,
      type: RequestTypes.MessageDelete,
      payload: {
        message: {
          id: messageId,
        },
      },
    };
    this.ws?.send(JSON.stringify(message));
    return id;
  }

  public editMessage(message: IMessage): string | void {
    if (message.id) {
      const id = ApiClient.generateId();
      const request = {
        id: id,
        type: RequestTypes.MessageEdit,
        payload: {
          message: {
            id: message.id,
            text: message.text,
          },
        },
      };
      this.ws?.send(JSON.stringify(request));
      return id;
    }
  }
}
