import { Component, OnInit } from '@angular/core';
import {UsuarioModel} from '../../models/usuario.model'
import { NgForm } from '@angular/forms';
import {AuthService} from '../../services/auth.service'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario: UsuarioModel;

  constructor( private auth: AuthService) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel(); //Crea una instancia de usuario

  }

  onSubmit( form: NgForm ){
    if (form.invalid) {
      return
    }
   
    this.auth.createUser(this.usuario).subscribe( resp => {
      console.log(resp);
      
    }, (err) =>{
      console.log(err);
      
    });
   
    
  }

}
