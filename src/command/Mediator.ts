import { Collection } from "discord.js";

/**
 * Used internally for easier command handling between InteractionHandler and ImportHandler.
 */
export class Mediator<T> {
  get: (id: string) => T;
  set: (id: string, command: T) => any;
  getAll: () => T[];
}

export class CollectionMediator<T> implements Mediator<T> {
  protected elements: Collection<string, T> = new Collection();

  getAll = () => Array.from(this.elements.values());

  get = (id: string) => this.elements.get(id);

  set = (id: string, command: T) => this.elements.set(id, command);
}
