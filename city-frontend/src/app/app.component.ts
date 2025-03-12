import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CitiesComponent } from './cities/cities.component';
import { CityHeaderComponent } from './cities/components/city-header/city-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CitiesComponent, CityHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent { }
