import { existsSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';


@Injectable()
export class FilesService {
  
    getStaticCategoryImage( imageName: string ) {

        const path = join( __dirname, '../../static/category', imageName );

        if ( !existsSync(path) ) 
            throw new BadRequestException(`No category found with image ${ imageName }`);

        return path;
    }


}
