// @ts-check

import fs from "fs";
import { Client, Intents } from "discord.js";
import stripAnsi from "strip-ansi";
import os from "os";
import path from "path";

import * as dotenv from "dotenv";
const __dirname = path.resolve();
dotenv.config({ path: __dirname + "/.env" });

//? Discord --------------------------------------------------------------------------------------------------------------------

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/**
 * @param {string} line
 */
function sendLine(line, filepath, type) {
	const cleanLine = stripAnsi(line);
	if (!cleanLine.length) return;

	console.log("Sending Line:", cleanLine);

	if (type == "request") {
		const logChannel = client.channels.cache.get(process.env.DISCORD_REQUEST);

		// @ts-ignore
		logChannel.send(cleanLine);
	}

	if (type == "console") {
		const logChannel = client.channels.cache.get(process.env.DISCORD_CONSOLE);

		// @ts-ignore
		logChannel.send(cleanLine);

		//? Check if the message is an error, if so ping.
		if (line.includes("[31m")) {
			// @ts-ignore
			logChannel.send(`<@${process.env.USER_MENTION_ID}>`);
		}
	}
}

client.on("ready", () => {
	console.log("LogWatch is online.");
});

client.login(process.env.TOKEN);

//? Tracking -------------------------------------------------------------------------------------------------------------

function trackFile(filePath, type) {
	let fileSize = fs.statSync(filePath).size;

	fs.watchFile(filePath, (current, previous) => {
		if (current.mtime <= previous.mtime) return;

		const newFileSize = fs.statSync(filePath).size;
		let sizeDiff = newFileSize - fileSize;

		const buffer = Buffer.alloc(sizeDiff);
		const fileDescriptor = fs.openSync(filePath, "r");

		fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
		fs.closeSync(fileDescriptor);

		fileSize = newFileSize;

		const bufferArray = buffer.toString().split(os.EOL);

		for (const line of bufferArray) {
			sendLine(line, filePath, type);
		}
	});

	console.log("Watching file:", filePath);
}

trackFile(path.join(`${__dirname}/../${process.env.FOLDER}/logs/request.log`), "request");
trackFile(path.join(`${__dirname}/../${process.env.FOLDER}/logs/console.log`), "console");
