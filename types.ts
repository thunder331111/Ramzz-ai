
export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export type Mode = 'standard' | 'owner';
