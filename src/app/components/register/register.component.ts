import { Component, OnInit } from '@angular/core';
import {UsuarioModel} from '../../models/usuario.model'
import { NgForm } from '@angular/forms';
import {AuthService} from '../../services/auth.service'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario: UsuarioModel;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel(); //Crea una instancia de usuario

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
   
    this.auth.createUser(this.usuario).subscribe( resp => {

      console.log(resp);//Obtiene la respuesta de FireBase
      Swal.close(); //Cierra el mensaje de carga si obtiene los datos correctos
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
