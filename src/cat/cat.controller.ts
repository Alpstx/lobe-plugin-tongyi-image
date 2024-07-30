import { Controller, Get } from '@nestjs/common';

@Controller('cat')
export class CatController {

    @Get()
    getHello(): string {
        return 'Hello Cat!';
    }
}
