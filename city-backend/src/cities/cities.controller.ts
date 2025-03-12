import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { City } from './city.model';
import { CitiesService } from './cities.service';
import { SearchCitiesDTO } from './dto/search-cities.dto';

@Controller('api/cities')
export class CitiesController {
    private readonly logger = new Logger(CitiesController.name);
    constructor(
        private citiesService: CitiesService
    ) { }

    @Get('search')
    async getAllCities(@Query() params: SearchCitiesDTO): Promise<{ data: City[], totalRecords: number }> {
        try {
            const result = await this.citiesService.getAllCities(params);
            return result;
        } catch (error) {
            this.logger.error(`Error getting cities data: ${error.message}`);

            throw error instanceof HttpException ? error : new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Post('insert')
    async insertData(@Body() body): Promise<City[]> {
        try {
            const cities = body?.cities;
            const result = await this.citiesService.insertCitiesIntoDB(cities);
            return result;
        } catch (error) {
            this.logger.error(`Error while inserting cities data: ${error.message}`);

            throw error instanceof HttpException ? error : new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
