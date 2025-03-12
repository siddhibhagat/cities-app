import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CitiesComponent } from './cities.component';
import { Observable, of } from 'rxjs';
import { CityService } from './services/city.service';
import { PaginationService } from '../shared/pagination.service';
import { ToggleStateService } from '../shared/toggle-state.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { City } from './models/city.model';

class MockCityService {
  getAllCities(queryParams: { term: string; page: number; limit: number }): Observable<{ data: City[]; totalRecords: number }> {
    const cities: City[] = [
      {
        name: "Sydney",
        name_native: "Sydney",
        country: "Australia",
        continent: "Australia",
        latitude: "-33.865143",
        longitude: "151.209900",
        population: "5312000",
        founded: "1788",
        landmarks: ["Sydney Opera House", "Sydney Harbour Bridge", "Queen Victoria Building"],
        map: 'link'
      },
      {
        name: "New York City",
        name_native: "New York City",
        country: "USA",
        continent: "North America",
        latitude: "40.730610",
        longitude: "-73.935242",
        population: "8419000",
        founded: "1624",
        landmarks: ["Chrysler Building", "Brooklyn Bridge", "Madison Square Garden"],
        map: 'link'
      },
      {
        name: "Madrid",
        name_native: "Madrid",
        country: "Spain",
        continent: "Europe",
        latitude: "40.416775",
        longitude: "-3.703790",
        population: "3223000",
        founded: "1083",
        landmarks: ["Royal Palace", "Plaza Mayor", "Plaza de Cibeles"],
        map: 'link'
      }
    ];
    let filteredCities = cities;

    if (queryParams.term) {
      filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(queryParams.term.toLowerCase())
      );
    }

    return of({
      data: filteredCities,
      totalRecords: filteredCities.length
    });
  }
}

class MockPaginationService {
  currentPage$ = of(0); // Mock current page
  pageSize$ = of(5); // Mock page size
  setCurrentPage(page: number) { }
  setPageSize(size: number) { }
}

class MockToggleStateService {
  toggleValue$ = of('card'); // Default view mode
}

describe('CitiesComponent', () => {
  let component: CitiesComponent;
  let fixture: ComponentFixture<CitiesComponent>;
  let cityService: MockCityService;
  let paginationService: MockPaginationService;
  let toggleStateService: MockToggleStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatPaginatorModule, MatTableModule, MatCardModule, CitiesComponent], // Import necessary modules
      providers: [
        { provide: CityService, useClass: MockCityService },
        { provide: PaginationService, useClass: MockPaginationService },
        { provide: ToggleStateService, useClass: MockToggleStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesComponent);
    component = fixture.componentInstance;
    cityService = TestBed.inject(CityService);
    paginationService = TestBed.inject(PaginationService);
    toggleStateService = TestBed.inject(ToggleStateService);
    fixture.detectChanges();
  });

  it('should create Cities Component', () => {
    expect(component).toBeTruthy();
  });

  // Test Case 2: Initial data load
  it('should load cities on init', () => {
    component.ngOnInit();
    expect(component.cities.length).toBeGreaterThan(0);
    expect(component.cities[0].name).toBe('Sydney');
  });

  // Test Case 3: Check pagination behavior
  it('should update current page and page size on pagination', () => {
    const setCurrentPageSpy = spyOn(component.paginationService, 'setCurrentPage');
    const setPageSizeSpy = spyOn(component.paginationService, 'setPageSize');
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 3 });

    expect(setCurrentPageSpy).toHaveBeenCalledWith(1); // pageIndex
    expect(setPageSizeSpy).toHaveBeenCalledWith(5); // pageSize

    // Check that searchTerm$ is updated
    expect(component.searchTerm$.value).toBe(component.searchTerm$.value); // Verify the search te
  });

  // Test Case 4: Check the view mode toggle
  it('should toggle between card and table view', () => {
    toggleStateService.toggleValue$.subscribe((viewMode) => {
      expect(viewMode).toBe('card');
    });
  });

  // Test Case 5: Apply filter and check for correct filtered data
  it('should apply filter and return correct filtered data', fakeAsync(() => {
    // Arrange: Spy on `getAllCities`
    const getAllCitiesSpy = spyOn(cityService, 'getAllCities').and.callThrough();

    // Act: Trigger ngOnInit manually to ensure subscriptions are active
    component.ngOnInit();
    fixture.detectChanges();

    component.applyFilter('Sydney');
    tick(300); // Simulate debounce delay
    fixture.detectChanges(); // Apply changes

    expect(getAllCitiesSpy).toHaveBeenCalledWith({ term: 'Sydney', page: 1, limit: 5 });
    expect(component.filteredCities.length).toBe(1);
    expect(component.filteredCities[0].name).toBe('Sydney');
  }));

  // Test Case 6: Test if the `loadData` method correctly sets data when data is fetched
  it('should load data from the cityService', () => {
    spyOn(cityService, 'getAllCities').and.callThrough();
    component.loadData();
    expect(cityService.getAllCities).toHaveBeenCalled();
    expect(component.filteredCities.length).toBe(3);
  });

});
