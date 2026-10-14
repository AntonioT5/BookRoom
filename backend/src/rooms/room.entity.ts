import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Slot } from '../slots/slot.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  capacity: number;

  @Column()
  tables: number;

  @Column('simple-array')
  equipment: string[];

  @OneToMany(() => Slot, (slot) => slot.room)
  slots: Slot[];
}