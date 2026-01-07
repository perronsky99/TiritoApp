import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService, IChat } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/auth/auth.service';

/**
 * Lista de chats del usuario
 * Ruta: /chat (interno, redirige a primer chat o muestra lista)
 */
@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  chats: IChat[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats(): void {
    this.loading = true;
    this.error = null;

    this.chatService.getMyChats().subscribe({
      next: (response) => {
        this.chats = response.chats;
        this.loading = false;
      },
      error: () => {
        this.error = 'No pudimos cargar tus chats';
        this.loading = false;
      }
    });
  }

  openChat(chat: IChat): void {
    // tiritoId puede venir como objeto populado {_id, title, status} o como string
    const tiritoId = typeof chat.tiritoId === 'object' ? chat.tiritoId._id : chat.tiritoId;
    if (tiritoId) {
      this.router.navigate(['/chat', tiritoId]);
    } else {
      alert('No se encontró el tiritoId para esta conversación');
    }
  }

  getOtherParticipant(chat: IChat): string {
    // participants viene poblado con { _id, name, email, username }
    const currentUserId = this.authService.currentUser?.id;
    const other = chat.participants.find(p => p._id !== currentUserId);
    if (!other) return 'Usuario';
    return other.username ? other.username : (other.name || 'Usuario');
  }

  getOtherParticipantInitial(chat: IChat): string {
    const currentUserId = this.authService.currentUser?.id;
    const other = chat.participants.find(p => p._id !== currentUserId);
    if (!other) return 'U';
    const source = other.username || other.name || 'U';
    // If username starts with '@', strip it
    const clean = source.charAt(0) === '@' ? source.substring(1) : source;
    return clean.charAt(0).toUpperCase();
  }

  getTiritoTitle(chat: IChat): string {
    // tiritoId puede venir como objeto populado {_id, title, status} o como string
    if (typeof chat.tiritoId === 'object') {
      return chat.tiritoId.title || '';
    }
    return '';
  }

  getTiritoStatus(chat: IChat): string {
    if (typeof chat.tiritoId === 'object') {
      return chat.tiritoId.status || '';
    }
    return '';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En progreso';
      case 'closed': return 'Cerrado';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-progress';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }
}
