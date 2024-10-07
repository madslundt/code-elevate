import { IActionService } from './IActionService';
import { ActionType, IAction, IState } from '../../types';
import { ActionHttpService } from './ActionHttpService';

export class ActionServiceFactory {
  private actionServices: { [key in ActionType]?: IActionService<IAction> } = {};

  constructor() {
    // Register services for action types here
    this.registerActionService('http', new ActionHttpService());
  }

  registerActionService<T extends IAction>(type: ActionType, service: IActionService<T>): void {
    this.actionServices[type] = service;
  }

  getActionService<T extends IAction>(type: ActionType): IActionService<T> {
    const service = this.actionServices[type];
    if (!service) {
      throw new Error(`No service registered for action type: ${type}`);
    }
    return service as IActionService<T>;
  }

  async executeAction<T extends IAction>(action: T, state: IState): Promise<any> {
    const service = this.getActionService<T>(action.type);
    return service.execute(action, state);
  }
}
