import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from './models/city.model';
import { CityService } from './services/city.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { CityCardComponent } from './components/city-card/city-card.component';
import { CityTableComponent } from './components/city-table/city-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToggleStateService } from '../shared/toggle-state.service';
import { BehaviorSubject, catchError, debounceTime, switchMap } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationService } from '../shared/pagination.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cities',
  imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    CommonModule,
    CityCardComponent,
    CityTableComponent,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent implements OnInit {
  cities: City[] = [];
  filteredCities: City[] = [];
  totalCities = 0;
  pageSize = 5;
  currentPage = 0;
  searchTerm$ = new BehaviorSubject<string>('');  // Observable for search term
  viewMode: string = '';

  constructor(
    private cityService: CityService,
    private toggleStateService: ToggleStateService,
    public paginationService: PaginationService,
    // private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadData();
    // this.route.params.subscribe(params => {
    //   console.log('params', params);
    //   this.toggleStateService.setToggleValue(params['viewMode']);
    // });

    // Subscribe to the toggle value changes
    this.toggleStateService.toggleValue$.subscribe((value) => {
      this.viewMode = value;
    });

    // Subscribe to pagination changes
    this.paginationService.currentPage$.subscribe(page => {
      this.currentPage = page;
    });

    this.paginationService.pageSize$.subscribe(size => {
      this.pageSize = size;
    });

    // Subscribe to the search term observable to trigger filtering
    this.searchTerm$.pipe(
      debounceTime(300), // Wait for 300ms after the user stops typing
      switchMap((term) => {
        return this.cityService.getAllCities({ term, page: this.currentPage + 1, limit: this.pageSize }).pipe(
          catchError(err => {
            console.error('Error fetching cities:', err);
            return [];  // Handle error and return an empty array
          })
        );
      })
    ).subscribe((response) => {
      this.filteredCities = response.data;
      this.totalCities = response.totalRecords;
    });
  }

  loadData() {
    this.cityService.getAllCities({ term: '', page: this.currentPage + 1, limit: this.pageSize }).subscribe({
      next: (response) => {
        this.cities = response.data; // Assign the data to `this.cities`
        this.filteredCities = response.data;
      },
      error: (err) => {
        console.error('Error fetching cities:', err);
      },
    });

  }

  // Update the search term and trigger filter
  applyFilter(filterValue: string): void {
    this.paginationService.setCurrentPage(0);
    this.searchTerm$.next(filterValue);  // This will trigger the debounced search
  }

  onPageChange(event: PageEvent) {
    this.paginationService.setCurrentPage(event.pageIndex); // Update the current page
    this.paginationService.setPageSize(event.pageSize); // Update the page size
    this.searchTerm$.next(this.searchTerm$.value); // Keep current search term
  }
}
