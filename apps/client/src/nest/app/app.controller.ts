import type { DiscordGatewayPayload, GatewayDispatchEventNames } from "@discordeno/bot";
import { ZodValidationPipe } from "@nest/pipes/zodValidation.pipe.js";
import { EventSchema, type EventSchemaType } from "@nest/schemas/EventSchema.js";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes } from "@nestjs/common";
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
    const { payload: rawPayload, shardId } = event;
    const payload = rawPayload as unknown as DiscordGatewayPayload;
    const { t } = payload;

    client.events.raw?.(payload, shardId);

    if (t) {
      const dispatchEventName = t as GatewayDispatchEventNames;

      await client.events.dispatchRequirements?.(payload, shardId);
      client.handlers[dispatchEventName]?.(client, payload, shardId);
    }
  }
}
