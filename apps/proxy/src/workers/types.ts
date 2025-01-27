import type { ShardSocketRequest, StatusUpdate } from "@discordeno/bot";

export interface WorkerDataOptions {
  connection: {
    intents: number;
    token: string;
    totalShards: number;
    url: string;
    version: number;
  };
  events: {
    authorization: string;
    urls: string[];
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

export interface WorkerShardPayloadMessage extends MessageWithShardIdAndPayload<ShardSocketRequest> {
  type: WorkerMessageTypes.ShardPayload;
}

export enum ManagerMessageTypes {
  RequestIdentify = "RequestIdentify",
}

export enum WorkerMessageTypes {
  AllowIdentify = "AllowIdentify",
  EditShardsPresence = "EditShardsPresence",
  IdentifyShard = "IdentifyShard",
  ShardPayload = "ShardPayload",
}
