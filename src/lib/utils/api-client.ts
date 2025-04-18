import { RequestTypes } from '../types/enums';
import { IMessage, IUserData } from '../types/interfaces';

const baseURL = 'http://127.0.0.1:4000';

export default class ApiClient {
  private ws: WebSocket | undefined;

  constructor() {
    ApiClient.isServerAvailable((isAvailable) => {
      if (isAvailable) {
        this.ws = new WebSocket(baseURL);
      } else {
        console.log(isAvailable, "server doesn't response");
        // add info form
      }
    });
  }

  public static isServerAvailable(
    callback: (available: boolean) => void
  ): void {
    fetch(baseURL.replace('ws://', 'http://').replace('wss://', 'https://'))
      .then((response) => callback(response.ok))
      .catch(() => callback(false));
  }
  public static generateId(): string {
    return crypto.randomUUID();
  }

  public login(userData: IUserData): string | void {
    if (userData.password) {
      const id = ApiClient.generateId();
      const message = {
        id: id,
        type: RequestTypes.UserLogin,
        payload: {
          login: userData.login,
          password: userData.password,
        },
      };
      this.ws?.send(JSON.stringify(message));
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
          login: userData.login,
          password: userData.password,
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
