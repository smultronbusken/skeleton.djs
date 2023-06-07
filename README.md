# Skeleton - Base app for discord.js (This README and project is WIP)

This projects is a made using [discord.js](https://discord.js.org/#/). It is used as a base app and includes a couple of handy features

# Features

- Easier command creation. 
- Automatic command registering - all command files are registered to the Discord API.
- Interaction handling - each interaction from Discord gets mapped to the correct command.
- Write custom command types, interaction handlers, and ```.job.ts``` file registration, to extend the functionality.

## Command creation

Command files are file which ends in `.job.ts` and define one command. All of the commands are imported and deployed when you run ``` skeleton.run() ```

![](https://i.imgur.com/IXJaqDc.png)

Here is an example command file:

```typescript
export default new SlashCommand<{}>(
  {
    name: "foo",
    description: "bar",
    options: [
      {
        name: "foo",
        description: "bar",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
```

If youre using typescript the parameters are typed.

Read more here on what data to pass:
https://discord.com/developers/docs/interactions/application-commands & https://old.discordjs.dev/#/docs/discord.js/14.11.0/class/ApplicationCommand


#### Subcommand with subcommand groups example

```typescript
export default new SubCommand<{}>(
  {
    master: "mastercommand",
    group: "group",
    name: "foo",
    description: "bar",
    options: [
      {
        name: "user",
        description: "useroption",
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
```

```typescript
export default new MasterCommand<{}>({
  name: "mastercommand",
  description: "A master command",
  options: [
    {
      description: "A group",
      name: "group",
      type: ApplicationCommandOptionType.SubcommandGroup,
    },
  ],
});
```

### Types of commands

There are 4 types of commands of which all are deployed automatically:

- `SlashCommand`
  ![](https://i.imgur.com/mym1QSP.png)
- `SubCommand`
  ![](https://i.imgur.com/UJLveKP.png)
- `UserCommand`
  ![](https://i.imgur.com/hPjR4aj.png)
- `MessageCommand`
  ![](https://i.imgur.com/mSdkaLw.png)


### Interaction handling

```typescript
export default class CustomIdInteractionHandler<T> extends InteractionHandler<CustomIdInteraction, T> {

    customIds = [..., "foo", ...]

    // This is run before check() and execute() to make sure it is the correct type on interaction
    typeGuard = (interaction: BaseInteraction): interaction is CustomIdInteraction => isCustomInteraction(interaction)

    // If this return true, then the execute() method will run.
    check = (interaction: CustomIdInteraction) => {
      return  this.customIds.find(cid => cid.customId === interaction.customId)
    }

    execute = async (interaction: CustomIdInteraction, context: T) => {
        let customId = interaction.customId;
        // Do something depending on the custom id
    }

}
```

### Custom commands

You can extend the functionality and add more type of commands. It has to extend from the ```Job``` class.

- `CustomIdCommand`
```typescript
export class CustomIdCommand<T> extends Job<T> {
  customId: string;
  constructor(customId: string, execute: (i: CustomIdInteraction, context: T) => any) {
    super(execute);
    this.customId = customId;
  }
}

new CustomIdCommand<{}>(
  "test",
  async (interaction, app) => {
    if (interaction.isRepliable()) 
      interaction.reply("Button with custom id 'test' was clicked!")
  }
);

```
You could then add this in the ``` CustomIdInteractionHandler ``` class and run it when and interaction with the custom id "test" comes.


### Registration handler when importing ```.job.ts``` file 

You can then extend so that your new commands can be written in ```.job.ts``` files. You do this by creating a ```RegistrationHandler``` subclass


```typescript
export class CustomIdCommandJobHandler<T> implements RegistrationHandler<CustomIdCommand<T>> {
    jobType = CustomIdCommand;
    constructor() {}
    onRegister = (job: CustomIdCommand<T>) => {
        // Do something with the command, such as passing it to the an InteractionHandler
    }
}
```


## Set up

1. Install with `npm i base-app-for-discordjs`
2. Install all dependencies  
3. Run a file with the following code:

```typescript
    // Create the object
    const skeleton = new Skeleton();

    // Set what will be passed to commands when executed
    skeleton.setContext({});

    // Manually add a command, instead of writing it in a .job.ts file
    // Be sure to add them before before you call skeleton.run
    skeleton.addUserCommand(
      new UserCommand<{}>({
        name: "testcommand",
        description: "I added this manually",
      },
      async (interaction, context) => {
        interaction.reply("hej")
      }
      ),
    );

    // This loads all command files and deploys them
    skeleton.run({
      appId: config["APP_ID"],
      client: client,
      token: config["APP_TOKEN"],
      guildId: config["DEV_GUILD_ID"], // Optional, if youre using a dev guild.
    });
```
