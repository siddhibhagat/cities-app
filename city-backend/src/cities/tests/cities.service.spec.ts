import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from '../cities.service';
import { getModelToken } from '@nestjs/mongoose';
import { City } from '../schemas/city.schema'
import { cities } from '../cities.entity';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CitiesService', () => {
  let service: CitiesService;
  let cityModelMock: any;

  beforeEach(async () => {
    cityModelMock = {
      find: jest.fn(),
      countDocuments: jest.fn(),
      create: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getModelToken(City.name),
          useValue: cityModelMock
        }
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all cities if no filter is passed', async () => {
    const mockCities = cities;

    cityModelMock.countDocuments.mockResolvedValue(8);
    const findMock = jest.fn().mockReturnThis();  // This is necessary to chain skip/limit
    cityModelMock.find.mockReturnValue({
      skip: findMock.mockReturnThis(),  // Mock skip to allow chaining
      limit: jest.fn().mockReturnValue(mockCities.slice(0, 5)),  // Mock limit to return the actual cities data
    });
    cityModelMock.countDocuments.mockResolvedValue(5);
    const result = await service.getAllCities({ term: '', page: 1, limit: 5 });
    expect(result).toStrictEqual({ data: mockCities.slice(0, 5), totalRecords: 5 });
  })

  it('should return filtered cities', async () => {
    const mockCities = cities;

    cityModelMock.countDocuments.mockResolvedValue(8);
    const findMock = jest.fn().mockReturnThis();  // This is necessary to chain skip/limit
    cityModelMock.find.mockReturnValue({
      skip: findMock.mockReturnThis(),  // Mock skip to allow chaining
      limit: jest.fn().mockReturnValue(mockCities.filter((city) => city.name === 'Sydney')),  // Mock limit to return the filtered cities data
    });
    cityModelMock.countDocuments.mockResolvedValue(1);
    const result = await service.getAllCities({ term: '', page: 1, limit: 5 });
    expect(result).toStrictEqual({ data: mockCities.filter((city) => city.name === 'Sydney'), totalRecords: 1 });
  })

  it('should insert cities into DB with image URLs when no data exists', async () => {
    // first call will resolve to 0 and second call to 5
    cityModelMock.countDocuments.mockResolvedValueOnce(0).mockResolvedValueOnce(5);


    jest.spyOn(service, 'getImageURL').mockImplementation(async (name) => `https://mock-url.com/${name}`);

    const mockCitiesDocuments = cities.map(city => ({
      ...city,
      imgURL: `https://mock-url.com/${city.name}`, // Add the image URL
      _id: new Types.ObjectId(), // Mock ObjectId
      __v: 0 // Mock version key
    })) as any;

    const createSpy = jest.spyOn(cityModelMock, 'create').mockResolvedValue(mockCitiesDocuments);

    const findMock = jest.fn().mockReturnThis();
    cityModelMock.find.mockReturnValue({
      skip: findMock.mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCitiesDocuments),
    });

    await service.getAllCities({ term: '', page: 1, limit: 5 });

    expect(createSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ imgURL: expect.any(String) }),
      ])
    );
  });

  it('should throw BadRequestException when page or limit are invalid', async () => {
    const invalidData = [
      { page: 'invalid', limit: 1, term: '' }, // Invalid page
      { page: 1, limit: 'invalid', term: 'Sydney' }, // Invalid limit
      { page: 'invalid', limit: 'invalid', term: '' }, // Both invalid
    ];

    for (const data of invalidData) {
      const page = Number(data.page);
      const limit = Number(data.limit);
      await expect(service.getAllCities({page, limit, term: data.term})).rejects.toThrow(
        new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST)
      );
    }
  });
});
