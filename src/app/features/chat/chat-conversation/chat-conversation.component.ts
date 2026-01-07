import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService, IChat, IMessage } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/auth/auth.service';

/**
 * Conversación de chat
 * Ruta: /chat/:id (donde :id es el tiritoId)
 * Requiere login
 * 
 * Backend v1.0: Los mensajes vienen incluidos al obtener el chat
 */
@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  chat: IChat | null = null;
  messages: IMessage[] = [];
  loading = true;
  error: string | null = null;
  tiritoId: string = '';
  
  // Estado del chat
  chatEnabled = true;
  chatDisabledReason = '';
  tiritoStatus = '';
  
  // Nuevo mensaje
  newMessage = '';
  sending = false;
  
  // Auto scroll
  private shouldScroll = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // El parámetro :id ahora representa el tiritoId
    const tiritoId = this.route.snapshot.paramMap.get('id');
    // Query param opcional para especificar con quién chatear (para creadores)
    const withUser = this.route.snapshot.queryParamMap.get('withUser');
    
    if (tiritoId) {
      this.tiritoId = tiritoId;
      this.loadChat(tiritoId, withUser || undefined);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  loadChat(tiritoId: string, withUser?: string): void {
    this.loading = true;
    this.error = null;

    this.chatService.getChat(tiritoId, withUser).subscribe({
      next: (response) => {
        this.chat = response.chat;
        // Backend v1.0: mensajes vienen en respuesta separada
        this.messages = response.messages || [];
        // Estado del chat (permisos)
        this.chatEnabled = response.chatEnabled !== false;
        this.chatDisabledReason = response.chatDisabledReason || '';
        this.tiritoStatus = response.tiritoStatus || '';
        this.loading = false;
        this.shouldScroll = true;
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = 'Esta conversación no existe';
        } else if (err.status === 403) {
          this.error = err.error?.message || 'No tienes permiso para acceder a este chat';
        } else {
          this.error = 'No pudimos cargar la conversación';
        }
        this.loading = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.tiritoId || !this.newMessage.trim() || !this.chatEnabled) return;

    this.sending = true;
    this.shouldScroll = true;

    this.chatService.sendMessage(this.tiritoId, this.newMessage.trim()).subscribe({
      next: (response) => {
        // Backend devuelve { message: string, data: IMessage }
        this.messages.push(response.data);
        this.newMessage = '';
        this.sending = false;
      },
      error: (err) => {
        this.sending = false;
        // Si el chat fue deshabilitado mientras escribía
        if (err.status === 403) {
          this.chatEnabled = false;
          this.chatDisabledReason = err.error?.reason || 'El chat ha sido deshabilitado';
        }
      }
    });
  }

  getDisabledReasonText(): string {
    switch (this.chatDisabledReason) {
      case 'tirito_closed':
        return 'Este tirito ya ha sido completado. El chat está cerrado.';
      case 'request_rejected':
        return 'Tu solicitud fue rechazada. Ya no puedes enviar mensajes.';
      case 'no_request':
        return 'Debes solicitar este tirito para poder chatear.';
      case 'no_requests':
        return 'Aún no hay solicitudes para este tirito. El chat se habilitará cuando alguien solicite trabajar.';
      case 'not_assigned':
        return 'Este tirito está en progreso con otro usuario.';
      case 'unknown_status':
        return 'El chat no está disponible en este momento.';
      default:
        return 'El chat no está disponible en este momento.';
    }
  }

  isOwnMessage(message: IMessage): boolean {
    // El sender viene populado con { _id, name, email }
    const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
    return senderId === this.authService.currentUser?.id;
  }

  getOtherParticipantName(): string {
    if (!this.chat) return '';
    const currentUserId = this.authService.currentUser?.id;
    // El backend retorna participants: [{_id, name, email}]
    const other = this.chat.participants.find(p => p._id !== currentUserId);
    if (!other) return 'Usuario';
    return other.username ? other.username : (other.name || 'Usuario');
  }

  goToTirito(): void {
    if (this.tiritoId) {
      this.router.navigate(['/tiritos', this.tiritoId]);
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
