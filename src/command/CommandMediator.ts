import { Collection } from "discord.js";

export class CommandMediator<T> {
  getCommand: (id: string) => T;
  setCommand: (id: string, command: T) => any;
  getCommands: () => T[];
}
