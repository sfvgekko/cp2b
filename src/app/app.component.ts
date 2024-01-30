import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { AuthStatus } from './auth/interfaces/auth-status.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public authStatusChangedEffect = effect(() => {
    console.log('authStatusChangedEffect', this.authService.authStatus());
    switch (this.authService.authStatus()) {
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        return;
      case AuthStatus.notAuthenticated:
        console.log('authStatusChangeEffect');
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });
}
