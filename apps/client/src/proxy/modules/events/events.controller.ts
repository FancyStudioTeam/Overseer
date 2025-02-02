import type { GatewayDispatchEventNames } from "@discordeno/bot";
import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@proxy/common/pipes/ZodValidation.js";
import { client } from "@util/client.js";
import { EventSchema, type EventSchemaDto } from "./schemas/EventSchema.js";

@Controller("events")
export class EventsController {
  @Post()
  /** Validate the incoming body object using Zod. */
  @UsePipes(new ZodValidationPipe(EventSchema))
  @HttpCode(HttpStatus.OK)
  async handleEvent(@Body() event: EventSchemaDto) {
    try {
      const { payload, shardId } = event;
      const { t } = payload;

      /** Send the payload to "raw" client event. */
      client.events.raw?.(payload, shardId);

      if (t) {
        const dispatchEventName = t as GatewayDispatchEventNames;

        await client.events.dispatchRequirements?.(payload, shardId);
        /** Handle the incoming dispatch event and emit the event. */
        client.handlers[dispatchEventName]?.(client, payload, shardId);
      }
    } catch (internalError) {
      throw new InternalServerErrorException(internalError);
    }
  }
}
