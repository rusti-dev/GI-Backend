import { Type } from "class-transformer";
import { ORDER, ORDER_ENUM } from "../constants/order";
import { IsEnum, IsOptional, IsPositive, IsString, Min } from "class-validator";



export class QueryDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @IsOptional()
    @IsEnum(ORDER_ENUM)
    order?: ORDER;

    @IsString()
    @IsOptional()
    attr?: string;

    @IsOptional()
    value?: string;
}
