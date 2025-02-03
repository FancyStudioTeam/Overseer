import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@Controller()
export class AppController {
  /** Handles "/" get requests. */
  @Get()
  @HttpCode(HttpStatus.OK)
  currentTime() {
    return Date.now();
  }
}
