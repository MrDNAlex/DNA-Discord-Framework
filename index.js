"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetLogChannel = exports.GetLogs = exports.BotCommandsEnum = exports.FileSearch = exports.EmptyCustomCommandHandler = exports.DiscordBot = exports.DefaultCommandHandler = exports.CommandRegisterer = exports.OptionTypes = exports.CommandLogger = exports.CommandFactory = exports.BotData = exports.BotCommandLog = exports.CommandHandler = exports.Command = exports.BotDataManager = void 0;
//let Bot = new DiscordBot(BotDataManager);
//Bot.StartBot();
//console.log("Bot Started");
//Exports
var BotDataManager_1 = require("./src/Bot/BotDataManager");
Object.defineProperty(exports, "BotDataManager", { enumerable: true, get: function () { return __importDefault(BotDataManager_1).default; } });
var Command_1 = require("./src/Bot/Command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return __importDefault(Command_1).default; } });
var CommandHandler_1 = require("./src/Bot/CommandHandler");
Object.defineProperty(exports, "CommandHandler", { enumerable: true, get: function () { return __importDefault(CommandHandler_1).default; } });
var BotCommandLog_1 = require("./src/Bot/BotCommandLog");
Object.defineProperty(exports, "BotCommandLog", { enumerable: true, get: function () { return __importDefault(BotCommandLog_1).default; } });
var BotData_1 = require("./src/Bot/BotData");
Object.defineProperty(exports, "BotData", { enumerable: true, get: function () { return __importDefault(BotData_1).default; } });
var CommandFactory_1 = require("./src/Bot/CommandFactory");
Object.defineProperty(exports, "CommandFactory", { enumerable: true, get: function () { return __importDefault(CommandFactory_1).default; } });
var CommandLogger_1 = require("./src/Bot/CommandLogger");
Object.defineProperty(exports, "CommandLogger", { enumerable: true, get: function () { return __importDefault(CommandLogger_1).default; } });
var OptionTypes_1 = require("./src/Bot/OptionTypes");
Object.defineProperty(exports, "OptionTypes", { enumerable: true, get: function () { return __importDefault(OptionTypes_1).default; } });
var CommandRegisterer_1 = require("./src/Bot/CommandRegisterer");
Object.defineProperty(exports, "CommandRegisterer", { enumerable: true, get: function () { return __importDefault(CommandRegisterer_1).default; } });
var DefaultCommandHandler_1 = require("./src/Bot/DefaultCommandHandler");
Object.defineProperty(exports, "DefaultCommandHandler", { enumerable: true, get: function () { return __importDefault(DefaultCommandHandler_1).default; } });
var DiscordBot_1 = require("./src/Bot/DiscordBot");
Object.defineProperty(exports, "DiscordBot", { enumerable: true, get: function () { return __importDefault(DiscordBot_1).default; } });
var EmptyCustomCommandHandler_1 = require("./src/Bot/EmptyCustomCommandHandler");
Object.defineProperty(exports, "EmptyCustomCommandHandler", { enumerable: true, get: function () { return __importDefault(EmptyCustomCommandHandler_1).default; } });
var FileSearch_1 = require("./src/FileSearch");
Object.defineProperty(exports, "FileSearch", { enumerable: true, get: function () { return __importDefault(FileSearch_1).default; } });
var BotCommandsEnum_1 = require("./src/BotCommands/BotCommandsEnum");
Object.defineProperty(exports, "BotCommandsEnum", { enumerable: true, get: function () { return __importDefault(BotCommandsEnum_1).default; } });
var GetLogs_1 = require("./src/BotCommands/GetLogs");
Object.defineProperty(exports, "GetLogs", { enumerable: true, get: function () { return __importDefault(GetLogs_1).default; } });
var SetLogChannel_1 = require("./src/BotCommands/SetLogChannel");
Object.defineProperty(exports, "SetLogChannel", { enumerable: true, get: function () { return __importDefault(SetLogChannel_1).default; } });
