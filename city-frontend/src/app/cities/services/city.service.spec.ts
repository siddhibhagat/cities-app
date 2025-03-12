import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'; // New import
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { CityService } from './city.service';

describe('CityService', () => {
  let service: CityService;
  let httpMock: HttpTestingController;

  // Sample mock data
  const mockCitiesResponse = {
    data: [
      {
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
      }
    ],
    totalRecords: 2
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CityService,
        provideHttpClient(), // Provide HttpClient
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to getAllCities()', () => {
    const queryParams = { term: 'Sydney', page: 1, limit: 5 };

    // Call the method
    service.getAllCities(queryParams).subscribe();

    // Expect the request to be made to the correct URL with correct params
    const req = httpMock.expectOne((request) => {
      // Check if the URL matches and the query parameters are correct
      return request.url === 'http://localhost:4000/api/cities/search' &&
        request.params.get('term') === 'Sydney' &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '5';
    });
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('term')).toBeTrue();
    expect(req.request.params.has('page')).toBeTrue();
    expect(req.request.params.has('limit')).toBeTrue();
  });

  it('should return expected cities when calling getAllCities()', () => {
    const queryParams = { term: '', page: 1, limit: 5 };

    service.getAllCities(queryParams).subscribe((response) => {
      expect(response).toEqual(mockCitiesResponse);
      expect(response.data.length).toBe(2);
      expect(response.totalRecords).toBe(2);
    });

    const req = httpMock.expectOne((request) => {
      // Check if the URL matches and the query parameters are correct
      return request.url === 'http://localhost:4000/api/cities/search' &&
        request.params.get('term') === '' &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '5';
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockCitiesResponse); // Return mock response
  });

  it('should handle HTTP errors gracefully in getAllCities()', () => {
    const queryParams = { term: '', page: 1, limit: 5 };

    // Simulate an error scenario by sending a mock error response
    service.getAllCities(queryParams).subscribe({
      next: () => fail('should have failed with an error'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne((request) => {
      // Check if the URL matches and the query parameters are correct
      return request.url === 'http://localhost:4000/api/cities/search' &&
        request.params.get('term') === '' &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '5';
    });
    req.flush('Something went wrong', { status: 500, statusText: 'Internal Server Error' });
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests remain after each test
  });
});
