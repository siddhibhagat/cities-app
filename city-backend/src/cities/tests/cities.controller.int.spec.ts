import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from '../cities.controller';
import { CitiesService } from '../cities.service';
import { City } from '../schemas/city.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('CitiesController (Integration)', () => {
    let app: INestApplication;
    let citiesService: CitiesService;
    let cityModel: Model<City>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [CitiesController],
            providers: [
                CitiesService,
                {
                    provide: getModelToken('City'),
                    useValue: Model, // Mock the Mongoose model if needed, or use a real database for testing
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        citiesService = moduleFixture.get<CitiesService>(CitiesService);
        cityModel = moduleFixture.get<Model<City>>(getModelToken('City'));
    });

    afterAll(async () => {
        await app.close();
    });

    it('should return a list of cities and total records', async () => {
        // Mock the service method or use an actual database for integration testing
        jest.spyOn(citiesService, 'getAllCities').mockResolvedValue({
            data: [{
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
            }],
            totalRecords: 1,
        });

        const response = await request(app.getHttpServer())
            .get('/api/cities/search')
            .query({ page: 1, limit: 10, term: '' })
            .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.totalRecords).toBe(1);
        expect(response.body.data[0].name).toBe('Sydney');
    });
});
