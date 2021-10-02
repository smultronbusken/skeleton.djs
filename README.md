# Base app for discord.js (This README and project is WIP)

This projects is a made using [discord.js](https://discord.js.org/#/). It is used as a base app and includes a couple of handy features

# Features

- Easier command creation.
- Automatic command registering - all command files are registered to the Discord API.
- Interaction handling - each interaction from Discord gets mapped to the correct command.
- Simple set up for JSON-based database using [stormdb](https://www.npmjs.com/package/stormdb). For example you are making a app with currencies and transactions. Simply create an file (which ends with .storage.json) anywhere in your source folder.

## Command creation

Command files are file which ends in `.job.ts` and define one command. All of these files are imported automatically. Here is a [music app](https://github.com/smultronbusken/discord-music-app) of mine. As you can see we have 5 command files under the command folder.

![](https://i.imgur.com/IXJaqDc.png)

This is the code for the slash command `skip.job.ts`

```typescript
import { SlashCommand } from "@smultronbusken/skeleton-discord-app/src/Jobs";
import SongApp from "../main";

export default new SlashCommand<SongApp>({
  name: "skip",
  info: "Skips the current song.",
  execute(interaction, app) {
    let subscription = app.getSubscription(interaction.guildId);
    if (subscription) {
      let nextSong = subscription.queue.dequeue();
      if (nextSong) {
        subscription.playSong(nextSong);
        interaction.reply(`🎶 Now playing **${nextSong.title}**`);
      }
    }
  },
});
```

### Types of commands

There are 4 types of commands of which all are registered automatically:

- `SlashCommand`
  ![](https://i.imgur.com/mym1QSP.png)
- `SubCommand`
  ![](https://i.imgur.com/UJLveKP.png)
- `UserCommand`
  ![](https://i.imgur.com/hPjR4aj.png)
- `MessageCommand`
  ![](https://i.imgur.com/mSdkaLw.png)

## Storage files


Creating a file which ends in `.storage.json` with a "name" property will make it accessable in your code byt calling `Skeleton.getStorage(name)`

In the above example you can see a `playlists.storage.json` file which has the content

```json
{
  "name": "playlists",
  "Chill": [
    "https://www.youtube.com/watch?v=LmUHFgNFRG0",
    "https://www.youtube.com/watch?v=LmUHFgNFRG0",
    "https://www.youtube.com/watch?v=LmUHFgNFRG0"
  ],
  "Hype": [
    "https://www.youtube.com/watch?v=LmUHFgNFRG0",
    "https://www.youtube.com/watch?v=LmUHFgNFRG0",
    "https://www.youtube.com/watch?v=LmUHFgNFRG0"
  ]
}
```

To read or write to this file

```typescript
let playlist: Array<string> = skeleton
  .getStorage("playlists")
  .get(playlistName)
  .value();
```


## Set up

1. Install with `npm i base-app-for-discordjs`
2. Run a file with the following code:

```typescript
  import Skeleton from "base-app-for-discordjs/src/Skeleton"

    const intents = { intents: [...all intents you need] }
    const skeleton = new Skeleton(
      {}, // This object will get passed to commands, it can be any type or variable
      "APP_TOKEN",  // You get this from the Discord developer portal
      "APP_ID", // You get this from the Discord developer portal
      intents,
      "ID_OF_A_GUILD_WHERE_YOU_TEST_YOUR_COMMANDS" // this is optional, but without it it takes up to an hour to register commands
    );
    skeleton.client.login("APP_TOKEN");
  })
```
