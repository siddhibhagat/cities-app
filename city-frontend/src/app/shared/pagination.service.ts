import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PaginationService {
    private currentPageSubject = new BehaviorSubject<number>(0);  // Default to 0 for first page
    private pageSizeSubject = new BehaviorSubject<number>(5); // Default page size 5

    currentPage$ = this.currentPageSubject.asObservable();
    pageSize$ = this.pageSizeSubject.asObservable();

    setCurrentPage(page: number) {
        this.currentPageSubject.next(page);
    }

    setPageSize(size: number) {
        this.pageSizeSubject.next(size);
    }

    get currentPage(): number {
        return this.currentPageSubject.value;
    }

    get pageSize(): number {
        return this.pageSizeSubject.value;
    }
}
