import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService, IChat, IMessage } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService, IChatMessageEvent } from '../../../core/services/notification.service';
import { TiritosService } from '../../../core/services/tiritos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReportModalComponent } from '../../../shared/ui/report-modal/report-modal.component';

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
export class ChatConversationComponent implements OnInit, AfterViewChecked, OnDestroy {
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
  
  // Creador del tirito (para mostrar botón de cerrar)
  tiritoCreatorId = '';
  closingTirito = false;
  
  // Nuevo mensaje
  newMessage = '';
  sending = false;
  
  // Auto scroll
  private shouldScroll = true;
  
  // Suscripción a mensajes en tiempo real
  private chatMessageSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    public authService: AuthService,
    private notificationService: NotificationService,
    private tiritosService: TiritosService,
    private snackBar: MatSnackBar
    ,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // El parámetro :id ahora representa el tiritoId
    const tiritoId = this.route.snapshot.paramMap.get('id');
    // Query param opcional para especificar con quién chatear (para creadores)
    const withUser = this.route.snapshot.queryParamMap.get('withUser');
    
    if (tiritoId) {
      this.tiritoId = tiritoId;
      this.loadChat(tiritoId, withUser || undefined);
      this.subscribeToRealTimeMessages();
    }
  }

  openReportModal(): void {
    const other = this.chat?.participants?.find(p => String(p._id) !== String(this.authService.currentUser?.id));
    const targetId = other?._id || '';
    if (!targetId) return;
    const dialogRef = this.dialog.open(ReportModalComponent, { data: { targetId } });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open('Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.', 'Cerrar', { duration: 4000 });
      } else if (result?.err) {
        this.snackBar.open('Error enviando reporte', 'Cerrar', { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chatMessageSub) {
      this.chatMessageSub.unsubscribe();
    }
  }

  /**
   * Suscribirse a mensajes de chat en tiempo real via Socket.IO
   */
  private subscribeToRealTimeMessages(): void {
    this.chatMessageSub = this.notificationService.chatMessage$.subscribe((event: IChatMessageEvent) => {
      console.log('Chat recibió evento socket:', { 
        eventTiritoId: event.tiritoId, 
        thisTiritoId: this.tiritoId,
        match: String(event.tiritoId) === String(this.tiritoId)
      });
      
      // Solo procesar mensajes para este tirito (comparar como strings)
      if (String(event.tiritoId) === String(this.tiritoId) && event.message) {
        // Verificar que no sea un mensaje propio (ya agregado localmente)
        const senderId = typeof event.message.sender === 'object' 
          ? (event.message.sender._id || event.message.sender.id || '')
          : (event.message.sender || '');
        const currentUserId = this.authService.currentUser?.id || '';
        
        console.log('Comparando sender:', { senderId, currentUserId, isOwn: String(senderId) === String(currentUserId) });
        
        // Si el mensaje es de otro usuario, agregarlo
        if (String(senderId) !== String(currentUserId)) {
          // Verificar que no exista ya (por si acaso)
          const exists = this.messages.some(m => m._id === event.message._id);
          if (!exists) {
            console.log('Agregando mensaje de otro usuario:', event.message);
            this.messages = [...this.messages, event.message];
            this.shouldScroll = true;
          }
        }
      }
    });
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
        this.tiritoStatus = response.tiritoStatus || '';
        this.tiritoCreatorId = response.tiritoCreatorId || '';
        // Forzar chatEnabled a false si el tirito está cerrado (doble validación)
        if (this.tiritoStatus === 'closed') {
          this.chatEnabled = false;
          this.chatDisabledReason = response.chatDisabledReason || 'tirito_closed';
        } else {
          this.chatEnabled = response.chatEnabled === true;
          this.chatDisabledReason = response.chatDisabledReason || '';
        }
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
      case 'waiting_creator_message':
        return 'Tu solicitud está pendiente. El creador del tirito debe escribirte primero o aprobar tu solicitud.';
      case 'unknown_status':
        return 'El chat no está disponible en este momento.';
      default:
        return 'El chat no está disponible en este momento.';
    }
  }

  getStatusLabel(): string {
    switch (this.tiritoStatus) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En progreso';
      case 'closed': return 'Cerrado';
      default: return '';
    }
  }

  isOwnMessage(message: IMessage): boolean {
    // El sender viene populado con { _id, name, email }
    const senderId = typeof message.sender === 'object' 
      ? (message.sender._id || message.sender.id || '')
      : (message.sender || '');
    const currentUserId = this.authService.currentUser?.id || '';
    // Comparar como strings para evitar problemas de tipos
    return String(senderId) === String(currentUserId);
  }

  getOtherParticipantName(): string {
    if (!this.chat) return '';
    const currentUserId = this.authService.currentUser?.id || '';
    // El backend retorna participants: [{_id, name, email}]
    const other = this.chat.participants.find(p => 
      String(p._id || p.id || '') !== String(currentUserId)
    );
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

  /**
   * Verifica si el usuario actual es el creador del tirito
   */
  isCreator(): boolean {
    const currentUserId = this.authService.currentUser?.id || '';
    return String(this.tiritoCreatorId) === String(currentUserId);
  }

  /**
   * Verifica si se puede mostrar el botón de completar tirito
   * Solo el creador y cuando el tirito está in_progress
   */
  canCompleteTirito(): boolean {
    return this.isCreator() && this.tiritoStatus === 'in_progress';
  }

  /**
   * Cierra/completa el tirito
   */
  completeTirito(): void {
    if (!this.tiritoId || this.closingTirito) return;

    this.closingTirito = true;
    this.tiritosService.closeTirito(this.tiritoId).subscribe({
      next: () => {
        this.closingTirito = false;
        this.tiritoStatus = 'closed';
        this.chatEnabled = false;
        this.chatDisabledReason = 'tirito_closed';
        this.snackBar.open('¡Tirito completado exitosamente! 🎉', 'Cerrar', { duration: 4000 });
      },
      error: (err) => {
        this.closingTirito = false;
        this.snackBar.open(err.error?.message || 'Error al completar el tirito', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
