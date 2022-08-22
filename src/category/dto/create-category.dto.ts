import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @MinLength(3)
	CDescription: string;

    @IsString()
    @IsOptional()
	CPhoto?: string;

    @IsOptional()
	CSlug?: string;

}
