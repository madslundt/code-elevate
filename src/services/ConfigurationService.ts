import { IMessage, IState, IStep } from '../types';
import { trimStart, trimEnd, getErrorMessage } from '../utils';
import { ActionServiceFactory } from './actions';

export class ConfigurationService {
  private actionServiceFactory: ActionServiceFactory;

  constructor(actionServiceFactory: ActionServiceFactory) {
    this.actionServiceFactory = actionServiceFactory;
  }

  async executeStep(step: IStep, state: IState): Promise<IState> {
    let result: string;

    // Execute the action using the appropriate Action Service
    try {
      const response = await this.actionServiceFactory.executeAction(step.action, state);
      result = response.data; // Extract the data from the response
    } catch (error) {
      throw new Error(`Failed to execute action for step "${step.key}": ${getErrorMessage(error)}`);
    }

    // Trim Start and End if specified
    if (step.trimStart) {
      result = trimStart(result, step.trimStart);
    }

    if (step.trimEnd) {
      result = trimEnd(result, step.trimEnd);
    }

    // Save result to state
    state[step.key] = result;

    return state;
  }

  async executeHumanInTheLoop(step: IStep, state: IState, messages: IMessage[]): Promise<string> {
    let result: string;

    // Execute the action using the appropriate Action Service
    try {
      const response = await this.actionServiceFactory.executeAction(step.humanInTheLoopAction!, {
        ...state,
        messages,
    });
      result = response.data; // Extract the data from the response
    } catch (error) {
      throw new Error(`Failed to execute action for step "${step.key}": ${getErrorMessage(error)}`);
    }

    // Save result to state
    return result;
  }
}
