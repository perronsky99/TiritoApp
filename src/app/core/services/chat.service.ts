import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { 
  Chat, 
  ChatMessage, 
  CreateChatData, 
  SendMessageData 
} from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar Chat
 * Chat siempre asociado a un tiritoId
 * 1 a 1, texto + imagen
 */
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly API_URL = `${environment.apiUrl}/chats`;

  // Subject para nuevos mensajes (para uso futuro con WebSocket)
  private newMessageSubject = new Subject<ChatMessage>();
  public newMessage$ = this.newMessageSubject.asObservable();

  // Contador de mensajes no leídos
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las conversaciones del usuario
   */
  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.API_URL).pipe(
      tap(chats => {
        const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
        this.unreadCountSubject.next(totalUnread);
      })
    );
  }

  /**
   * Obtiene una conversación por ID
   */
  getChatById(id: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.API_URL}/${id}`);
  }

  /**
   * Obtiene mensajes de una conversación
   */
  getMessages(chatId: string, page: number = 1): Observable<{
    messages: ChatMessage[];
    hasMore: boolean;
  }> {
    return this.http.get<{ messages: ChatMessage[]; hasMore: boolean }>(
      `${this.API_URL}/${chatId}/messages`,
      { params: { page: page.toString() } }
    );
  }

  /**
   * Inicia una nueva conversación sobre un tirito
   */
  createChat(data: CreateChatData): Observable<Chat> {
    return this.http.post<Chat>(this.API_URL, data);
  }

  /**
   * Envía un mensaje
   */
  sendMessage(data: SendMessageData): Observable<ChatMessage> {
    const formData = new FormData();
    formData.append('chatId', data.chatId);
    formData.append('content', data.content);
    
    if (data.image) {
      formData.append('image', data.image, data.image.name);
    }

    return this.http.post<ChatMessage>(
      `${this.API_URL}/${data.chatId}/messages`,
      formData
    );
  }

  /**
   * Marca mensajes como leídos
   */
  markAsRead(chatId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${chatId}/read`, {}).pipe(
      tap(() => {
        // Actualizar contador de no leídos
        const currentCount = this.unreadCountSubject.value;
        this.unreadCountSubject.next(Math.max(0, currentCount - 1));
      })
    );
  }

  /**
   * Busca chat existente por tiritoId
   */
  findChatByTirito(tiritoId: string): Observable<Chat | null> {
    return this.http.get<Chat | null>(`${this.API_URL}/by-tirito/${tiritoId}`);
  }
}
