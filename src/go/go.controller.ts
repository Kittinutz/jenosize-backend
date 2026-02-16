import { Controller, Get, Param, Res } from '@nestjs/common';
import { GoService } from './go.service';

@Controller('go')
export class GoController {
  constructor(private readonly goService: GoService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    console.log(id + ' is the id');
    const url = await this.goService.findOne(id);
    console.log({
      url,
    });
    return res.redirect(url);
  }
}
