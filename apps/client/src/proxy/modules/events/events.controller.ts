import { type GatewayDispatchEventNames, GatewayOpcodes } from "@discordeno/bot";
import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@proxy/common/pipes/ZodValidation.js";
import { client } from "@util/client.js";
import { EventSchema, type EventSchemaDto } from "./schemas/EventSchema.js";

@Controller("events")
export class EventsController {
  @Post()
  @UsePipes(new ZodValidationPipe(EventSchema))
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleEvent(@Body() event: EventSchemaDto): Promise<void> {
    try {
      const { payload, shardId } = event;
      const { op, t } = payload;

      /** Emit the raw event with the payload and shard id. */
      client.events.raw?.(payload, shardId);

      if (op === GatewayOpcodes.Dispatch && t) {
        const dispatchEventName = t as GatewayDispatchEventNames;

        await client.events.dispatchRequirements?.(payload, shardId);
        /** Handle the incoming dispatch event and emit the event. */
        client.handlers[dispatchEventName]?.(client, payload, shardId);
      }

      return;
    } catch (internalError) {
      throw new InternalServerErrorException(internalError);
    }
  }
}
