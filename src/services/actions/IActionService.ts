import { AxiosResponse } from 'axios';
import { IState } from "../../types";

export interface IActionService<T> {
  execute(action: T, state: IState): Promise<AxiosResponse>;
}
