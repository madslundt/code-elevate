import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IActionService } from './IActionService';
import { IActionHttp, IState } from '../../types';
import { replaceHandlebars } from '../../utils';

export class ActionHttpService implements IActionService<IActionHttp> {
  private client: AxiosInstance;
  private cookies: string | undefined;

  constructor() {
    this.client = axios.create();

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
          this.cookies = setCookie.join('; ');
        }
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  async execute(action: IActionHttp, state: IState): Promise<AxiosResponse> {
    const url = replaceHandlebars(action.url, state);
    const method = replaceHandlebars(action.method, state);
    const headers = Object.fromEntries(Object.entries(action.headers).map(([key, value]) => [key, replaceHandlebars(value, state)]));
    const data = Object.fromEntries(Object.entries(action.body).map(([key, value]) => [key, replaceHandlebars(value, state)]));

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers: {
        ...headers,
        Cookie: this.cookies,
      },
    };

    const response = this.client.request(config);
    return response;
  }
}
