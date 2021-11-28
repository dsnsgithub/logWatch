// @ts-check
import fs from "fs";
import { Client, Intents } from "discord.js";
import stripAnsi from "strip-ansi";
import os from "os";

import path from "path";

import * as dotenv from "dotenv";
const __dirname = path.resolve();

dotenv.config({ path: __dirname + "/.env" });

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/**
 * @param {string} line
 */
function sendLine(line) {
	const cleanLine = stripAnsi(line);
	if (cleanLine.length) {
		console.log("Sending Line:", cleanLine);

		const logChannel = client.channels.cache.get("912817725502525450");

		// @ts-ignore
		logChannel.send(cleanLine);

		//? Check if the message is an error, if so ping.
		if (line.includes("[31m")) {
			// @ts-ignore
			logChannel.send("<@342874998375186432>");
		}
	}
}

client.on("ready", () => {
	console.log("LogWatch is online.");
});

client.login(process.env.TOKEN);

//? Below is code used to monitor changes in the log file. ------------------------------------------------
const options = {
	logFile: "./../dsns.dev/logs/server.log",
	endOfLineChar: os.EOL
};

let fileSize = fs.statSync(options.logFile).size;
fs.watchFile(options.logFile, function (current, previous) {
	// If modified time is the same, nothing changed so don't bother parsing.
	if (current.mtime <= previous.mtime) return;

	const newFileSize = fs.statSync(options.logFile).size;

	// Calculate size difference.
	let sizeDiff = newFileSize - fileSize;

	// Create a buffer to hold only the data we intend to read.
	const buffer = Buffer.alloc(sizeDiff);

	// Obtain reference to the file's descriptor.
	const fileDescriptor = fs.openSync(options.logFile, "r");

	// Synchronously read from the file starting from where we read
	// to last time and store data in our buffer.
	fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
	fs.closeSync(fileDescriptor); // close the file

	// Set old file size to the new size for next read.
	fileSize = newFileSize;

	// Parse the line(s) in the buffer.
	parseBuffer(buffer);
});

function parseBuffer(buffer) {
	// Iterate over each line in the buffer.
	buffer
		.toString()
		.split(options.endOfLineChar)
		.forEach(function (line) {
			sendLine(line);
		});
}
