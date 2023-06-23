import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inicio',
  templateUrl: './iniciolugo.component.html',
  styleUrls: ['./iniciolugo.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

  constructor() { }
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
  }
}
