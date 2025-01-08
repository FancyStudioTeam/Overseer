import { client } from "@index";
import {
  CreateCommandTypes,
  type CreateMessageCommand,
  type CreateMessageCommandOptions,
  type CreateUserCommand,
  type CreateUserCommandOptions,
} from "@types";

export const createMessageCommand = (data: CreateMessageCommandOptions): CreateMessageCommand => {
  const options: CreateMessageCommand = {
    ...data,
    type: CreateCommandTypes.Message,
  };

  client.commands.message.set(data.name, options);

  return options;
};

export const createUserCommand = (data: CreateUserCommandOptions): CreateUserCommand => {
  const options: CreateUserCommand = {
    ...data,
    type: CreateCommandTypes.User,
  };

  client.commands.user.set(data.name, options);

  return options;
};
