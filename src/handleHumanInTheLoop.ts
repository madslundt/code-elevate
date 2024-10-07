// src/humanInTheLoop/handleHumanInTheLoop.ts
import * as vscode from 'vscode';
import { IStep, IState, IMessage, HumanInTheLoopCommandMessage } from './types';
import { openHumanInTheLoopPanel } from './humanInTheLoopPanel';

export const handleHumanInTheLoop = async (step: IStep, state: IState, executeMessage: (messages: IMessage[]) => Promise<string>): Promise<IState> =>
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
            const aiMessage = await executeMessage(messages);
            messages.push({
              role: 'ai',
              content: aiMessage,
            });
            updateMessages(panel, messages);

            break;

          case 'continue':
            // When the user clicks continue, resolve with the updated state
            const newMessage: IMessage = { role: 'user', content: `Based on the chat history please write the final answer to the original prompt:\n${step.action.body}` };
            // Simulate a response for demonstration purposes
            const response = await executeMessage([
              ...messages,
              newMessage,
            ]);
            state[step.key] = response;
            resolve(state);
            panel.dispose();
            break;

          case 'save':
            vscode.window.showInformationMessage('State saved successfully.');
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
