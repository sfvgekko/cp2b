import { Component } from '@angular/core';

interface MenuItem {
  title: string;
  route: string;
}

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  public menuOptions: MenuItem[] = [
    { title: 'Empleados', route: './users' },
    { title: 'Servicios', route: './test' },
    { title: 'Horarios', route: './reactive/dynamic' },
  ];
}
