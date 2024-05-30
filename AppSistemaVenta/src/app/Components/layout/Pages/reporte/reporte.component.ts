import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment'; 

import * as XLSX from "xlsx"

import { Reporte } from 'src/app/Interfaces/reporte';
import { ReporteMateria } from 'src/app/Interfaces/ReporteMateria';
import { VentaService } from 'src/app/Services/venta.service';
import { MateriaPrimaService } from 'src/app/Services/materia-prima.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { jsPDF } from "jspdf";

import autoTable from 'jspdf-autotable'
import { VentaComponent } from '../venta/venta.component';


export const MY_DATA_FORMATS={
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput : 'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ] 
})
export class ReporteComponent implements OnInit {


  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  listaMateriaReporte: ReporteMateria [] = [];
  columnasTabla: string[] = ['numeroVenta','fechaRegistro','producto','tipoPago','precioUnitario','cantidad','total'];
  columnasMateriaTabla: string[] = ['Nombre','Categoria','Cantidad'];
  dataVentaReporte= new MatTableDataSource(this.listaVentasReporte);
  dataMateriaReporte = new MatTableDataSource(this.listaMateriaReporte);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;


  constructor(
    private fb:FormBuilder,
    private _ventaServicio: VentaService,
    private _MateriaServicio: MateriaPrimaService,
    private _utilidadServicio: UtilidadService
  ) { 

    this.formularioFiltro = this.fb.group({
      fechaInicio : ['',Validators.required],
      fechaFin : ['',Validators.required]
    })

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarMateria(){

      this._MateriaServicio.lista().subscribe({
        next: (data)=>{
          console.log(data)
          if(data.status){
            this.reporteMateria( this.listaMateriaReporte = data.value)
            this.dataMateriaReporte.data = data.value;
          }else{
            this.listaVentasReporte = [];
            this.dataVentaReporte.data = [];
            this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops!")
          }
        },
        error:(e) =>{}
      })
  }


  buscarVentas(){

    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date"){
      this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas","Oops!")
      return;
    }

    this._ventaServicio.reporte(
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data)=>{

        if(data.status){
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        }else{
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops!")
        }
      },
      error:(e) =>{}
    })

  }

  exportarMateria(){
    this.reporteMateria(this.listaMateriaReporte);
  }

  exportarExcel(){
  // Llamar a la función reporte y pasar la lista de ventas como argumento
  this.reporte(this.listaVentasReporte);
}

