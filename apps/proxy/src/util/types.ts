import type { StatusUpdate } from "@discordeno/bot";

export type WorkerDataOptions = {
  eventsProxy: {
    /** The authorization header to use. */
    authorization: string;
    /** The events proxy url to send all Discord payloads. */
    url: string;
  };
  gatewayConnection: {
    /** The shard intents to use when connecting to the gateway. */
    intents: number;
    /** The Discord client token. */
    token: string;
    /** The maximum number of shards to connect. */
    totalShards: number;
    /** The Discord gateway url to connect to. */
    url: string;
    /** The Discord gateway version to use. */
    version: number;
  };
  /** The worker id. */
  id: number;
};

interface MessageWithShardId {
  /** The shard id. */
  shardId: number;
}

/**
 * All parent port messages.
 * Sent from parent port to worker.
 */
export type ParentPortMessage = ParentPortRequestIdentify | ParentPortShardIdentified | ParentPortShardInformation;
/**
 * All worker messages.
 * Sent from worker to parent port.
 */
export type WorkerMessage = WorkerAllowIdentify | WorkerIdentifyShard | WorkerPresenceUpdate | WorkerShardInformation;

export interface ParentPortRequestIdentify extends MessageWithShardId {
  type: ParentPortMessageType.RequestIdentify;
}

export interface ParentPortShardIdentified extends MessageWithShardId {
  type: ParentPortMessageType.ShardIdentified;
}

export interface ParentPortShardInformation extends MessageWithShardId {
  /** The nonce to identify the request for the shard information. */
  nonce: string;
  /** The round trip time of the shard. */
  rtt: number;
  type: ParentPortMessageType.ShardInformation;
}

export interface WorkerAllowIdentify extends MessageWithShardId {
  type: WorkerMessageType.AllowIdentify;
}

export interface WorkerIdentifyShard extends MessageWithShardId {
  type: WorkerMessageType.IdentifyShard;
}

export interface WorkerShardInformation extends MessageWithShardId {
  /** The nonce to identify the request for the shard information. */
  nonce: string;
  type: WorkerMessageType.RequestShardInformation;
}

export interface WorkerPresenceUpdate {
  /** The presence update payload object to send to all shards. */
  payload: StatusUpdate;
  type: WorkerMessageType.PresenceUpdate;
}

export enum ParentPortMessageType {
  RequestIdentify = "RequestIdentify",
  ShardIdentified = "ShardIdentified",
  ShardInformation = "ShardInformation",
}

export enum WorkerMessageType {
  AllowIdentify = "AllowIdentify",
  IdentifyShard = "IdentifyShard",
  PresenceUpdate = "PresenceUpdate",
  RequestShardInformation = "RequestShardInformation",
}

export interface ShardInformation {
  /** The shard id. */
  shardId: number;
  /** The nonce to identify the request for the shard information. */
  nonce: string;
  /** The round trip time of the shard. */
  rtt: number;
}

export type MaybeAwaitable<T> = T | Promise<T>;
