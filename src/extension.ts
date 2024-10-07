import * as vscode from 'vscode';
import { initializeState } from './initializeState';
import { ActionServiceFactory, ConfigurationService, OutputService } from './services';
import { selectConfiguration } from './selectConfiguration';
import { processConfigurationSteps } from './processConfigurationSteps';
import { getErrorMessage } from './utils';

const handleFile = async (): Promise<void> => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found.');
    return;
  }

  let state = await initializeState(editor, workspaceFolder);
  const selectedConfig = await selectConfiguration(state);

  if (!selectedConfig) {
    return;
  }

  const actionServiceFactory = new ActionServiceFactory();
  const outputService = new OutputService();
  const configurationService = new ConfigurationService(actionServiceFactory);

  try {
    const startTime = new Date().getTime();
    await processConfigurationSteps(selectedConfig, state, configurationService, outputService);
    const endTime = new Date().getTime();
    const executionTimeInSeconds = (endTime - startTime) / 1000;

    vscode.window.showInformationMessage(`Configuration "${selectedConfig.name}" completed successfully (${Math.round(executionTimeInSeconds)} seconds).`);
  } catch (error) {
    vscode.window.showErrorMessage(`An error occurred while processing the configuration: ${getErrorMessage(error)}`);
  }
};

// This method is called when your extension is activated
export const activate = (context: vscode.ExtensionContext) => {
  console.log('Extension "Code Elevate AI" is now active!');

  const runFileDisposable = vscode.commands.registerCommand('elevate-code.runFile', handleFile);

  context.subscriptions.push(runFileDisposable);
};

// This method is called when your extension is deactivated
export const deactivate = () => { };
