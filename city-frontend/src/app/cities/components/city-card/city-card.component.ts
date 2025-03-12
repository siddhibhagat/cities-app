import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardAppearance, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { City } from '../../models/city.model';

@Component({
  selector: 'app-city-card',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss'
})
export class CityCardComponent {
  @Input() city: any;

  // Method to generate Google Maps URL
  getGoogleMapsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  // Method to handle "View on Map" button click
  onViewOnMap() {
    const url = this.getGoogleMapsUrl(this.city.latitude, this.city.longitude);
    window.open(url, '_blank'); // Open in a new tab
  }
}
