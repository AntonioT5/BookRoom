import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Room } from './rooms/room.entity';
import { Slot } from './slots/slot.entity';
import { SeedService } from './seed.service';
import { SlotsModule } from './slots/slots.module';
import { AiService } from './ai/ai.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Room, Slot],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Room, Slot]),
    SlotsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, AiService],
})
export class AppModule {}
