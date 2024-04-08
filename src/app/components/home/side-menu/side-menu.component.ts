import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  @Input() menuToggle: boolean = false;
  @Output() menuToggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleMenu() {
    this.menuToggleChange.emit(!this.menuToggle);
  }

  constructor(private auth: AuthService) {
  }

}
