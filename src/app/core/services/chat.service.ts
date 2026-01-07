import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ITirito {
  _id: string;
  title: string;
  status: string;
}

export interface IChat {
  _id: string;
  tiritoId: string | ITirito; // Puede venir como string o como objeto populado
  participants: any[];
  createdAt: string;
  lastMessage?: any;
  unreadCount?: number;
}

export interface IMessage {
  _id: string;
  chatId: string;
  sender: any;
  content: string;
  createdAt: string;
}

export interface IChatResponse {
  chat: IChat;
  messages: IMessage[];
  chatEnabled: boolean;
  chatDisabledReason?: string;
  tiritoStatus?: string;
}

/**
 * Servicio para gestionar Chat
 * Alineado al backend v1.0
 */
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly API_URL = `${environment.apiUrl}/chats`;

  // Contador de mensajes no leídos
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las conversaciones del usuario
   * GET /api/chats
   */
  getMyChats(): Observable<{ chats: IChat[] }> {
    return this.http.get<{ chats: IChat[] }>(this.API_URL);
  }

  /**
   * Obtiene chat y mensajes de un tirito
   * GET /api/chats/:tiritoId
   * @param withUser ID del usuario con quien chatear (opcional, para creadores con múltiples solicitantes)
   */
  getChat(tiritoId: string, withUser?: string): Observable<IChatResponse> {
    let url = `${this.API_URL}/${tiritoId}`;
    if (withUser) {
      url += `?withUser=${withUser}`;
    }
    return this.http.get<IChatResponse>(url);
  }

  /**
   * Envía un mensaje en un chat
   * POST /api/chats/:tiritoId/message
   */
  sendMessage(tiritoId: string, content: string): Observable<{ message: string; data: IMessage }> {
    return this.http.post<{ message: string; data: IMessage }>(
      `${this.API_URL}/${tiritoId}/message`,
      { content }
    );
  }
}
