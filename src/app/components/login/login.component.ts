import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel(); //Crea una instancia de usuario

  recordar: boolean = false

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    //Cuando carga el componente login, verifica si hay algun email almacenado en localStorage
    if ( localStorage.getItem('email') ) {
      this.usuario.email = localStorage.getItem('email')
    }
  }

  onSubmit( form: NgForm ){

    //Si hay errores en el formulario no hace nada
    if (form.invalid) {return}
    
    //Muestra un mensaje de carga mientras verifica los datos en FireBase
    Swal.fire({
      allowOutsideClick: false,
      text: "Espere por favor...",
      icon: 'info',
    });
    Swal.showLoading();

    this.auth.logIn(this.usuario).subscribe( resp => {

      console.log(resp);//Obtiene la respuesta de FireBase
      Swal.close(); //Cierra el mensaje de carga si obtiene los datos correctos

      //Si el check esta marcado, almacena el email en el localStorage
      if (this.recordar) {
        localStorage.setItem('email',this.usuario.email);
      }

      this.router.navigateByUrl('/home')    

    }, (err) =>{

      console.log(err);
       //Muestra el mensaje de error
      Swal.fire({
        title: 'Ocurrio un error al autenticar',
        text: err.error.error.message,
        icon: 'error',
      });

    });
  }

}
