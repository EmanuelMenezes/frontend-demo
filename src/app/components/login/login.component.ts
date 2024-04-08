import { MatInputModule } from '@angular/material/input';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule, MatPrefix} from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { AlertComponent } from '../shared/alert/alert.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatPrefix,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  hide: boolean = true;

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private dialog: Dialog) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      localStorage.removeItem('token');
    }
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.value).subscribe((res: any) => {
        if(res.token){
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home/processes']);
        }else{
          this.dialog.open(AlertComponent, {
            data: {
              type: 'error',
              message: 'Desculpe, não foi possível realizar o login. Verifique suas credenciais e tente novamente.',
              truthyButtonLabel: 'Tentar Novamente'
            },
            width: '350px',
            backdropClass: 'custom-backdrop'
          });
        }
      });
    }
  }
}
