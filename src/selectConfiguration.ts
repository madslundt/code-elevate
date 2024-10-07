import { IStepConfiguration, IState } from "./types";
import vscode from 'vscode';
import { IConfiguration } from "./types/IConfiguration";

export const selectConfiguration = async (state: IState): Promise<IStepConfiguration | null> => {
  const configuration = vscode.workspace.getConfiguration().get<IConfiguration>('elevateCode.configuration');
  if (!configuration) {
    throw new Error('No configuration found in settings. Please add configurations in the VS Code settings.');
  }

  let stepConfigurations = configuration.stepConfigurations.filter(({ fileExtensions }) => !fileExtensions || fileExtensions.includes(state.fileExtension));

  if (stepConfigurations.length === 0) {
    throw new Error(`No applicable configurations found for the file type ${state.fileExtension}.`);
  }
  if (stepConfigurations.length === 1) {
    return stepConfigurations[0];
  }

  const selection = await vscode.window.showQuickPick(
    stepConfigurations.map((config, index) => ({
      label: config.name,
      description: config.description,
      configuration: config,
      index,
    })), {
    placeHolder: 'Select a configuration',
  });

  return selection?.configuration ?? null;
};
