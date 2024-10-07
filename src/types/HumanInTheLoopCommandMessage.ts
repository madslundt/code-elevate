export type HumanInTheLoopCommand = 'sendMessage' | 'continue' | 'save' | 'include' | 'cancel';

export interface SendMessageCommand {
  command: 'sendMessage';
  text: string;
}

export interface ContinueCommand {
  command: 'continue';
}

export interface SaveCommand {
  command: 'save';
}

export interface IncludeCommand {
  command: 'include';
}

export interface CancelCommand {
  command: 'cancel';
}

export type HumanInTheLoopCommandMessage =
  | SendMessageCommand
  | ContinueCommand
  | SaveCommand
  | IncludeCommand
  | CancelCommand;
