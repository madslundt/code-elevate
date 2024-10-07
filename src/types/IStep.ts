import { IActionHttp, IHumanInTheLoopActionHttp } from "./IAction";

export interface IStep {
  key: string;
  action: IActionHttp;
  humanInTheLoopAction?: IHumanInTheLoopActionHttp;
  continueOnError?: boolean;
  out?: string;
  trimStart?: string;
  trimEnd?: string;
}

