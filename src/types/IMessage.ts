export type MessageRole = 'user' | 'ai' | 'system';
export interface IMessage {
    role: MessageRole;
    content: string;
}
