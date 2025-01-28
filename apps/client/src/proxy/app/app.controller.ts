import type { DiscordGatewayPayload, GatewayDispatchEventNames } from "@discordeno/bot";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "@proxy/pipes/zodValidation.pipe.js";
import { EventSchema, type EventSchemaType } from "@proxy/schemas/EventSchema.js";
import { client } from "@util/client.js";

@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  currentTime() {
    return Date.now();
  }

  @Post()
  /** Use pipes to validate body objects. */
  @UsePipes(new ZodValidationPipe(EventSchema))
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleEvent(@Body() event: EventSchemaType) {
    try {
      const { payload: rawPayload, shardId } = event;
      const payload = rawPayload as unknown as DiscordGatewayPayload;
      const { t } = payload;

      client.events.raw?.(payload, shardId);

      if (t) {
        const dispatchEventName = t as GatewayDispatchEventNames;

        await client.events.dispatchRequirements?.(payload, shardId);
        client.handlers[dispatchEventName]?.(client, payload, shardId);
      }
    } catch (internalError) {
      throw new InternalServerErrorException(internalError);
    }
  }
}
