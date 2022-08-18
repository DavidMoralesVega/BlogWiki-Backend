import { IsOptional, IsString, MinLength } from "class-validator";

export class CreatePostDto {

    @IsString()
    @MinLength(3)
    PTitle: string;

    @IsString()
    PSummary: string;

    @IsString()
    PDescription: string;

    @IsString()
    PPlace: string;

    @IsString()
    @IsOptional()
    PPhoto?: string;

    @IsString()
    PRegisterDateTime: string;

    @IsString()
    IdCategory: string;

}
