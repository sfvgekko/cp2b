import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
  declarations: [UsersPageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ListboxModule],
  exports: [UsersPageComponent],
})
export class UsersModule {}
