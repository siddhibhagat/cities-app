import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchCitiesDTO {
    @IsOptional()
    @IsString()
    term: string;

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    limit: number;
}