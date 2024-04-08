import { Component } from '@angular/core';
import { PageComponent } from '../shared/page/page.component';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatPrefix } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PageComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    AlertComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  formProfile: FormGroup

  constructor(public auth: AuthService, private api: ApiService, private fb: FormBuilder, private dialog: Dialog) {
    this.formProfile = this.fb.group({
      id: [null],
      userId: [null],
      name: [null, Validators.required],
      bio: [null],
      location: [null, Validators.required],
      website: [null],
      social: this.fb.group({
        twitter: [null],
        facebook: [null],
        linkedin: [null],
        instagram: [null]
      }),
      experience: this.fb.array([])
    })

    this.formProfile.patchValue(this.auth.userProfile!)

    this.auth.userProfile?.experience.forEach(experience => {
      this.addExperience(experience)
    })
  }

  addExperience(experience?: any) {
    const newExperience = this.fb.group({
      id: [null],
      company: [null, Validators.required],
      position: [null, Validators.required],
      description: [null]
    })

    if (experience) {
      newExperience.patchValue(experience)
    }

    const experienceFormArray = this.formProfile.get('experience') as FormArray

    experienceFormArray.push(newExperience)
  }

  removeExperience(index: number) {
    const experienceFormArray = this.formProfile.get('experience') as FormArray
    experienceFormArray.removeAt(index)
  }

  saveProfile() {
    if (this.formProfile.valid) {
      this.api.put('/profile', this.formProfile.value).subscribe((res: any) => {
        this.auth.userProfile = res
        this.dialog.open(AlertComponent, {
          data: {
            message: 'Perfil atualizado com sucesso!',
            type: 'success'
          },
          width: '350px'
        })
      })
    }
  }

  get experienceFormArray() {
    return this.formProfile.get('experience') as FormArray
  }

}
