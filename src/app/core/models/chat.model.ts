/**
 * Mensaje de chat
 */
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  read: boolean;
}

/**
 * Conversación de chat
 * Siempre asociada a un tiritoId
 */
export interface Chat {
  id: string;
  tiritoId: string;
  tiritoTitle: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Participante del chat
 */
export interface ChatParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
}

/**
 * Datos para crear un nuevo chat
 */
export interface CreateChatData {
  tiritoId: string;
  message: string;
}

/**
 * Datos para enviar un mensaje
 */
export interface SendMessageData {
  chatId: string;
  content: string;
  image?: File;
}
