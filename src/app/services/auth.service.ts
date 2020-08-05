import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UsuarioModel} from '../models/usuario.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'https://identitytoolkit.googleapis.com/v1/accounts'
  private API_KEY = environment.API_KEY

  userToken: string;
  // CREAR NUEVO USUARIO
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //INGRESAR CON EMAIL Y PASSWORD
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor( private http: HttpClient) { 
    this.getToken();
  }


  logOut(){

  }
  logIn( usuario: UsuarioModel ){

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post(`${ this.URL }:signInWithPassword?key=${ this.API_KEY }`,authData)
    .pipe(
      map( resp => {
        this.setToken( resp['idToken'] );
        return resp;
      })
    )

  }
  createUser( usuario: UsuarioModel ){

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post(`${ this.URL }:signUp?key=${ this.API_KEY }`,authData)
    .pipe(
      map( resp => {
        this.setToken( resp['idToken'] );
        return resp;
      })
    )
  }

  private setToken( idToken: string ){

    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  getToken(){
    if ( localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token')
    } else {
      this.userToken = '';
    }
    return this.userToken
  }

  isAuthenticated():boolean{
   return this.userToken.length > 2;
  }
}
