import { IActionHttp } from "./IAction";

export interface IStep {
  key: string;
  action: IActionHttp;
  humanInTheLoopAction?: IActionHttp;
  continueOnError?: boolean;
  out?: string;
  trimStart?: string;
  trimEnd?: string;
}

