import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CityTableComponent } from './city-table.component';
import { City } from '../../models/city.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { By } from '@angular/platform-browser';

describe('CityTableComponent', () => {
  let component: CityTableComponent;
  let fixture: ComponentFixture<CityTableComponent>;

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
    }]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityTableComponent, MatTableModule, MatPaginatorModule, MatSortModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of rows', () => {
    component.cities = cities; // Set cities input
    fixture.detectChanges(); // Trigger change detection to render the view

    expect(component.dataSource.data.length).toBe(cities.length);
    const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(cities.length); // Ensure number of rows matches the number of cities
  });

  it('should display correct columns', () => {
    component.cities = cities; // Set cities input
    fixture.detectChanges(); // Trigger change detection to render the view

    // Check that the table columns match the displayedColumns property
    const columnNames = fixture.nativeElement.querySelectorAll('th.mat-mdc-header-cell');
    const headerTexts = Array.from(columnNames).map((col: any) => col.textContent.trim());

    expect(headerTexts).toEqual([
      'City Name',
      'Country',
      'Continent',
      'Population',
      'Founded',
      'Landmarks',
      'View on Map',
    ]);
  });
});
