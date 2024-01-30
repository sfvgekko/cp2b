import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { UserLocalRefOutputDto } from '../../users/interfaces/user-local-ref-output-dto.interface';
import { UserOutputDto } from '../../users/interfaces/user-output-dto.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponseCp } from '../interfaces/login-response-cp.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<UserOutputDto | null>(null);
  private _currentRole = signal<string | null>(null);
  private _currentLocalId = signal<number | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.notAuthenticated);

  //! Al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public currentRole = computed(() => this._currentRole());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    //Si se recarga la pagina vuelve a hacer la peticion
    this.setSelf().subscribe();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/oauth/token`;
    const clientId = 'app-web';
    const clientSecret = 'cp2';

    const credentials = btoa(`${clientId}:${clientSecret}`);

    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`,
    });

    const body = new FormData();
    body.append('username', email);
    body.append('password', password);
    body.append('grant_type', 'password');

    return this.http
      .post<LoginResponseCp>(url, body, { headers: headers })
      .pipe(
        switchMap(({ access_token }) => {
          localStorage.setItem('token', access_token);
          return this.setSelf();
        }),
        tap((response) => console.log(response)),
        catchError((err) => throwError(() => err.error.message))
      );
  }

  private setSelf(): Observable<boolean> {
    console.log('setSelf');
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    this._authStatus.set(AuthStatus.authenticated);
    const url = `${this.baseUrl}/api/user-local/self`;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<UserLocalRefOutputDto[]>(url, { headers: headers })
      .pipe(
        tap((data) => {
          const userLocalRefOutputDto = data[0];
          console.log('userLocalRefOutputDto: ', userLocalRefOutputDto);
          this._currentUser.set(userLocalRefOutputDto.user);
          this._currentRole.set(userLocalRefOutputDto.role);
          this._currentLocalId.set(userLocalRefOutputDto.localId);
        }),
        map((response) => true),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
