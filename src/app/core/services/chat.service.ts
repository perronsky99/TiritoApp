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
   */
  getChat(tiritoId: string): Observable<{ chat: IChat; messages: IMessage[] }> {
    return this.http.get<{ chat: IChat; messages: IMessage[] }>(`${this.API_URL}/${tiritoId}`);
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
