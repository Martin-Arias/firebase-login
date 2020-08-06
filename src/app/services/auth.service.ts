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
    //Llama a la funcion cuando se crea el componente 
    this.getToken();
  }


  logOut(){
    //Remueve el token cuando se llama a la funcion
    localStorage.removeItem('token');
  }
  logIn( usuario: UsuarioModel ){

    //Iniciar sesion
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post(`${ this.URL }:signInWithPassword?key=${ this.API_KEY }`,authData)
    .pipe(
      map( resp => {//Setea el token si los datos son correctos
        this.setToken( resp['idToken'] );
        return resp;
      })
    )

  }
  createUser( usuario: UsuarioModel ){
    //Registrar usuario
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post(`${ this.URL }:signUp?key=${ this.API_KEY }`,authData)
    .pipe(
      map( resp => { //Setea el token si los datos son correctos
        this.setToken( resp['idToken'] );
        return resp;
      })
    )
  }

  private setToken( idToken: string ){

    //Almacena el token en localStorage
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let loginTime = new Date(); //Guarda la hora al momento del inicio de sesion
    loginTime.setSeconds( 3600 ) //Le suma 3600s/1h a la hora almacenada

    localStorage.setItem('expiresIn', loginTime.getTime().toString() )

  }

  getToken(){

    //Obtiene el token de LocalStorage
    if ( localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token')
    } else {
      this.userToken = '';
    }
    return this.userToken
  }



  isAuthenticated():boolean{
    //Valida el token
    if (this.userToken.length < 2) {
      return false
    }
    //Transforma el valor a number
    const expiresIn = Number(localStorage.getItem('expiresIn'));
    
    //Instancio un new Date(); para almacenar la hora que reciba de local storage
    const expireTime = new Date();

    //Setea la hora instanciada, con el valor recibido del local storage
    expireTime.setTime(expiresIn);


    //Si la hora de expiracion es mas grande que la hora actual devuelve true
    if (expireTime > new Date()) {
      return true;
    }else {
      return false
    }

  }
}
