import { APIApplicationCommand } from "discord.js";

/**
 * A interface that formats commands in a way that they can sent to the Discord API.
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object}
 */
export default interface APICommandProvider {
  /**
   * Returns commands in a format that can be sent to the Discord API.
   * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object}
   */
  getAPICommands: () => APIApplicationCommand[];
}
