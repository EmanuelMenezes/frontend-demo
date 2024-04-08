import { Component } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SideMenuComponent,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  menuToggle: boolean = false;

  constructor(private auth: AuthService) {
    this.auth.getUserProfile()
  }

}
