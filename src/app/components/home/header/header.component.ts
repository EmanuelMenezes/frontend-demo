import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() menuToggle: boolean = false;
  @Output() menuToggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  userMenuOpen: boolean = false;

  constructor(public auth: AuthService, private router: Router) {
  }

  toggleMenu() {
    this.menuToggle = !this.menuToggle;
    this.menuToggleChange.emit(this.menuToggle);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

