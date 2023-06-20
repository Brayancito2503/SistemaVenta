import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalMateriaPrimaComponent } from '../../Modales/modal-materia-prima/modal-materia-prima.component';
import { MateriaPrima } from 'src/app/Interfaces/materia-prima';
import { MateriaPrimaService } from 'src/app/Services/materia-prima.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-materiaPrima',
  templateUrl: './materia-prima.component.html',
  styleUrls: ['./materia-prima.component.css']
})
export class MateriaPrimaComponent implements OnInit, AfterViewInit{

  columnasTabla: string[] = ['nombre','categoria','Fecha de Registro','Cantidad','estado'];
  dataInicio:MateriaPrima[] = [];
  dataListaMateriaPrima = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;


  constructor(
    private dialog: MatDialog,
    private _MateriaPrimaServicio:MateriaPrimaService,
    private _utilidadServicio: UtilidadService

  ) { }

  obtenerMateriaPrima(){

    this._MateriaPrimaServicio.lista().subscribe({
      next: (data) => {
        if(data.status)
          this.dataListaMateriaPrima.data = data.value;
        else
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops!")
      },
      error:(e) =>{}
    })

  }

  ngOnInit(): void {
    this.obtenerMateriaPrima();
  }

  ngAfterViewInit(): void {
    this.dataListaMateriaPrima.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaMateriaPrima.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevaMateriaPrima(){
    this.dialog.open(ModalMateriaPrimaComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerMateriaPrima();
    });
  }

  editarMateriaPrima(MateriaPrima:MateriaPrima){
    this.dialog.open(ModalMateriaPrimaComponent, {
      disableClose:true,
      data: MateriaPrima
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerMateriaPrima();
    });
  }


  eliminarMateriaPrima(MateriaPrima:MateriaPrima){

    Swal.fire({
      title: '¿Desea eliminar materia prima?',
      text: MateriaPrima.nombre,
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) =>{

      if(resultado.isConfirmed){

        this._MateriaPrimaServicio.eliminar(MateriaPrima.idProducto).subscribe({
          next:(data) =>{

            if(data.status){
              this._utilidadServicio.mostrarAlerta("La materia prima fue eliminada","Listo!");
              this.obtenerMateriaPrima();
            }else
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar la materia prima ","Error");

          },
          error:(e) =>{}
        })

      }

    })

  }

}
