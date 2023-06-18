import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Componentes de angular material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';

import { LayoutModule } from '@angular/cdk/layout'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatListModule } from '@angular/material/list'; 

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatDatepickerModule } from '@angular/material/datepicker'; 

import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule
  ],
  providers:[
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SharedModule { }
