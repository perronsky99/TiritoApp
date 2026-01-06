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
    // Navegar usando el tiritoId ya que así funciona el backend v1.0
    this.router.navigate(['/chat', chat.tiritoId]);
  }

  getOtherParticipant(chat: IChat): string {
    // participants viene populado con { _id, name, email }
    const currentUserId = this.authService.currentUser?.id;
    const other = chat.participants.find(p => p._id !== currentUserId);
    return other?.name || 'Usuario';
  }
}
