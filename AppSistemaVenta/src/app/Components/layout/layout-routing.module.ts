import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { MateriaPrimaComponent } from './Pages/materia-prima/materia-prima.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { VentaComponent } from './Pages/venta/venta.component';



const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children: [
    {path:'dashboard',component:DashBoardComponent},
    {path:'usuarios',component:UsuarioComponent},
    {path:'productos',component:ProductoComponent},
    {path:'materiaprima',component:MateriaPrimaComponent},
    {path:'venta',component:VentaComponent},
    {path:'historial_venta',component:HistorialVentaComponent},
    {path:'reportes',component:ReporteComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
