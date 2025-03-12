import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from '../cities.controller';
import { CitiesService } from '../cities.service';

// Mock service
const mockCitiesService = {
  getAllCities: jest.fn(),
};

describe('CitiesController (Unit)', () => {
  let controller: CitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [{ provide: CitiesService, useValue: mockCitiesService }],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('should call getAllCities() in service and return data', async () => {
    const mockResponse = { data: [{ name: 'New York' }], totalRecords: 1 };
    mockCitiesService.getAllCities.mockResolvedValue(mockResponse);

    const result = await controller.getAllCities({ term: '', page: 1, limit: 5 });

    expect(mockCitiesService.getAllCities).toHaveBeenCalledWith({ term: '', page: 1, limit: 5 });
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors and throw an exception', async () => {
    mockCitiesService.getAllCities.mockRejectedValue(new Error('Database error'));

    await expect(controller.getAllCities({ term: '', page: 1, limit: 5 })).rejects.toThrow(
      'Internal Server Error'
    );
  });
});
