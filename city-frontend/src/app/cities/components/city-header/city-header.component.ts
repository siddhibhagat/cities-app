import { Component, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToggleStateService } from '../../../shared/toggle-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city-header',
  imports: [MatButtonToggleModule],
  templateUrl: './city-header.component.html',
  styleUrl: './city-header.component.scss'
})
export class CityHeaderComponent implements OnInit {
  viewMode: string = '';
  constructor(
    private toggleStateService: ToggleStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to the toggle value changes
    this.toggleStateService.toggleValue$.subscribe((value) => {
      this.viewMode = value;
    });
  }

  // Method to handle toggle change
  onToggleChange(value: string) {
    this.toggleStateService.setToggleValue(value);
    // this.router.navigate(['/cities', this.viewMode]);
  }
}
