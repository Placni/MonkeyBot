const { getRandomValues } = require('crypto').webcrypto;

module.exports = {
    name: "dice",
    description: "Rolls a round of prison dice",
    usage: `\`${process.env.PREFIX}dice\``,
    alias: [],
    disabled: false,
    slash: true,
    async execute(interaction, args, client){
        const isSlash = interaction.isCommand?.();
        var nums = [];
        var content = "";
        var count = 1;

        const err = getRandomInt(1, 6, nums);
        if (err) return interaction.channel.send(`\`An unexpected error occurred\``);
        //For some reason the nums array sometimes doesn't get passed into getRandomInt, causing the bot to crash
        
        let winningNums = checkVals(nums);
        winningNums.forEach(e => {
            const dice = client.emojis.cache.find(emoji => emoji.name === `dice_${e}`);
            content += `${dice.toString()} `
        });

        if(isSlash) interaction.reply({ content: '\u200b' });
        interaction.channel.send(content);
        interaction.channel.send(`\n Dice were rolled ${count} time(s)`);

        function checkVals(arr){
            let x = arr[0], y = arr[1], z = arr[2];
            if (x !== y && x !== z && y !== z){
                count += 1;
                arr = [];
                getRandomInt(1, 6, arr);
                return checkVals(arr);
            }
            return arr;
        }
        function getRandomInt(min, max, output){
            let arr = new Uint8Array(1);
            getRandomValues(arr);

            var range = max - min + 1;
            var max_range = 256;
            if(arr[0] >= Math.floor(max_range / range) * range){
                return getRandomInt(min, max);
            }
            let cnt;
            try {
                cnt = output.push(min + (arr[0] % range));
            } catch(err) {return err}
            
            if (cnt < 3){
                getRandomInt(min, max, output);
            } else return;
        }
    }
}