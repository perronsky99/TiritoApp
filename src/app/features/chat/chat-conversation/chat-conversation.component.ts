import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Chat, ChatMessage } from '../../../core/models';

/**
 * Conversación de chat
 * Ruta: /chat/:id
 * Requiere login
 */
@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  chat: Chat | null = null;
  messages: ChatMessage[] = [];
  loading = true;
  error: string | null = null;
  
  // Nuevo mensaje
  newMessage = '';
  sending = false;
  selectedImage: File | null = null;
  
  // Paginación
  loadingMore = false;
  hasMore = false;
  page = 1;
  
  // Auto scroll
  private shouldScroll = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadChat(id);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  loadChat(id: string): void {
    this.loading = true;
    this.error = null;

    this.chatService.getChatById(id).subscribe({
      next: (chat) => {
        this.chat = chat;
        this.loadMessages();
        // Marcar como leído
        this.chatService.markAsRead(id).subscribe();
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = 'Esta conversación no existe';
        } else {
          this.error = 'No pudimos cargar la conversación';
        }
        this.loading = false;
      }
    });
  }

  loadMessages(loadMore = false): void {
    if (!this.chat) return;

    if (loadMore) {
      this.loadingMore = true;
      this.page++;
      this.shouldScroll = false;
    }

    this.chatService.getMessages(this.chat.id, this.page).subscribe({
      next: (response) => {
        if (loadMore) {
          this.messages = [...response.messages.reverse(), ...this.messages];
        } else {
          this.messages = response.messages.reverse();
        }
        this.hasMore = response.hasMore;
        this.loading = false;
        this.loadingMore = false;
        
        if (!loadMore) {
          this.shouldScroll = true;
        }
      },
      error: () => {
        this.error = 'No pudimos cargar los mensajes';
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.chat || (!this.newMessage.trim() && !this.selectedImage)) return;

    this.sending = true;
    this.shouldScroll = true;

    this.chatService.sendMessage({
      chatId: this.chat.id,
      content: this.newMessage.trim(),
      image: this.selectedImage || undefined
    }).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.selectedImage = null;
        this.sending = false;
      },
      error: () => {
        this.sending = false;
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
    }
  }

  removeSelectedImage(): void {
    this.selectedImage = null;
  }

  isOwnMessage(message: ChatMessage): boolean {
    return message.senderId === this.authService.currentUser?.id;
  }

  getOtherParticipantName(): string {
    if (!this.chat) return '';
    const currentUserId = this.authService.currentUser?.id;
    const other = this.chat.participants.find(p => p.userId !== currentUserId);
    return other?.userName || 'Usuario';
  }

  goToTirito(): void {
    if (this.chat) {
      this.router.navigate(['/tiritos', this.chat.tiritoId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/chat']);
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
