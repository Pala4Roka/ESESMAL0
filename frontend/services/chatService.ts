import api from './api';

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id?: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: string;
}

export interface ChatResponse {
  response: string;
  emotion: string;
}

class ChatService {
  /**
   * Send message to MAL0
   */
  async sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/api/chat', {
        message,
        session_id: sessionId,
      });
      return response.data;
    } catch (error: any) {
      console.error('Send message error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Ошибка отправки сообщения');
    }
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await api.get<ChatMessage[]>(`/api/chat/history/${sessionId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get chat history error:', error.response?.data || error.message);
      return []; // Return empty array on error
    }
  }

  /**
   * Generate session ID
   */
  generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}

export default new ChatService();
