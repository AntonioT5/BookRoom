import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './rooms/room.entity';
import { Slot } from './slots/slot.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Room) private rooms: Repository<Room>,
    @InjectRepository(Slot) private slots: Repository<Slot>,
  ) {}

  async onApplicationBootstrap() {
    if ((await this.rooms.count()) > 0) return;

    const rooms = await this.rooms.save([
      {
        name: 'Aurora',
        description: 'Bright meeting room for small team syncs and interviews.',
        capacity: 6,
        tables: 1,
        equipment: ['TV screen', 'Whiteboard', 'Video conferencing'],
      },
      {
        name: 'Nebula',
        description: 'Spacious workshop room with flexible seating.',
        capacity: 12,
        tables: 3,
        equipment: ['Projector', 'Whiteboard', 'Sound system'],
      },
      {
        name: 'Quasar',
        description: 'Quiet focus room for calls and deep work.',
        capacity: 4,
        tables: 1,
        equipment: ['Monitor', 'Phone booth acoustics'],
      },
    ]);

    const times = ['09:00', '11:00', '13:00', '15:00', '17:00'];
    for (const room of rooms) {
      for (let i = 0; i < 5; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        await this.slots.save({
          room,
          date: d.toISOString().slice(0, 10),
          startTime: times[(i + room.id) % times.length],
          durationMinutes: 60,
        });
      }
    }
  }
}
