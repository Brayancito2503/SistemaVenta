import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

@Component({
  selector: 'app-modal-factura',
  templateUrl: './modal-factura.component.html',
  // styleUrls: ['./modal-factura.component.css']
})
export class ModalFacturaComponent implements OnInit {

  listaProductosParaVenta: DetalleVenta[] = [];
  totalPagar: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.listaProductosParaVenta = this.data.listaProductosParaVenta;
    this.totalPagar = this.data.totalPagar;
  }

}
