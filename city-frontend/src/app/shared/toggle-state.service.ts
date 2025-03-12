import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root', // Provided at the root level for singleton behavior
})
export class ToggleStateService {
    // BehaviorSubject to store the toggle value
    private toggleValueSubject = new BehaviorSubject<string>('card'); // Default value

    // Expose the value as an observable
    toggleValue$ = this.toggleValueSubject.asObservable();

    // Method to update the toggle value
    setToggleValue(value: string) {
        this.toggleValueSubject.next(value);
    }

    // Method to get the current toggle value
    getToggleValue(): string {
        return this.toggleValueSubject.value;
    }
}