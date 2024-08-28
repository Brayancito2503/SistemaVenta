import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import { ModalFacturaComponent } from '../../Modales/modal-factura/modal-factura.component';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;
  productoSeleccionado!: Producto;
  tipodePagoPorDefecto: string = "Efectivo";
  totalPagar: number = 0;
  puedeFacturar: boolean = false; // Variable para habilitar el botón "Facturar"

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductosParaVenta);

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1);
        }
      },
      error: (e) => {
        console.error('Error al obtener la lista de productos', e);
      }
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    });
  }

  ngOnInit(): void {
  }

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  facturar() {
    const dialogRef = this.dialog.open(ModalFacturaComponent, {
      width: '400px',
      data: {
        listaProductosParaVenta: this.listaProductosParaVenta,
        totalPagar: this.totalPagar
      }
    });
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta() {
    const cantidad: number = this.formularioProductoVenta.value.cantidad;
    const precio: number = parseFloat(this.productoSeleccionado.precio);
    const total: number = cantidad * precio;

    this.totalPagar += total;

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: cantidad,
      precioTexto: String(precio.toFixed(2)),
      totalTexto: String(total.toFixed(2))
    });

    this.datosDetalleVenta.data = this.listaProductosParaVenta;

    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: ''
    });
  }

  eliminarProducto(detalle: DetalleVenta) {
    this.totalPagar -= parseFloat(detalle.totalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto !== detalle.idProducto);
    this.datosDetalleVenta.data = this.listaProductosParaVenta;
  }

  registrarVenta() {
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;

      const request: Venta = {
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosParaVenta
      };

      this._ventaServicio.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta.data = this.listaProductosParaVenta;

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Número de venta: ${response.value.numeroDocumento}`
            });

            // Habilitar el botón "Facturar" después de registrar la venta
            this.puedeFacturar = true;
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta", "Oops");
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: (e) => {
          console.error('Error al registrar la venta', e);
          this._utilidadServicio.mostrarAlerta("Error al registrar la venta", "Oops");
          this.bloquearBotonRegistrar = false;
        }
      });
    } else {
      this._utilidadServicio.mostrarAlerta("Debe agregar productos para registrar la venta", "Oops");
    }
  }

}
