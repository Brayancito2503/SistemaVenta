import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/categoria';
import { MateriaPrima } from 'src/app/Interfaces/materia-prima';
import { CategoriaService } from 'src/app/Services/categoria.service';
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
    private _categoriaServicio: CategoriaService,
    private _materiaPrimaServicio: MateriaPrimaService,
    private _utilidadServicio: UtilidadService
  ) { 
    this.formularioMateriaPrima = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      fechaRegistro: ['', Validators.required],
      cantidad: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (this.datosMateriaPrima != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
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
        fechaRegistro: this.datosMateriaPrima.fechaRegistro,
        cantidad: this.datosMateriaPrima.cantidad,
        esActivo: this.datosMateriaPrima.esActivo.toString()
      });
    }
  }

  guardarEditar_MateriaPrima() {
    const _materiaPrima: MateriaPrima = {
      idProducto: this.datosMateriaPrima == null ? 0 : this.datosMateriaPrima.idProducto,
      idCategoria: this.formularioMateriaPrima.value.idCategoria,
      nombre: this.formularioMateriaPrima.value.nombre,
      cantidad: this.formularioMateriaPrima.value.cantidad,
      fechaRegistro: this.formularioMateriaPrima.value.fechaRegistro,
      esActivo: parseInt(this.formularioMateriaPrima.value.esActivo)
    };

    if (this.datosMateriaPrima == null) {
      this._materiaPrimaServicio.guardar(_materiaPrima).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("Materia Prima fue registrada", "Exito");
            this}
          }
        }
      )
    }
  }
}

