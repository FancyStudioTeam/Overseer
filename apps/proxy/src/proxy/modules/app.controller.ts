import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@Controller()
export class AppController {
  /** Handles "/" get requests. */
  @Get()
  /** Status code will be always "200". */
  @HttpCode(HttpStatus.OK)
  currentTime(): number {
    return Date.now();
  }
}
