import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/categoria';
import { MateriaPrima } from 'src/app/Interfaces/materia-prima';
import { CategoriaMateriPrimaService } from 'src/app/Services/categoriaMateriPrima.service';
import { MateriaPrimaService } from 'src/app/Services/materia-prima.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-materia-prima',
  templateUrl:'./modal-materia-prima.component.html',
  styleUrls: ['./modal-materia-prima.component.css']
})
export class ModalMateriaPrimaComponent implements OnInit {
  formularioMateriaPrima: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalMateriaPrimaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosMateriaPrima: MateriaPrima,
    private fb: FormBuilder,
    private _categoriaServicio: CategoriaMateriPrimaService,
    private _materiaPrimaServicio: MateriaPrimaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioMateriaPrima = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio:[0, Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (this.datosMateriaPrima != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          console.log(data)
          this.listaCategorias = data.value;
        }
      },
      error: (e) => {}
    });
  }

  ngOnInit(): void {
    if (this.datosMateriaPrima != null) {
      this.formularioMateriaPrima.patchValue({
        nombre: this.datosMateriaPrima.nombre,
        idCategoria: this.datosMateriaPrima.idCategoria,
        cantidad: this.datosMateriaPrima.cantidad,
        precio: this.datosMateriaPrima.precio,
        esActivo: this.datosMateriaPrima.esActivo,
        //idProducto : this.datosMateriaPrima == null ? 0 : this.datosMateriaPrima.idProducto,
      });
    }
  }

  guardarEditar_MateriaPrima() {
    const _materiaPrima: MateriaPrima = {
      idMateriaPrima : this.datosMateriaPrima == null ? 0 : this.datosMateriaPrima.idMateriaPrima,
      nombre : this.formularioMateriaPrima.value.nombre,
      idCategoria: this.formularioMateriaPrima.value.idCategoria,
      descripcionCategoria: "",
      cantidad: this.formularioMateriaPrima.value.cantidad,
      precio: this.formularioMateriaPrima.value.precio.toString(),
      esActivo: parseInt(this.formularioMateriaPrima.value.esActivo),
    }

    if (this.datosMateriaPrima == null) {
      this._materiaPrimaServicio.guardar(_materiaPrima).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("Materia Prima fue registrada", "Exito");
            this.modalActual.close("true")
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar materia prima","Error")
        },
        error:(e) => {}
      })

    }else{

      this._materiaPrimaServicio.editar(_materiaPrima).subscribe({
        next: (data) =>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("Materia Prima fue editada","Exito");
            this.modalActual.close("true")
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo editar materia prima","Error")
        },
        error:(e) => {}
      })
    }

  }

}
