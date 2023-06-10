/**
 * Used internally for easier command handling between InteractionHandler and ImportHandler.
 */
export class CommandMediator<T> {
  getCommand: (id: string) => T;
  setCommand: (id: string, command: T) => any;
  getCommands: () => T[];
}
