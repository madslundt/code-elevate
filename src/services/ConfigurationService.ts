import { IState, IStep } from '../types';
import { getErrorMessage } from '../utils';
import { ActionServiceFactory } from './actions';

export class ConfigurationService {
  private actionServiceFactory: ActionServiceFactory;

  constructor(actionServiceFactory: ActionServiceFactory) {
    this.actionServiceFactory = actionServiceFactory;
  }

  async executeStep(step: IStep, state: IState): Promise<any> {
    let result: string;

    // Execute the action using the appropriate Action Service
    try {
      const response = await this.actionServiceFactory.executeAction(step.action, state);
      result = response.data; // Extract the data from the response
    } catch (error) {
      throw new Error(`Failed to execute action for step "${step.key}": ${getErrorMessage(error)}`);
    }

    return result;
  }

  async executeHumanInTheLoop(step: IStep, state: IState, chatHistory: string, body?: Record<string, string>): Promise<any> {
    let result: string;

    // Execute the action using the appropriate Action Service
    try {
      const response = await this.actionServiceFactory.executeAction({
        ...step.humanInTheLoopAction!,
        body: body || step.humanInTheLoopAction?.body,
      }, {
        ...state,
        chatHistory,
    });
      result = response.data; // Extract the data from the response
    } catch (error) {
      throw new Error(`Failed to execute action for step "${step.key}": ${getErrorMessage(error)}`);
    }

    // Save result to state
    return result;
  }
}
