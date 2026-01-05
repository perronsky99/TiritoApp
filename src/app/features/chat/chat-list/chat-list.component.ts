import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../../core/services/chat.service';
import { Chat } from '../../../core/models';

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
  chats: Chat[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats(): void {
    this.loading = true;
    this.error = null;

    this.chatService.getChats().subscribe({
      next: (chats) => {
        this.chats = chats;
        this.loading = false;
      },
      error: () => {
        this.error = 'No pudimos cargar tus chats';
        this.loading = false;
      }
    });
  }

  openChat(chat: Chat): void {
    this.router.navigate(['/chat', chat.id]);
  }

  getOtherParticipant(chat: Chat): string {
    // Simplemente devolvemos el primer participante que no somos nosotros
    // Esto se maneja mejor con el currentUser, pero por ahora simplificamos
    return chat.participants[0]?.userName || 'Usuario';
  }
}
