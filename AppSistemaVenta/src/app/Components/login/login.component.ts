import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { catchError, map, of, tap } from 'rxjs';
import { locales } from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;
  listaUsuario: Usuario[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  iniciarSesion() {
    this.mostrarLoading = true;

    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password,
    };

    this._usuarioServicio
      .iniciarSesion(request)
      .pipe(
        tap((data) => {
          if (!data.status) {
            throw new Error('No se encontraron coincidencias');
          }
        }),
        map((data) => {
          if (!data.value || !data.value.esActivo) {
            throw new Error('Usuario inactivo. No puede iniciar sesión.');
          }
          return data;
        }),
        tap((data) => {
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(['pages']);
        }),
        catchError((error) => {
          this._utilidadServicio.mostrarAlerta(error.message, 'Opps!');
          return of(null); // Utiliza `of` para retornar un observable vacío en caso de error
        })
      )
      .subscribe({
        complete: () => {
          this.mostrarLoading = false;
        },
        error: () => {
          this._utilidadServicio.mostrarAlerta('Hubo un error', 'Opps!');
        },
      });
  }
}
