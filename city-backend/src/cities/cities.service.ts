import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { cities } from './cities.entity';
import { City } from './city.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { SearchCitiesDTO } from './dto/search-cities.dto';

@Injectable()
export class CitiesService {
    private readonly logger = new Logger(CitiesService.name);
    private cities: City[] = cities;

    constructor(
        @InjectModel(City.name) private cityModel: Model<City>
    ) { }

    async getAllCities(data: SearchCitiesDTO): Promise<{ data: City[], totalRecords: number }> {
        try {
            if (!Number(data?.page) || !Number(data?.limit)) {
                throw new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST);
            }
            const searchTerm = data?.term || '';
            const page = Number(data?.page) || 1;
            const limit = Number(data?.limit) || 5;
            const skip = (page - 1) * limit;
            const cities = this.cities;
            const dataCountInDB = await this.cityModel.countDocuments();
            if (dataCountInDB == 0) {
                await this.insertCitiesIntoDB(cities);
            }
            const searchQuery = searchTerm
                ? { $text: { $search: searchTerm } } // full text search search
                : {};
            const citiesDataFromDB = await this.cityModel.find(searchQuery).skip(skip).limit(limit);

            const totalCities = await this.cityModel.countDocuments(searchQuery); // Get total count
            return { data: citiesDataFromDB, totalRecords: totalCities };
        } catch (error) {
            this.logger.error(`Error getting cities data: ${error.message}`);

            throw error instanceof HttpException ? error : new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async insertCitiesIntoDB(cities: City[]): Promise<City[]> {
        try {
            const citiesWithImage = await Promise.all(cities.map(async (city) => {
                const imgURL = await this.getImageURL(city.name);
                return { ...city, imgURL };
            }));
            const dataInserted = await this.cityModel.create(citiesWithImage);
            return dataInserted;
        } catch (error) {
            this.logger.error(`Error inserting cities data: ${error.message}`);

            throw error instanceof HttpException ? error : new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getImageURL(name: string) {
        try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${name}`;

            const result = await axios.get(url);
            console.log('url', result.data?.thumbnail?.source);
            return result.data?.thumbnail?.source;
        } catch (error) {
            this.logger.error(`Error getting city image url: ${error.message}`);

            throw error instanceof HttpException ? error : new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
