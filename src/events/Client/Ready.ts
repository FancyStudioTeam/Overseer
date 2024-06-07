import { _client } from "#index";
import { LoggerType, logger } from "#util";

_client.once("ready", async () => {
  await _client._deploy();
  logger(LoggerType.INFO, `[${_client.user.username}] ${_client.user.username} has been connected`);
});
