# MonkeyBot
A Dicord Bot hobby project written with the intent of learning more about JS\

## Features
(The bot does more than this, trust)
- Can track lots of user data to display on leaderboards
    - Time spent in voice channels
    - Messages sent in text channels
    - Amount of times each user has said a specified word
- Minigames
    - Mafia
    - Dice
- Fun commands
    - Let me google that for you
    - Shutup

## Requirements
- [node-js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Discord Application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- [MongoDB cluster](https://www.mongodb.com/basics/clusters/mongodb-cluster-setup)

## Running the bot
First, git clone this repository, or download as zip and unpack
```
$ git clone https://github.com/Placni/MonkeyBot.git
```

Next, install the dependencies for the server with npm
```
$ npm install package.json
```

Next, create a `.env` file in the root directory of the project. This will contain your bot and mongo credentials\
None of these fields are optional
```
TOKEN=
PREFIX=
OWNERID=
MONGOUSER=
MONGOPASS=
MONGODB_SRV=
```

Invite the bot to your server by creating a link from the Discord [developer portal](https://discord.com/developers/applications)\
Note that currently the bot requires Administrator permissions for it to function properly

After all previous steps are done, the server can be ran with:
```
$ node server.js 
```
