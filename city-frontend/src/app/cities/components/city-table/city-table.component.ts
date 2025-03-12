import { Component, Input, ViewChild } from '@angular/core';
import { City } from '../../models/city.model';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-city-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CommonModule],
  templateUrl: './city-table.component.html',
  styleUrl: './city-table.component.scss'
})
export class CityTableComponent {
  @Input() set cities(value: City[]) {
    this.dataSource.data = value; // Update the table data when cities change
  }
  // Define the columns to display
  displayedColumns: string[] = ['name', 'country', 'continent', 'population', 'founded', 'landmarks', 'map']; // Add column names here

  // DataSource for the table
  dataSource = new MatTableDataSource<City>();

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
