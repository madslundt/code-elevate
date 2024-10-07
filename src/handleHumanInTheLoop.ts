// src/humanInTheLoop/handleHumanInTheLoop.ts
import * as vscode from 'vscode';
import { IStep, IState, IMessage, HumanInTheLoopCommandMessage } from './types';
import { openHumanInTheLoopPanel } from './humanInTheLoopPanel';

interface ICommands {
  executeMessage: (messages: string) => Promise<string>;
  executeFinalMessage: (messages: string) => Promise<string>;
  save: (state: IState) => Promise<void>;
}

const getMessagesString = (messages: IMessage[]): string => messages.map((message) => `${message.role}: ${message.content}`).join('\n');

export const handleHumanInTheLoop = async (step: IStep, state: IState, commands: ICommands): Promise<IState> =>
  new Promise((resolve) => {
    const panel = openHumanInTheLoopPanel(`Human In The Loop: ${step.key}`, vscode.ViewColumn.One);

    const messages: IMessage[] = [{
      role: 'ai',
      content: state[step.key],
    }];

    // Set up listener for receiving messages from the webview
    panel.webview.onDidReceiveMessage(
      async (message: HumanInTheLoopCommandMessage) => {
        switch (message.command) {
          case 'sendMessage':
            // Add user's message to messages array
            const userMessage: IMessage = { role: 'user', content: message.text };
            messages.push(userMessage);
            updateMessages(panel, messages);

            // Simulate a response for demonstration purposes
            messages.push({
              role: 'ai',
              content: await commands.executeMessage(getMessagesString(messages)),
            });
            updateMessages(panel, messages);

            break;

          case 'continue':
            state[step.key] = await commands.executeFinalMessage(getMessagesString(messages));
            resolve(state);
            panel.dispose();
            break;

          case 'save':
            await commands.save({
              ...state,
              [step.key]: await commands.executeFinalMessage(getMessagesString(messages)),
            });
            break;

          case 'include':
            vscode.window.showInformationMessage('Include functionality triggered.');
            break;

          case 'cancel':
            // If the user cancels, resolve with the current state but do not continue further
            resolve(state);
            panel.dispose();
            break;
        }
      },
      undefined,
      []
    );

    function updateMessages(panel: vscode.WebviewPanel, messages: IMessage[]) {
      panel.webview.postMessage({ command: 'updateMessages', messages });
    }

    function handleUserMessage(userMessage: string, callback: (response: string) => void) {
      setTimeout(() => {
        callback(`This is a response to: "${userMessage}"`);
      }, 1000);
    }
  });
