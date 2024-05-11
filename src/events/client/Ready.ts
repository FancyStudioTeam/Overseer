import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.once("ready", async () => {
  await _client._deploy();
  logger(
    LoggerType.INFO,
    `[${_client.user.username}] ${_client.user.username} has been connected`
  );
});
