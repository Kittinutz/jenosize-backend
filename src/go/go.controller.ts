import { Controller, Get, Param, Res } from '@nestjs/common';
import { GoService } from './go.service';
import type { Response } from 'express';
import { ClickEventsProducer } from 'src/click-events/click-events.producer';

@Controller('go')
export class GoController {
  constructor(
    private readonly goService: GoService,
    private clickEventsProducer: ClickEventsProducer,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response<void>) {
    await this.clickEventsProducer.addClickEvent(id);
    const url = await this.goService.findOne(id);

    return res.redirect(url);
  }
}
