import * as vscode from 'vscode';

export const openHumanInTheLoopPanel = (title: string, viewColumn: vscode.ViewColumn): vscode.WebviewPanel => {
  const panel = vscode.window.createWebviewPanel(
    'humanInTheLoop',
    title,
    viewColumn,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  // Set the initial HTML content of the panel
  panel.webview.html = getHumanInTheLoopHtml();
  return panel;
};

const getHumanInTheLoopHtml = (): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Human In The Loop</title>
      <style>
        /* CSS styles for layout and chat messages */
        body {
          font-family: Arial, sans-serif;
        }
        #buttons {
          margin-bottom: 10px;
        }
        #messages {
          max-height: 70vh;
          overflow-y: auto;
          padding: 10px;
        }
        .message {
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        .user-message {
          background-color: #dcf8c6;
          align-self: flex-end;
        }
        .ai-message {
          background-color: #f1f0f0;
        }
        #inputArea {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }
        #textarea {
          height: 50px;
          width: 100%;
          resize: none;
        }
      </style>
    </head>
    <body>
      <div id="buttons">
        <button onclick="handleButtonClick('continue')">Continue</button>
        <button onclick="handleButtonClick('save')">Save</button>
        <button onclick="handleButtonClick('include')">Include</button>
      </div>
      <div id="messages"></div>
      <div id="inputArea">
        <textarea id="textarea" placeholder="Type your message here..."></textarea>
        <button onclick="sendMessage()">Send</button>
      </div>
      <script>
        const vscode = acquireVsCodeApi();
        const textarea = document.getElementById('textarea');
        textarea.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
          }
        });

        function sendMessage() {
          const text = textarea.value.trim();
          if (text) {
            vscode.postMessage({ command: 'sendMessage', text });
            textarea.value = '';
          }
        }

        function handleButtonClick(command) {
          vscode.postMessage({ command });
        }

        window.addEventListener('message', event => {
          const message = event.data;
          if (message.command === 'updateMessages') {
            renderMessages(message.messages);
          }
        });

        function renderMessages(messages) {
          const messagesDiv = document.getElementById('messages');
          messagesDiv.innerHTML = '';
          messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            if (msg.role === 'user') {
              messageDiv.classList.add('user-message');
            } else if (msg.role === 'ai') {
              messageDiv.classList.add('ai-message');
            }
            messageDiv.textContent = msg.content;
            messagesDiv.appendChild(messageDiv);
          });
        }
      </script>
    </body>
    </html>
  `;
};
