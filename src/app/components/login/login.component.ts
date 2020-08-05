import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel(); //Crea una instancia de usuario

  }

  onSubmit( form: NgForm ){
    if (form.invalid) {
      return
    }
    this.auth.logIn(this.usuario).subscribe( resp => {
      console.log(resp);
     
         
    }, (err) =>{
      console.log(err);
      
    });
  }

}
