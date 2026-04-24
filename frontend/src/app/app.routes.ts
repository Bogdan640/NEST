import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { verifiedGuard } from './core/auth/verified.guard';
import { feedResolver } from './core/resolvers/feed.resolver';
import { eventsResolver } from './core/resolvers/events.resolver';
import { shedResolver } from './core/resolvers/shed.resolver';
import { parkingResolver } from './core/resolvers/parking.resolver';
import { profileResolver } from './core/resolvers/profile.resolver';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'join',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/join-block/join-block.component').then(m => m.JoinBlockComponent),
  },
  {
    path: 'pending',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/pending/pending.component').then(m => m.PendingComponent),
  },
  {
    path: 'app',
    canActivate: [authGuard, verifiedGuard],
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'feed',
        resolve: { data: feedResolver },
        loadComponent: () => import('./features/feed/feed.component').then(m => m.FeedComponent),
      },
      {
        path: 'events',
        resolve: { data: eventsResolver },
        loadComponent: () => import('./features/events/events.component').then(m => m.EventsComponent),
      },
      {
        path: 'shed',
        resolve: { data: shedResolver },
        loadComponent: () => import('./features/shed/shed.component').then(m => m.ShedComponent),
      },
      {
        path: 'parking',
        resolve: { data: parkingResolver },
        loadComponent: () => import('./features/parking/parking.component').then(m => m.ParkingComponent),
      },
      {
        path: 'profile',
        resolve: { data: profileResolver },
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
      },
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
