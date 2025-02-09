export type WorkerDataOptions = {
  eventsProxy: {
    /** The authorization header to use. */
    authorization: string;
    /** The events proxy URL to send all Discord payloads. */
    url: string;
  };
  gatewayConnection: {
    /** The shard intents to use when connecting to the gateway. */
    intents: number;
    /** The Discord client token. */
    token: string;
    /** The maximum number of shards to connect. */
    totalShards: number;
    /** The Discord gateway URL to connect to. */
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
export type ParentPortMessage = ParentPortRequestIdentify | ParentPortShardIdentified;
/**
 * All worker messages.
 * Sent from worker to parent port.
 */
export type WorkerMessage = WorkerAllowIdentify | WorkerIdentifyShard;

export interface ParentPortRequestIdentify extends MessageWithShardId {
  type: ParentPortMessageType.RequestIdentify;
}

export interface ParentPortShardIdentified extends MessageWithShardId {
  type: ParentPortMessageType.ShardIdentified;
}

export interface WorkerAllowIdentify extends MessageWithShardId {
  type: WorkerMessageType.AllowIdentify;
}

export interface WorkerIdentifyShard extends MessageWithShardId {
  type: WorkerMessageType.IdentifyShard;
}

export enum ParentPortMessageType {
  RequestIdentify = "RequestIdentify",
  ShardIdentified = "ShardIdentified",
}

export enum WorkerMessageType {
  AllowIdentify = "AllowIdentify",
  IdentifyShard = "IdentifyShard",
}
