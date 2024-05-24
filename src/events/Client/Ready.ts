import { _client } from "../..";
import { LoggerType, logger } from "../../util/Util";

_client.once("ready", async () => {
  await _client._deploy();
  logger(
    LoggerType.INFO,
    `[${_client.user.username}] ${_client.user.username} has been connected`,
  );
});
