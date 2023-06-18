import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';

import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formularioUsuario:FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { 

    this.formularioUsuario = this.fb.group({
      nombreCompleto : ['',Validators.required],
      correo : ['',Validators.required],
      idRol : ['',Validators.required],
      clave : ['',Validators.required],
      esActivo : ['1',Validators.required],
    });

      if(this.datosUsuario != null){

        this.tituloAccion = "Editar";
        this.botonAccion = "Actualizar";
      }

      this._rolServicio.lista().subscribe({
        next: (data) => {
          if(data.status) this.listaRoles = data.value
        },
        error:(e) =>{}
      })

  }

  ngOnInit(): void {

    if(this.datosUsuario != null){

      this.formularioUsuario.patchValue({
        nombreCompleto : this.datosUsuario.nombreCompleto,
        correo : this.datosUsuario.correo,
        idRol : this.datosUsuario.idRol,
        clave : this.datosUsuario.clave,
        esActivo : this.datosUsuario.esActivo.toString()
      })

    }

  }


  guardarEditar_Usuario(){

    const _usuario: Usuario = {
      idUsuario : this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto : this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion  : "",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
    }

    if(this.datosUsuario == null){

      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (data) =>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue registrado","Exito");
            this.modalActual.close("true")
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario","Error")
        },
        error:(e) => {}
      })

    }else{

      this._usuarioServicio.editar(_usuario).subscribe({
        next: (data) =>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue editado","Exito");
            this.modalActual.close("true")
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario","Error")
        },
        error:(e) => {}
      })
    }

  }


}
