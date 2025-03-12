import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CityHeaderComponent } from './city-header.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ToggleStateService } from '../../../shared/toggle-state.service';

class MockToggleStateService {
  toggleValue$ = of('card'); // Mock default value
  setToggleValue(value: string) { }
}

describe('CityHeaderComponent', () => {
  let component: CityHeaderComponent;
  let fixture: ComponentFixture<CityHeaderComponent>;
  let toggleStateService: MockToggleStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityHeaderComponent],
      providers: [
        { provide: ToggleStateService, useClass: MockToggleStateService },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CityHeaderComponent);
    component = fixture.componentInstance;
    toggleStateService = TestBed.inject(ToggleStateService);
    fixture.detectChanges();
  });

  it('should create city header component', () => {
    expect(component).toBeTruthy();
  });

  it('should set viewMode on initialization', () => {
    expect(component.viewMode).toBe('card');
  });

  it('should update toggle state on change', fakeAsync(() => {
    const setToggleSpy = spyOn(toggleStateService, 'setToggleValue')

    component.onToggleChange('table');

    expect(setToggleSpy).toHaveBeenCalledWith('table');
  }));
});
