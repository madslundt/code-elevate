export type ActionType = 'http';

export interface IAction {
  type: ActionType;
}

export interface IActionHttp extends IAction {
  type: 'http';
  url: string;
  method: 'POST' | 'GET';
  body: Record<string, any>;
  headers: Record<string, string>;
}

export interface IHumanInTheLoopActionHttp extends IActionHttp {
  bodyMessage: Record<string, string>;
  bodyFinalMessage: Record<string, string>;
}