reporte(listaVentas: Reporte[]) {
  const doc = new jsPDF();

  const fechaActual: Date = new Date();
  const dia: number = fechaActual.getDate();
  const mes: number = fechaActual.getMonth() + 1; // Los meses en JavaScript comienzan desde 0, por lo que agregamos 1
  const año: number = fechaActual.getFullYear();

  // Crear los datos de la tabla a partir de la lista de ventas

  const totalVentas = listaVentas.reduce((sum, venta) => sum + parseInt(venta.total), 0);
  const totalCantidad = listaVentas.reduce((sum, venta) => sum + venta.cantidad, 0);

  const tableData = [
    ['Numero de venta','Fecha de Registro','Tipo de Pago','Producto','cantidad','precio','total de venta'],
    ...listaVentas.map(venta => [
      venta.numeroDocumento,
      venta.fechaRegistro,
      venta.tipoPago,
      venta.producto,
      venta.cantidad,
      venta.precio,
      venta.total,
      'Suma total',
    ]),
    ['Total:', '', '','',`${totalCantidad}`,'',` C$ ${totalVentas}`]
  ];

const ur = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEhUQERISFRIXGRcVGRgXFxcWGxUXGBUYFhkWFhgaHiggGCAlGxgeITEhJSkrLjEuGh8zRDMtNygtLisBCgoKDg0OGxAQGi0mICYvMC0tMC8tLS0tLjUvLS0tLS0tLS0tLS0tLS0tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4AMBIgACEQEDEQH/xAAcAAEAAwEAAwEAAAAAAAAAAAAABAUGBwECAwj/xABGEAABAwIEAwUFBQYEAwkBAAABAAIDBBEFEiExBkFRBxNhcYEUIjJCkRViobHBIzNScoKSQ6LC0bLw8SQlNFNjdJOj4Rb/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAgMEBQYB/8QANBEAAQMCBAMGBQQCAwAAAAAAAQACEQMhBDFBURJhcQUigZGh8BMyscHRFELh8QZSI0Ni/9oADAMBAAIRAxEAPwDuKIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIigYlisNO3NNI1gO19z5AalSp5gxrnnZoLj5AXXN+GMK+1ZpK+qu+LMWxxn4TzGYcw0EC2xN1VUeQQ1oufIc1oo0muDnvPdbtmScgPW+i6HQ1sczBJE4OYdiP+dFKWW4IwqSlFRE9oazvnOjy2ylhAILQNhawt1BWpUmElsnNV1mta8hhkae/RERFNVoiIiIi8ErKRcSyTVppKaNroozaWU3s3qG20vfQDmb8goOeGxOqsZSc+Y0En39N1rERFNVoiIiIiIiIiIiIiIiIiIiIi+ckgaCSQANSToAOpKRyhwBaQQdiNQfIoi+iIiIiIiIvR7QQQdjosVw0/wCzZnYfNpG9xfBIfheD8hPJw0H/AFC3Cr8WwuKqiMMzczT6Fp5OaeRHVQe2YIzCtpVA2WuyOe/IjmPUSFPCErI4HiEtLOMPqnZ7i8Ex/wARo+R/3h/t1Ckcd4i6KnEUX72dwhZ/V8R+ml/FR+KOEuOmYU/07viBgOeR0jfwvO0FVFZxtIJnPijDqKNzY5JfFxtmb1t0APXmFtTKXR547EluZl9Abi7b9FzvGKSNjqTB4yCM7Xzn+Ine/mMxtyGVbafFmtnbTi2kbpZDyjYLBt+lz+AKqoudLg4zl56gdLepVuJps4WGm2LE9WjInmYPoAsVWfaHcOq62rfTNtZsMQ98uOzSQbDy101utNwQyp9la6reXPd7zQ74mssLBx6nfwuqjD2HFqn2h4PscDiI2naWQfMRzA3+g6q+4yxc0lK+Rn71xEcf87ufoLn0UafCJqyYHPPn+P5VtcvfFCBxEiQABw7NEDPU+RyUPE+Jn9/7JRxNmmFy8l2VkYFtz+HnorPhnuXU7JIIxGyQd4WjfM74sx5m/NZyKBmD0D5H61Uo1O5dK4GzR1Db3+p5qaaj7Mwxmb94GBrR1lfrb0JJ9CpMeQZftJ5beP1VdSk1zQ2kM3cIP+2ck8piNp3WtC8rkUHFVRDRlkOd775pZXnSN0h0ijvu62v9xtbVdH4aE3s0RqTeYtu7qLm4B8QLA+IU6VcVDAGkqGIwjqIkkZwN+sadDe+StkRFesiIiqsexqKjiMsp02a0bud0H+6+OcGiTkpNa57g1oklWqKFhVZ38Mc2VzM7Q7K7dt+RU1AZEr4RBgoiIvq+IiIiKNXU4ljfGdntcw/1Aj9VluzGcmkMT/jikfGfz/O62JWLwBvs2J1dPs2YNqGf6repd9FS8Q9ruo8/6WmieKlUZ0d5WPoStqqviHEPZqaWYWuxpLb83HRo+pCtFke013/Yco+aSNv+a/6KVV3DTc4aAqGHYH1WsORIHqvjwxxHUvljp6pjc0sffsc029wgkBwtvofwWv71uYsuMwAJHMA3AP4H6LBY1VMp8Wo2XADYmx+ji9gV5h1T3mJVIB92OKKM/wA13P8A9Sqpv4SWE5GPSfytFekHAVAIBbxWy+aPpHLkrrE5zHDJIN2Me8ebWk/ooHCEpfRwPLi5xYCSTck3N7+qt5Yw4FrhcEEEdQRYhYgcOYjTNMFHVRdxc5e8BD2A8swac3norH8QcHATnt91TSDHMLXODTIMmedrA79DuNY/aDXB1VSQRe9MyQP93UtzFoA062ufIK54xoKhz4KmmYJZITJ7hIF+8aGh4uQDlIva69OFuDm0rjUTP7+pN/fNwGXvcMuSdb6uOq1qg2m5wcX2J20jLxVtSu1hY2ncNkSdZztnBHiubnhWppu6r2jv61r3vlbm3a9ujWX3ynyvc+AXnEOHq80rnNDX1VTIHTjMG5YwDljDjpYHcDrbUBdHRP0zOfvXqvn66rIJienOY6A3A6bBYPB8NxeCNkTDRMYwWDSXE+NyI9/FWHFFDO+nhkLWzTQysnLIwWiQNuC1oJJ2PrbxstYimKQAiT5n7qs4lxeHkCRfIDziFgMHwmqr6ltZXsMccesUJ0N73BLeQG+upIHIJxpg9VX1cVM1rmUzW5zLyuTZ3m6wAA8SVv0UfgNLeE63O56qX6t4qB4AECANB0WAqsLjNZSYdG0Np4Ge0vH8brlrS7qbt1P3itVSYqyWZ0Md3Bg994+FrtLR35utqQNvVRMe4aiq3skc+WN7QWl0Tg0vYTfI64Ol9dNdT1Vnh1BHBGIomBjG7AfiSdyT1Oq+sY5rjGXu3JRqVGPY2SSQI8SZJmZJKmrP8QcV01HpI/NJyjbq6/K/RfDjfEpYYo2U5DZJniIPcbBgsXFxJ20G6yQxChwwF0YNZW2u6UguDCTqQdcov01PNyhVrcJgW55+Q1VuHwvGOMgnYC3iXZNHqeStYO0BzXH2mkkhY5rnRkhwL7cgHAXuSBew3UvBsClq5RXV48YYD8MQ3Dnjm7w9Tra0ThPDJK14xKt94/4DCPdaP/My/wDCPXU2K3M8zWAue4NaNySAB6lfKTHPHE8mMwD9THoNOdoliHspOLKQAdk4ifENm/U66Wz+yKopOIqWWTumTMc/kBfXyOxVutDXtcJaZWJ7HMMOBHWyIiKSiiIiIixXGv7Cqo64bNeYZP5X6gnys7+5bVUfGWH+0Uc0YF3Zc7f52e+38Rb1VVZvEwgZ5jqLhXYd4ZVBdlkehsfQqZi+IspoXzPPutF/5jyaPMrJSYPUVOHPe8k1MzxUtaTo2xBZG2+jfcH1KqsNrXYvLTQG/cQMbJL997dNfPQW8XLqICraRXk/tiPPP8ea0PDsJDf3zJ5QbDxzPhssBQYA7EJameshkiDwyOMH3Xx5LHOw8rEDXY3O4Wj4d4fbRiT9o+R8js7nvy5j0BIGvP6q9RWMotaZzO+t1RUxD3jhmG2sMrf146yiIitVCIiIiIiIiIiIiIiIiIiIircZwiCrj7qdmZoIcLOc0gjmHNII3tvzWb4vwWGnoHMhiDIs8TpBGCXFjXDMSd3WGtz0W2RQfTDgRuIlW0qzmOaZsDMSY981gK7ji0Dn0dO7umNH7SQZI2i4a0N/jNyBYFZerq6qoly10NXKcrXshjzNaQ7UF5Y3TyFj4rpPFmGPqKcsiy941zJGh3wuLHA5T0uNPoquLi6o0bJhtWH3y+6xzhf+a1reN7eKy1acuh7jGkC3kARtmt+HqhrJpMbPN0O5GSQd54Y2sqnhvhWWSeOpkp4aRkZzNjY0d488s5uTbQbknwC6QqvCKyaYF0sDoRplDntc473uG/Dy53VotNNgaJE33zWKvVe93ei2gyHqfqUREVioREREReCvK8FEWZ4X4Y9hlqHNeHRSkOYLWLNXktJ2IGbRQcf7RaWmJYwGd40OQgNB6ZufoCsp2hccOlc6kpnERglr3A2MhFwQCPk5ePlvgqWjkmdlY1z3dAxzz9AufUxHB3aS9Xgexfit/UY0xYWmLRYuOltPoujN7W33/wDCC3TMb/W36Le8P44KthPdSxOaQHNkaW77FpI94Ll+CYVS4flqa6RplbZzKdhBcHAh7TJf4SCNjp5rpXB2NPrYDO9gYC9zWgXPutA1JO5vceitoPeXQ919reuyx9q0MMKfHhqUNBjjl0E7NB+YWMkeHPQIiLWuAiIiIs7xrxL9mwNmyB7nPbGGk5dwSTex2AU/h7FW1lPHUNaWh4Oh3BDi0+eoOqwXbhN7lLH1fI7+1rR/qWy4GhyYfSt6xMd/eM/6q0tHwwdZVYJ4yFfIig0+KQSSOhZLG6Rl8zA4FzbaG433VSsU5VGN8Q01Fl9okDM3wixcTbc2AvYdVOxCsZBE+aQ2Yxpe4+AF1xSop3YlFXYtVX7tjTHA25sHnRoHUMzDzc49FZTYHXOSg90WGa6jivFMEdHJWRSMkAFmamxkPwsI3Gtr35LE4dSV81A/FRWVAqbvlbHm/ZuiYSCwx7a2JHLZYmaQtw+KEXvLUSyefdxRRt/F7l23FGtocMe35YqcsHiRHkH1P5q1zfhiBmT9FWDx3OykcI42K6ljqLAOOjgNg8aG3gdx4EK6XPux05MPc52je9db0YwaeoV5ieIEnLcgnkOQ6abn8FhxtdmG4ich7G9zpYq+i01AFpAizuFYq2Nha+5IOnkf/wBU9uNxHe49Fkp9p4ctaajg0nME5cpt9lY6k4EgCVnq3FHzTaOIY2+UDwNsx6lanDKnvYw477HzCwTjkNxrkJDvEdfUWI8leYVipjbYNu0nNzB1AH6LhYTHGjinPruMO8ekeFrdFrrUgWgMGXsrWoo9JUtlbmb/AND0KkL1bHte0OaZByKwkRYoiIpL4izfHuJ+zUUzwSHOHdtI3BfpceQufRaRZLj2GllhbDVVHc3eHNI1JIBbq22rfe1PlqoVCQwwtGEa11dgcCRIkASSMzYX/hcJ3NupW3r8Dr4KSGOKCVocHd8GBxcX53gd41lyW93ksNh73NS6Ps8mjnY4NjqKfRwe2Tu8zTt1II30uD1XWadjW3aDfUk3NyC45vTe/qsFHDEzxSF6jtTtxnFT+BDgO8Z6EAESCIkm4ziMiuRcNdm08xbJVkxR75f8Rw6ZToz118F1uho2QRtiiaGsYLNaOQUpU/E2MNo6d87twLNH8Tz8I+u/gCttOkykDC8/i8dicfUAeZMwAMpPvMysl2g8Yz0VVBDTuYbtzPaQDmLnBrWnm3Y7W3XRAvzXDW97WMmncTeVj3k66ZmlxsPDkF1TB+0WnzTe0yZG97+yGUk92RYXyjqL/wBSu4w5tMAXcJVFXBVKTqxzbTIBOk5W8fRdBVLiHFFHTyCCaojbIflNza+2YgWb62VgyobIwvhc19wbFpBF/MeK5VwlwrDidE/vHBtX7STPI5ueQZTrG0kgsvc69b7qbGtN3LG4nIJ24vvLSjoyV31LP9lq+NMTkw/DY3QPySN7mNps12wFxZ33QeSyHbE0GtpoxsIrf3SEforrtwdakgb1m/KJ6uaARTB3KqJjjK2uBVT30kM05Gd0THvIFhctDjpyXOeyab2ivrKk/OHOHlJNm/0harjzEBSYW8A2c9jYGf1Nym3kwOPosR2SzGmrZYKgd298QIDtLjSRu/VhJ9CosH/G87/2pOPfaFo+2PEHCCGkj+OeTUdWstZvq9zfoqPtKqI6CipsKjI2a+S3gdCfF0hLv6VAxqrq8UrH1lJEZoaR7MjRa9s1w5oNs1yzMRe9iFIpMHkqIsSr663tIhkAiJBdFmYSHPaCchygBrTqBfqFIAMAnTTmcvRQJLiY19/VVGIYa8YZQ1rGksiknElvlDpRkcfC7LE+IWi7SOL2VcUVHSEyGUsc4NGpJsWRAczm1PkFqOywB+GRtcAW5pWkEXBBkdcEc917V+C0VEc1NTQxTPB99jQC1uzsv8N720tuVXXxLaMvePlJhWU6RdAac1Ew1vsdLDStIvGLvcPmkJJdl8ASRfwCiyVBdfW19/HzO7vVej3XP/Og6Beq8Fje0qld5cDHmJ/A5a5uvl3KOHbTbCk0XP0/VSV8KNtm366+nJSFzcl9cZK8U9B30gDSA/LfUXDgCNHD9eSm/ZFRe3dt884y/lf8FHwivZHM57ybBuUWF9bgrYwyBzQ4bEAjyOq9H2bg8PiaAbUPeE2m4E25gLHWe9jrZKDhOH9y05jdzrXtsLbAD9VZIi9FSpMpMDGCAFkc4uMlERFYvi8Ffn3iLEJa+qkmyvdGDpYF2RmbKwaDS9/qSu+TzNYLvc1reriAPqVz2B9PhLqmOJ7c0jYpYzIXWexzntyNMbSXEa2PPM3oSsuKZxAAmB/Fl2uxcT8Bz3MZxPgcPmOK/TbxW2M7YYo2sFiQ1kbDob5dARuAALnoAVE9pBADXHIdS5oJfOefdgaht/n2tsQNVQ00TZH07ZJpGZ2vayOZ2eR7GkGxIGUOJ1LXEnRoINrN2VLTsZfIBrudySNNXHU22VzSXLnPYKWdyfyRzByO95vt7QOcRdzcvQXuQPG2l/K/muRcZ1suI14o2e7HG5zBf4WlhtJK7ysfQeKtOOe0B8UjqakIaWktdJ7rrmw0b0sbgk8wViq/imWUODWwxmX94Y25HS63OY3JsTqQLA9FkxNdju4PHnyXoOx+zMTTIxHCLjuyfln90XJtkOekyoePvhdVFtPcQsayNpOheGt1eb/xG59VccGYPHOKyomaHRQU77BwuM7mOAPoGn1IKzdBTuknyMaXOI0A8GXJ8ALE3W2wyQU+APLdZayUxtHN1yGEf2sd9V02tLi13/ho8ySfQeq4eKqinSqYdp/7qhOpIaGtE9SfEha7s0nbBhDZnbN76Rx/le6/4BUGC1clBUUtbJcQYjG3vejJyLhx8wQ7/wCRVWH4w/2D7Fa1zax85gcw/IwuDnk+tx5aqy4oqZ6mBuFMpJjM2YNY4RkRthjNoniT4TdtruvzI8FeW98zqfTf3suUD3RGg9VH7Ujmxanb/wCnD+M71r+1XA5Kui/YtL5IniUMG722c1waOZs69udli+PWEYvSsJuWspmk9T3ztV2lVucWhhGl1NokuC5GBUY3UUsT6eeKkga0ymRjmBzwBmAzAXvbKANQCTorrHIMPxOuFEYnumjY7NPE7L3Qaf3bjs4XNtQbE2628cf8YuY77PorvqpDkJZqWE/I373U/KNfK94G4Xbh8GU2dO+zpX9Tya37ovp6nmhMNDsth90Akxnv+Fn+I6uLBaVtFQNPtEx93XM+5s0yOPNxNmt5egVk7AxRYPUQuN5DBNJK7cvldGS4k8+nkAs/w/F9pY3PVO1ipiQ3pmaTHH+Ie/zC1XaXXthw6e51kb3TfEv0P0bc+iEEENGdift6INXdR78VD7Inf93N8Hyfnf8AVfHiCpzzyG+jTl8g3f8AzXVj2Z0Zhw6AOFi/NJtbR7i5v+WyqhCXTSEPaXNkeS0t1vnJHPULg/5A/uATALrnYLbgbXOyhNcCLggjw1XtBHn/AJeZ6+A/3VhUUed5kc3V2pA0aTtew39V7iI9LD6LyD+BriGunY5eK6JeSMoXqvjVT5B4nQL41WJRs91pzv6N1t5nYK24dwR8jhUVA8Wt/W3T8/LfRhMHUxDw1o97+81S94aJK8UHDcjg10jmtabEjUu15WtYH1PktbGwNAaNABYeQX0Re1w+EpYcRTGeZ1K576jn/MUREWlQRQsUxGOmjdNK7KxoJPU2BNmjmdNlMK5RxnirsQgzRX7oF7mjQlzorh/qYpg/L0Y5V1anAOa14PC/HqAOMNkAnaf6PKAVleMuJn182cXYxoytbe9t9Tyubr34cxYl8LXOaJInExPk1YDf93If4L6h3ynXYlZvIb2sbrf8F9nz58lRU+5CRcNBs5+ulxb3WkC/WxC5TA+o+Rcr3eNGEwuE+HU7rRZozMxpuTJBnMEg2K0WM8QQ4T3dO6nY93dmQOjGRrXSOcLNDi5wuWG5v09Mx2eY1WGYQhz3QDPLI22bTKXH3jqLutz1J8103HOGKasy9/HcsFmkOcwgdLtOo8FKwjB4KVmSCNrAd7buPVzjqfVdA0nmoDNhl+F5FmPwzMI6n8OajsybjWCL5ibRHVfnSseXyOfZ2pLtdTq4nU8z4q0wDheqrXARMOW+shuxrf6re95C5XbZOFaJzzK6lhLycxu29z1ttf0VxHGGgAAADQAaAeQVLcFfvFdKt/kx4A2hTg7kzHQWnx8lxbg3CBDjD6UuzBglaXWte8NibcviV/w1wTWMmpo6wxGlo87o8jie9e52YFzSNLGx9ANbkqFwzrxDUn703/C0K67QeMnRH2Ciu+qkIYS3UszbNb98/gNV2DxSGN/1HhbP1Xjy7iLnvuSSepJn6r4cZY0Z6gYfh7WGrfdsk4AvE21nDONRYbm+mw1Om2wHCWUdPHTMuWsFrndxJu5x8ySbKl4E4Tbh8WZ9nVMljK/e3MRtPQfideltYqXkfK3L6+9FNoOZzXGePNcdgH/tR/8ActR2jcbijaaaA3qXDUjXugdvN55Dlv0vi+1GpMWLd4CQ5scLmkcnNJcD9Qrjsv4XNQ/7TqgXDMTEHal776zOvvrt43PILQWtDGudoMlVJ4iAr3s24ONK32upF6uQXsdTE12tr/xn5j6db7wryizOcXGSr2gNEBc77GorU9Q8/GZ3B3X3Wjf1JVdxfIcXxGLDoSTBAS6Zw2B2eb+A9weLnK3l4Lqop530VaIIag5nsMeZzHEkuMZzDck22Iv5LRcM8NwYfF3cIJc7V8jtXyO6uP5AaBWl7Q7jGf0VfCSOE5K4ijDWhrRZoAAA5ACwCyuMcGMme6VrgHEl3NpBJvo5vLzBWuRYq2Hp1m8LxPmPUQVe15aZC59//I1bdGzy28Jr/mAveLgmZ/76ZxH3pHO/ygD81vkWIdkYUGYPmftB9VYa71R4Vw1DT2IGZw5kCw8h+puVeIi6FOkymOFggKokkyUREU18REREVbj4k9nk7j96GlzB1c33gPW1vVckoHGMuEAc+nc4Pa1jh31NI29iGbktuWlwBa5uhsfh7asVxdgkOcVb42dyAXTGwzEDYgBhLidtXDkVmr0yYcNPf9rp9n4oU5pkTxexaxPK4gzoSFF4SwSjmcZXUp71tiS+B8TL9Wsc5zc3P3dPJb4BQMGnikhjdBYRZRlAFso6W5W2VgrqbQ1tljxNRz6h4ptaCSYi0XyjYWCIiKaoREREXAMUxt9HidbNEQJM8rASL5cxALh4i3Nbvsy4SMI9vqQTUSAlgdqY2O1zG/zu3J5A25lZpnDckmPOZNC7unSuqLkXY+MXcDfY+9laR4rtK01qndDRqBKopsuSUREWZXrjfanw9Uy4gyRkT3RTNjiD2guDX3Is+3w73udF12jpmxRsiYLMY0MaOgaLAfQL7opueXAA6KIaASUREUFJERERERERERERERERERERERERF6kX0K9kRF8o42tGVoAHQCw+gX1RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERf/2Q=="
doc.addImage(ur, "PNG", 20, 8,30, 30);
// Cabecera
autoTable(doc,{
      
  body:[
    [
      {
        content:`                            `,
        styles: {
          halign: 'left',
        }
      },
      {
        content:`Las Lugo\nkm 26 carretera a Masaya, Nindirí, Nicaragua\nNumero 2528 1547\n correo: lasazondelaslugo@gmail.com`,
        styles: {
          halign: 'center',
        }
      },
      {
        content:`RUC 21312312312\nBoleta de venta\nB0001 - 234`,
        styles: {
          halign: 'right',
        }
      },
    ],
  ],
  theme: 'plain',
});
  // Agregar la tabla al documento
  autoTable(doc,{
    head: [tableData[0]], // Encabezado de la tabla
    body: tableData.slice(1), // Contenido de la tabla
    styles: {
     halign: 'center'
    },
  });

  // Guardar el documento como PDF
  doc.save(`Reporte_Venta_${dia}/${mes}/${año}`);
}

