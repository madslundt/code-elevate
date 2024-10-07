import { handleHumanInTheLoop } from "./handleHumanInTheLoop";
import { ConfigurationService, OutputService } from "./services";
import { IStepConfiguration, IState, IStep } from "./types";
import vscode from 'vscode';
import { getErrorMessage, trimEnd, trimStart } from "./utils";

const saveFile = async (step: IStep, state: IState, outputService: OutputService) => {
  if (step.out) {
    const outputPath = outputService.generateOutputPath(step.out, state);
    await outputService.saveOutputToFile(outputPath, state[step.key]);
  }
};

export const processConfigurationSteps = async (
  selectedConfig: IStepConfiguration,
  initialState: IState,
  configurationService: ConfigurationService,
  outputService: OutputService,
): Promise<IState> => {
  let state = {
    ...initialState,
  };

  const totalSteps = selectedConfig.steps.length;

  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Processing ${selectedConfig.name}`,
    cancellable: false,
  }, async (progress) => {
    for (let i = 0; i < totalSteps; i++) {
      const step = selectedConfig.steps[i];
      progress.report({
        increment: 100 / totalSteps,
        message: `${step.key} (${i + 1} of ${selectedConfig.steps.length})`,
      });

      try {
        // Execute the step using ConfigurationService
        let response = await configurationService.executeStep(step, state);

        state[step.key] = response;

        // Human-in-the-loop handling
        // TODO: WIP
        // if (step.humanInTheLoopAction) {
        //   response = await handleHumanInTheLoop(
        //     step,
        //     state,
        //     {
        //       executeMessage: (messages) => configurationService.executeHumanInTheLoop(step, state, messages, step.humanInTheLoopAction?.bodyMessage),
        //       executeFinalMessage: (messages) => configurationService.executeHumanInTheLoop(step, state, messages, step.humanInTheLoopAction?.bodyFinalMessage),
        //       save: (state) => saveFile(step, state, outputService),
        //     }
        //   );
        // }

        // Trim Start and End if specified
        if (step.trimStart) {
          response = trimStart(response, step.trimStart);
        }

        if (step.trimEnd) {
          response = trimEnd(response, step.trimEnd);
        }

        state[step.key] = response;

        saveFile(step, state, outputService);

      } catch (error) {
        if (step.continueOnError) {
          vscode.window.showWarningMessage(`Continue even though error in step "${step.key}": ${getErrorMessage(error)}`);
          continue;
        } else {
          vscode.window.showErrorMessage(`Error in step "${step.key}": ${getErrorMessage(error)}`);
          break;
        }
      }
    }
  });

  return state;
};
