# Skeleton - Lightweight Extension for discord.js v14

Welcome to Skeleton, an extensive and user-friendly extension for [discord.js](https://discord.js.org/#/), a robust JavaScript library that helps you interact with the Discord API with ease. While this project is currently a work in progress, it already boasts several handy features that augment your ability to create a Discord bot using discord.js. Please be aware that features and implementation can still change, so be ready for potential adjustments while working with this project.

## Features / Summary

Skeleton provides a streamlined framework for Discord bot development packed with valuable features. Let's take a quick look:

- **Automatic Command Deployment**: Simply define your commands and Skeleton takes over, deploying them to the Discord API automatically.

- **Full Command Support and File-Based Definitions**: From Slash Commands to User Commands, Subcommands, and Message Commands, Skeleton accommodates all four Discord command types. Furthermore, these commands can be defined in individual `.bone.ts` files for a cleaner, modular project structure.

- **Custom Command Extension**: Create custom command classes and import them just like any `.bone.ts` files. Skeleton provides support for custom import handlers, allowing maximum flexibility.

- **Integrated and Custom Interaction Handlers**: Skeleton comes equipped with built-in interaction handlers and also supports custom handlers, enabling comprehensive interaction management.

- **Component Helpers**: Skeleton's suite of helper functions simplify the process of building UI components for your bot.

The following sections provide a step-by-step guide to setting up Skeleton and leveraging its rich features for your Discord bot. Happy coding!

# Guide

The upcoming sections of this README provide a comprehensive guide to using Skeleton. This guide covers everything from initial setup to defining commands and using helper functions.

## Set up

The setup process for Skeleton is straightforward, and the following steps will guide you through it:

### Step 1: Install Skeleton

Begin by installing Skeleton via npm. In your terminal, run the following command:

```shell
npm i base-app-for-discordjs
```

### Step 2: Install Dependencies

Please ensure you have `discord.js` version 14.0.0 or later installed as Skeleton requires this to function properly.

### Step 3: Initialize and Run Skeleton

Create a new file in your project where you'll set up Skeleton. In this file, write the following TypeScript code:

```typescript
// Import Skeleton class
import { Skeleton } from "base-app-for-discordjs";

// Create the object
const skeleton = new Skeleton();

// Set what will be passed to commands when executed
skeleton.setContext({});

// This imports all command files and deploys them
skeleton.run({
  appId: config["APP_ID"],
  client: client,
  token: config["APP_TOKEN"],
  guildId: config["DEV_GUILD_ID"], // Optional, if you're using a dev guild.
});
```

This initializes a new instance of Skeleton and configures it to run with your Discord app's ID and token. If you're developing with a specific guild, you can also include the guild's ID.

## Command Files

In Skeleton, you can define commands using specific files called command files, which have the `.bone.ts` extension. These files allow you to manage and configure each command independently, offering greater flexibility and maintenance ease.

Here's a basic structure of how a command file (e.g., `foobar.bone.ts`) might look like:

```typescript
import { SlashCommand } from "base-app-for-discordjs";

export default new SlashCommand<{}>(
  {
    name: "foo",
    description: "bar",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
```

### Manually Adding Commands

If you prefer not to define commands in separate files, you can add them manually in your main script. Here's an example of how you might manually add a command:

```typescript
import { UserCommand, Skeleton } from 'base-app-for-discordjs';

let skeleton = new Skeleton();
let command = new UserCommand<{}>(
  {
    name: "manual",
    description: "I added this manually",
  },
  async (interaction, context) => {
    interaction.reply("I will find you.");
  }
);

skeleton.addUserCommand(command);
skeleton.run(...);
```

Just be sure to add these commands before calling `skeleton.run()`.

### Command Types

Skeleton supports all four types of Discord commands:

1. Slash Commands:

```typescript
new SlashCommand(...);
```

2. Sub Commands:

```typescript
new MasterCommand({
  name: "master"
  ...
});

new SubCommand({
  name: "sub",
  master: "master",
});
```

3. User Commands:

```typescript
new UserCommand(...);
```

4. Message Commands:

```typescript
new MessageCommand(...);
```

## Command Options

Skeleton provides a suite of command option helpers, simplifying the process of adding user-defined parameters to your commands. Instead of manually specifying the type of each option, these helpers do the heavy lifting for you.

Let's walk through the process of incorporating options into your commands using these helper functions:

```typescript
import { SlashCommand, user, string } from 'base-app-for-discordjs';

new SlashCommand<{}>(
  ...,
  user({
    name: "user",
    description: "pings this user",
  }),
  string({
    name: "string",
    description: "string option",
  }),
);
```

This will create a slash command with two options - one for mentioning a user, and one for passing a string argument. The helper functions save you the trouble of specifying the option type manually, making your code cleaner and easier to read.

Here's a list of available helper functions:

- `attachment()`
- `boolean()`
- `channel()`
- `mentionable()`
- `number()`
- `string()`
- `integer()`
- `role()`
- `group()`
- `user()`

If you prefer not to use these helper functions, you can specify the type manually:

```typescript
import { SlashCommand, ApplicationCommandOptionType } from 'base-app-for-discordjs';

new SlashCommand<{}>(
  ...,
  {
    type: ApplicationCommandOptionType.User,
    name: "user",
    description: "pings this user",
  },
  {
    type: ApplicationCommandOptionType.String,
    name: "string",
    description: "string option",
  },
);
```

## Component Helpers

Skeleton also provides helper functions for creating Discord components, like modals and buttons. These helper functions aim to streamline the process of creating interactive elements for your bot.

For instance, here's an example of creating a modal with a couple of text input fields:

```typescript
import { Modal, text } from "base-app-for-discordjs";

const m = Modal(
  {
    custom_id: modalID,
    title: "Create a new faction!",
  },
  text({
    custom_id: "name",
    label: "Name:",
    min_length: 4,
    max_length: 15,
    placeholder: "Free Folk",
    required: true,
  }),
  text({
    custom_id: "code",
    label: "Code (an abbrevation):",
    min_length: 2,
    max_length: 4,
    placeholder: "FF",
    required: true,
  }),
);
```

This snippet creates a modal with two text fields for entering a name and a code.

Here's a list of available component helper functions:

**Modal:**

- `Modal()`
- `modalRow()`
- `text()`

**Action row:**

- `row()`

**Buttons**

- `button()`
- `urlButton()`

**Select menus:**

- `selectChannel()`
- `selectString()`
- `selectRole()`
- `selectUser()`
- `selectMentionable()`

## Interaction Handling

Skeleton can automatically handle interactions that fall into one of the following categories: `ChatInputCommandInteraction`, `ModalSubmitInteraction`, or `ContextMenuCommandInteraction`. If you want to handle interactions with a custom ID, you can add your own interaction handler.

For instance, suppose you want to handle all interactions with a specific custom ID. Here's how you can achieve it:

1. Create a class that extends `InteractionHandler`:

```typescript
import { InteractionHandler, MessageComponentInteraction } from 'base-app-for-discordjs';

class CustomIdInteractionHandler extends InteractionHandler<CustomIdInteraction> {

  customIds = [..., "foo", ...];

  // This is run before check() and execute() to make sure it is the correct type of interaction
  typeGuard = (interaction: BaseInteraction): interaction is MessageComponentInteraction => interaction.isMessageComponent();

  // If this return true, then the execute() method will run.
  check = (interaction: MessageComponentInteraction) => {
    return  this.customIds.find(cid => cid === interaction.customId);
  };

  execute = async (interaction: MessageComponentInteraction, context: any, skeleton: Skeleton<any>) => {
    let customId = interaction.customId;
    if (customId === "foo") {
      // Do something depending on the custom id
    }
  };
}
```

2. Register the interaction handler with Skeleton:

```typescript
import { Skeleton } from 'base-app-for-discordjs';

let skeleton = new Skeleton();
let handler = new CustomIdInteractionHandler();
skeleton.registerInteractionHandler(handler);
skeleton.run(...);
```

3. Now, every time an interaction with a `custom_id` that matches an ID in the `CustomIdInteractionHandler.customIds` list occurs, the `CustomIdInteractionHandler.execute` method will run.

## Custom Commands

To further expand the functionalities of Skeleton, you can create custom command classes that you can pass to the interaction handler.

1. Create a custom command class:

```typescript
class CustomIdCommand<T> {
  customId: string;
  execute;
  constructor(customId: string, execute: (i: MessageComponentInteraction, context: T) => any) {
    this.customId = customId;
    this.execute = execute;
  }
}
```

2. Add functionality to the interaction handler for handling custom commands:

```typescript
import { Collection } from 'base-app-for-discordjs';

class CustomIdInteractionHandler extends InteractionHandler<CustomIdInteraction> {

  commands: Collection<string, CustomIdCommand> = new Collection();

  ...

  execute = (...) => {
    let customId = interaction.customId;
    commands.get(customId)(...);
  };

  addCommand(command: CustomIdCommand)  {
    commands.set(command.customId, command);
  };
}
```

3. Add the custom commands to the interaction handler:

```typescript
let handler = new CustomIdInteractionHandler();

let command = new CustomIdCommand("test", async (interaction, app) => {
  if (interaction.isRepliable()) interaction.reply("Button with custom id 'test' was clicked!");
});

handler.addCommand(command);

skeleton.registerInteractionHandler(handler);
skeleton.run(...);
```

With the steps above, you've now added custom commands and interactions to your Discord bot, giving you a great deal of control over how your bot behaves and interacts with users.

## Writing Your Custom Commands in `.bone.ts` Files

If you prefer keeping your command definitions organized in individual files, Skeleton offers a way to use `.bone.ts` files for your custom command classes, much like you do for slash commands.

1. Use the `@Importable` decorator to enable the import of the custom command class.

```typescript
import { Importable } from "base-app-for-discordjs";

@Importable
class CustomIdCommand<T> {
  customId: string;
  execute;
  constructor(customId: string, execute: (i: MessageComponentInteraction, context: T) => any) {
    this.customId = customId;
    this.execute = execute;
  }
}

new CustomIdCommand<{}>("test", async (interaction, app) => {
  interaction.reply("Button with custom id 'test' was clicked!");
});
```

2. Create a class that implements the `ImportHandler` interface. This class will specify how the imported command is handled.

```typescript
import { ImportHandler } from "base-app-for-discordjs";

export class CustomIdCommandImportHandler implements ImportHandler<CustomIdCommand> {
  classToBeImported = CustomIdCommand;
  constructor() {}
  onImport = (importedObject: CustomIdCommand) => {
    // For example, add it to the CustomIdInteractionHandler
  };
}
```

3. Register the import handler with Skeleton:

```typescript
import { Skeleton } from 'base-app-for-discordjs';

let skeleton = new Skeleton();
let handler = new CustomIdCommandImportHandler();
skeleton.addImportHandler(handler);
skeleton.run(...);
```

With these steps, you can maintain cleaner and more organized code by writing your custom commands in separate `.bone.ts` files.

# Conclusion

Please keep in mind that this project is still a work in progress. Despite the careful design and thorough testing, there may still be some bugs and missing features. Your understanding and patience is greatly appreciated, and your feedback is crucial in helping to improve the project.

---

For any further information, please refer to the official [discord.js guide](https://discordjs.guide/) and the Discord API [documentation](https://discord.com/developers/docs/intro). Happy bot building!
