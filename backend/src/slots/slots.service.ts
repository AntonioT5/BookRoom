import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookSlotDto } from './book-slot.dto';
import { Slot, SlotStatus } from './slot.entity';

@Injectable()
export class SlotsService {
  constructor(@InjectRepository(Slot) private slots: Repository<Slot>) {}

  findAvailable() {
    return this.slots.find({
      where: { status: SlotStatus.AVAILABLE },
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async book(id: number, dto: BookSlotDto) {
    const result = await this.slots
      .createQueryBuilder()
      .update(Slot)
      .set({
        status: SlotStatus.BOOKED,
        bookedByName: dto.name,
        bookedByEmail: dto.email,
        bookingPurpose: dto.purpose,
      })
      .where('id = :id AND status = :available', {
        id,
        available: SlotStatus.AVAILABLE,
      })
      .execute();

    if (result.affected === 0) {
      await this.getOrThrow(id);
      throw new ConflictException('This slot has just been booked by someone else.');
    }
    return this.getOrThrow(id);
  }

  async cancel(id: number) {
    const result = await this.slots
      .createQueryBuilder()
      .update(Slot)
      .set({
        status: SlotStatus.AVAILABLE,
        bookedByName: null,
        bookedByEmail: null,
        bookingPurpose: null,
      })
      .where('id = :id AND status = :booked', {
        id,
        booked: SlotStatus.BOOKED,
      })
      .execute();

    if (result.affected === 0) {
      await this.getOrThrow(id);
      throw new ConflictException('This slot is not booked.');
    }
    return this.getOrThrow(id);
  }

  private async getOrThrow(id: number) {
    const slot = await this.slots.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('Slot not found');
    return slot;
  }
}