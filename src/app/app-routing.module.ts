import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

/**
 * Rutas oficiales de Tirito App v1.0
 * 
 * Públicas:
 * - /
 * - /tiritos
 * - /tiritos/:id
 * 
 * Requieren login:
 * - /tiritos/nuevo
 * - /chat/:id
 * - /perfil/:id
 * 
 * Auth:
 * - /login
 * 
 * Reservadas (NO IMPLEMENTADAS):
 * - /perfil/editar
 * - /tiritos/:id/editar
 * - /pagos
 * - /pagos/planes
 * - /pagos/historial
 */
const routes: Routes = [
  // Auth routes (sin layout)
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  
  // Main routes (con layout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'tiritos',
        loadChildren: () => import('./features/tiritos/tiritos.module').then(m => m.TiritosModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./features/chat/chat.module').then(m => m.ChatModule)
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'solicitudes',
        loadChildren: () => import('./features/requests/requests.module').then(m => m.RequestsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'ratings',
        loadChildren: () => import('./features/ratings/ratings.module').then(m => m.RatingsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'perfil',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  },
  
  // Wildcard - redirect to home
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
