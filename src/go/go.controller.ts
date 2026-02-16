import { Controller, Get, Param, Res } from '@nestjs/common';
import { GoService } from './go.service';
import type { Response } from 'express';

@Controller('go')
export class GoController {
  constructor(private readonly goService: GoService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response<void>) {
    const url = await this.goService.findOne(id);

    return res.redirect(url);
  }
}
