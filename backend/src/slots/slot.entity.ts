import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../rooms/room.entity';

export enum SlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
}

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.slots, { eager: true })
  room: Room;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column()
  durationMinutes: number;

  @Column({ type: 'enum', enum: SlotStatus, default: SlotStatus.AVAILABLE })
  status: SlotStatus;

  @Column({ type: 'varchar', nullable: true })
  bookedByName: string | null;

  @Column({ type: 'varchar', nullable: true })
  bookedByEmail: string | null;

  @Column({ type: 'text', nullable: true })
  bookingPurpose: string | null;
}