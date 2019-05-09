const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect: true});
const config = require("./config.js");

var quoteRegex = /\/quote https:\/\/discordapp.com\/channels\/[0-9]+\/[0-9]+\/[0-9]+/i;

client.on("ready", () => {
	console.log(`Logged in as ${client.user.username}`);
});

client.on("message", (message) => {
	if (message.author.id === client.user.id && message.content.startsWith("/quote"))
	{
		var messageContent = message.content;
		var messageChannel = message.channel;
		
		if (quoteRegex.test(messageContent))
		{
			var captureRegex = /\/quote https:\/\/discordapp.com\/channels\/([0-9]+)\/([0-9]+)\/([0-9]+)(.*$)/gi;
			var match = captureRegex.exec(messageContent);
			
			var serverId = match[1];
			var channelId = match[2];
			var messageId = match[3];
			var messageText = match[4];
			
			client.channels.get(channelId).fetchMessage(messageId)
				.then(qm => embedQuote(messageChannel, qm, messageText))
				.catch(console.error);
				
			message.delete().catch(console.error);
		}
	}
});

function embedQuote(channel, quotedMessage, reply) {
	channel.send("", {
		embed: {
			color: quotedMessage.member.displayColor,
			author: {
				name: `${quotedMessage.author.username} said:`,
				icon_url: quotedMessage.author.avatarURL ? quotedMessage.author.avatarURL : undefined
			},
			description: quotedMessage.content,
			timestamp: new Date(quotedMessage.createdTimestamp).toISOString(),
			footer: {
				text: "in #" + quotedMessage.channel.name + " from '" + quotedMessage.channel.guild.name + "'"
			}
		}
	});
	
	if (reply !== "")
	{
		channel.send(reply);
	}
}

client.login(config.token);