reporteMateria(listaVentas: ReporteMateria[]) {
  const doc = new jsPDF();

  const fechaActual: Date = new Date();
  const dia: number = fechaActual.getDate();
  const mes: number = fechaActual.getMonth() + 1; // Los meses en JavaScript comienzan desde 0, por lo que agregamos 1
  const año: number = fechaActual.getFullYear();

  // Crear los datos de la tabla a partir de la lista de ventas

  //const totalVentas = listaVentas.reduce((sum, venta) => sum + parseInt(venta.total), 0);
  const totalCantidad = listaVentas.reduce((sum, venta) => sum + venta.cantidad, 0);

  const tableData = [
    ['Nombre','Categoria','Cantidad'],
    ...listaVentas.map(venta => [
      venta.nombre,
      venta.descripcionCategoria,
      venta.cantidad,
    ]),
    ['Total:', '',`${totalCantidad}`]
  ];

const ur = "data:image/jpeg;base64,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Ybm+mw1Om2wHCWUdPHTMuWsFrndxJu5x8ySbKl4E4Tbh8WZ9nVMljK/e3MRtPQfideltYqXkfK3L6+9FNoOZzXGePNcdgH/tR/8ActR2jcbijaaaA3qXDUjXugdvN55Dlv0vi+1GpMWLd4CQ5scLmkcnNJcD9Qrjsv4XNQ/7TqgXDMTEHal776zOvvrt43PILQWtDGudoMlVJ4iAr3s24ONK32upF6uQXsdTE12tr/xn5j6db7wryizOcXGSr2gNEBc77GorU9Q8/GZ3B3X3Wjf1JVdxfIcXxGLDoSTBAS6Zw2B2eb+A9weLnK3l4Lqop530VaIIag5nsMeZzHEkuMZzDck22Iv5LRcM8NwYfF3cIJc7V8jtXyO6uP5AaBWl7Q7jGf0VfCSOE5K4ijDWhrRZoAAA5ACwCyuMcGMme6VrgHEl3NpBJvo5vLzBWuRYq2Hp1m8LxPmPUQVe15aZC59//I1bdGzy28Jr/mAveLgmZ/76ZxH3pHO/ygD81vkWIdkYUGYPmftB9VYa71R4Vw1DT2IGZw5kCw8h+puVeIi6FOkymOFggKokkyUREU18REREVbj4k9nk7j96GlzB1c33gPW1vVckoHGMuEAc+nc4Pa1jh31NI29iGbktuWlwBa5uhsfh7asVxdgkOcVb42dyAXTGwzEDYgBhLidtXDkVmr0yYcNPf9rp9n4oU5pkTxexaxPK4gzoSFF4SwSjmcZXUp71tiS+B8TL9Wsc5zc3P3dPJb4BQMGnikhjdBYRZRlAFso6W5W2VgrqbQ1tljxNRz6h4ptaCSYi0XyjYWCIiKaoREREXAMUxt9HidbNEQJM8rASL5cxALh4i3Nbvsy4SMI9vqQTUSAlgdqY2O1zG/zu3J5A25lZpnDckmPOZNC7unSuqLkXY+MXcDfY+9laR4rtK01qndDRqBKopsuSUREWZXrjfanw9Uy4gyRkT3RTNjiD2guDX3Is+3w73udF12jpmxRsiYLMY0MaOgaLAfQL7opueXAA6KIaASUREUFJERERERERERERERERERERERERF6kX0K9kRF8o42tGVoAHQCw+gX1RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERf/2Q=="
doc.addImage(ur, "PNG", 20, 8,30, 30);
// Cabecera
autoTable(doc,{
      
  body:[
    [
      {
        content:`                            `,
        styles: {
          halign: 'left',
        }
      },
      {
        content:`Las Lugo\nkm 26 carretera a Masaya, Nindirí, Nicaragua\nNumero 2528 1547\n correo: lasazondelaslugo@gmail.com`,
        styles: {
          halign: 'center',
        }
      },
      {
        content:`RUC 21312312312\nBoleta de venta\nB0001 - 234`,
        styles: {
          halign: 'right',
        }
      },
    ],
  ],
  theme: 'plain',
});
  // Agregar la tabla al documento
  autoTable(doc,{
    head: [tableData[0]], // Encabezado de la tabla
    body: tableData.slice(1), // Contenido de la tabla
    styles: {
     halign: 'center'
    },
  });

  // Guardar el documento como PDF
  doc.save(`Reporte_Materia_Prima_${dia}/${mes}/${año}`);
}

}
