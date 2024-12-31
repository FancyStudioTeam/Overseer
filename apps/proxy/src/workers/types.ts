import type { ShardSocketRequest, StatusUpdate } from "@discordeno/bot";

export interface WorkerDataOptions {
  connection: {
    intents: number;
    token: string;
    totalShards: number;
    url: string;
    version: number;
  };
  workerId: number;
}

interface MessageWithShardId {
  shardId: number;
}

interface MessageWithPayload<T> {
  payload: T;
}

type MessageWithShardIdAndPayload<T> = MessageWithShardId & MessageWithPayload<T>;

export type ManagerMessage = ManagerRequestIdentifyMessage;
export type WorkerMessage =
  | WorkerAllowIdentifyMessage
  | WorkerEditShardsPresenceMessage
  | WorkerIdentifyShardMessage
  | WorkerRequestShardInfoMessage
  | WorkerShardPayloadMessage;

export interface ManagerRequestIdentifyMessage extends MessageWithShardId {
  type: ManagerMessageTypes.RequestIdentify;
}

export interface WorkerAllowIdentifyMessage extends MessageWithShardId {
  type: WorkerMessageTypes.AllowIdentify;
}

export interface WorkerEditShardsPresenceMessage extends MessageWithPayload<StatusUpdate> {
  type: WorkerMessageTypes.EditShardsPresence;
}

export interface WorkerIdentifyShardMessage extends MessageWithShardId {
  type: WorkerMessageTypes.IdentifyShard;
}

export interface WorkerRequestShardInfoMessage extends MessageWithShardId {
  type: WorkerMessageTypes.RequestShardInfo;
}

export interface WorkerShardPayloadMessage extends MessageWithShardIdAndPayload<ShardSocketRequest> {
  type: WorkerMessageTypes.ShardPayload;
}

export enum ManagerMessageTypes {
  RequestIdentify = "RequestIdentify",
  // ShardInfo = "ShardInfo",
  // ShardInfoFromGuild = "ShardInfoFromGuild",
}

export enum WorkerMessageTypes {
  AllowIdentify = "AllowIdentify",
  EditShardsPresence = "EditShardsPresence",
  IdentifyShard = "IdentifyShard",
  RequestShardInfo = "RequestShardInfo",
  ShardPayload = "ShardPayload",
}
