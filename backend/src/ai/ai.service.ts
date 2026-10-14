import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { Slot } from '../slots/slot.entity';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private client: GoogleGenAI | null;
  private model: string;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('GEMINI_API_KEY');
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
    this.model = config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash';
  }

  async confirmationMessage(slot: Slot): Promise<string> {
    const time = slot.startTime.slice(0, 5);
    const fallback = `Hi ${slot.bookedByName}, your booking for ${slot.room.name} on ${slot.date} at ${time} is confirmed!`;

    if (!this.client) return fallback;

    const prompt = `Write a short, warm, unique booking confirmation (2-3 sentences, max 60 words)
                    for a room booking app. Mention the person's name, the room, the date and time,
                    and tie it to their purpose in a friendly, personal way. No emojis, no markdown.

                    Name: ${slot.bookedByName}
                    Room: ${slot.room.name}
                    Date: ${slot.date}
                    Time: ${time}
                    Purpose: ${slot.bookingPurpose}`;

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
      });
      return response.text?.trim() || fallback;
    } catch (error) {
      this.logger.warn(`Gemini call failed: ${error}`);
      return fallback;
    }
  }
}