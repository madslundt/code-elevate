import { handleHumanInTheLoop } from "./handleHumanInTheLoop";
import { ConfigurationService, OutputService } from "./services";
import { IStepConfiguration, IState } from "./types";
import vscode from 'vscode';
import { getErrorMessage } from "./utils";

export const processConfigurationSteps = async (
  selectedConfig: IStepConfiguration,
  initialState: IState,
  configurationService: ConfigurationService,
  outputService: OutputService,
): Promise<IState> => {
  let state = {
    ...initialState,
  };

  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Processing ${selectedConfig.name}`,
    cancellable: false,
  }, async (progress) => {
    for (let i = 0; i < selectedConfig.steps.length; i++) {
      const step = selectedConfig.steps[ i ];
      progress.report({
        increment: ((i + 1) / selectedConfig.steps.length) * 100,
        message: `${step.key} (${i + 1} of ${selectedConfig.steps.length})`,
      });

      try {
        // Execute the step using ConfigurationService
        state = await configurationService.executeStep(step, state);

        // Human-in-the-loop handling
        if (step.humanInTheLoopAction) {
          state = await handleHumanInTheLoop(
            step,
            state,
            (messages) => configurationService.executeHumanInTheLoop(step, state, messages)
          );
        }

        // Write output to file if specified
        if (step.out) {
          const outputPath = outputService.generateOutputPath(step.out, state);
          await outputService.saveOutputToFile(outputPath, state[step.key]);
        }

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
