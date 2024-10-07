import { IActionService } from './IActionService';
import { ActionType, IAction, IState } from '../../types';
import { ActionHttpService } from './ActionHttpService';

type ActionServiceConstructor<T> = new () => IActionService<T>;

export class ActionServiceFactory {
  private actionServices: { [key: string]: ActionServiceConstructor<any> } = {};

  constructor() {
    // Register services for action types here
    this.registerActionService('http', ActionHttpService);
  }

  registerActionService<T>(type: ActionType, service: ActionServiceConstructor<T>): void {
    this.actionServices[type] = service;
  }

  getActionService<T extends IAction>(type: ActionType): IActionService<T> {
    const ServiceConstructor = this.actionServices[type];
    if (!ServiceConstructor) {
      throw new Error(`No service registered for action type: ${type}`);
    }
    return new ServiceConstructor();
  }

  async executeAction<T extends IAction>(action: T, state: IState): Promise<any> {
    const service = this.getActionService<T>(action.type);
    return service.execute(action, state);
  }
}
