import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import osu from "node-os-utils";

import chalk from "chalk";

console.clear();

dotenv.config();

const app = express();

const io = new Server(3000, {
	cors: {
		origin: "*",
	},
});

const cpu = osu.cpu;
const memory = osu.mem;
const network = osu.netstat;

io.on("connection", (socket) => {
	console.log(chalk.magenta("Client connected"));
})

setInterval(async () => {
	const cpuInfo = await cpu.usage();
	const memoryInfo = await memory.info();
	const networkInfo = await network.stats();

	const obj = {
		cpuInfo,
		memoryInfo,
		networkInfo,
	};

	io.emit("monitor", JSON.stringify(obj));
}, 1000);

app.listen(3001, () => {
	console.log(chalk.magenta("Server listening"));
});
