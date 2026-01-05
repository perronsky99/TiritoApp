import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { AuthGuard } from '../../core/guards/auth.guard';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatConversationComponent } from './chat-conversation/chat-conversation.component';

const routes: Routes = [
  { path: '', component: ChatListComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ChatConversationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ChatListComponent,
    ChatConversationComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ChatModule { }
