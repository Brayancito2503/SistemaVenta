import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { MateriaPrimaComponent } from './Pages/materia-prima/materia-prima.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';

import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { ModalMateriaPrimaComponent } from './Modales/modal-materia-prima/modal-materia-prima.component';



@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    MateriaPrimaComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
    ModalMateriaPrimaComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,

    SharedModule
  ]
})
export class LayoutModule { }
