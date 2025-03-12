import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityCardComponent } from './city-card.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

describe('CityCardComponent', () => {
  let component: CityCardComponent;
  let fixture: ComponentFixture<CityCardComponent>;
  const mockCity = {
    name: "Sydney",
    name_native: "Sydney",
    country: "Australia",
    continent: "Australia",
    latitude: "-33.865143",
    longitude: "151.209900",
    population: "5312000",
    founded: "1788",
    landmarks: [
      "Sydney Opera House",
      "Sydney Harbour Bridge",
      "Queen Victoria Building"
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CityCardComponent);
    component = fixture.componentInstance;
    component.city = mockCity;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display city details correctly', () => {
    // get access to the root DOM element of the component being tested
    const cardElement = fixture.debugElement.nativeElement;

    expect(cardElement.textContent).toContain(mockCity.name);
    expect(cardElement.textContent).toContain(mockCity.country);
    expect(cardElement.textContent).toContain(mockCity.continent);
    expect(cardElement.textContent).toContain(Number(mockCity.population).toLocaleString());
    mockCity.landmarks.forEach(landmark => {
      expect(cardElement.textContent).toContain(landmark);
    });
  });

  it('should generate the correct Google Maps URL', () => {
    const expectedUrl = `https://www.google.com/maps?q=${parseFloat(mockCity.latitude)},${parseFloat(mockCity.longitude)}`;
    expect(component.getGoogleMapsUrl(parseFloat(mockCity.latitude), parseFloat(mockCity.longitude))).toBe(expectedUrl);
  });

  it('should open Google Maps in a new tab when "View on Map" is clicked', () => {
    spyOn(window, 'open');

    // Query the button using debugElement to ensure it's properly selected
    const button = fixture.debugElement.nativeElement.querySelector('button');

    expect(button).toBeTruthy(); // Ensure the button exists

    // Simulate the click event
    button.click();

    fixture.detectChanges();

    expect(window.open).toHaveBeenCalledWith(
      `https://www.google.com/maps?q=${mockCity.latitude},${mockCity.longitude}`,
      '_blank'
    );
  });
});
