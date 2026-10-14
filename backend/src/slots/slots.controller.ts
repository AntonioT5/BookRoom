import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BookSlotDto } from './book-slot.dto';
import { SlotsService } from './slots.service';
import { AiService } from '../ai/ai.service';

@Controller('slots')
export class SlotsController {
  constructor(private slotsService: SlotsService, private aiService: AiService,) {}

  @Get()
  findAvailable() {
    return this.slotsService.findAvailable();
  }

  @Post(':id/book')
  async book(@Param('id', ParseIntPipe) id: number, @Body() dto: BookSlotDto) {
    const slot = await this.slotsService.book(id, dto);
    const message = await this.aiService.confirmationMessage(slot);
    return { slot, message };
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.slotsService.cancel(id);
  }
}