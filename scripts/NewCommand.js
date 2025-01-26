#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const commandName = process.argv[2];
const currentDir = process.cwd();
const srcDir = path.join(currentDir, "src");
const CommandDir = findCommandsDir(srcDir, "Commands");
if (!CommandDir) {
    console.error("Could not find Commands directory in src");
    process.exit(1);
}
fs.writeFileSync(path.join(CommandDir, `${commandName}.ts`), NewCommandText(commandName));
console.log(`Command ${commandName} created successfully!`);
function findCommandsDir(currentDir, targetDirName) {
    const filesAndDirs = fs.readdirSync(currentDir);
    for (const fileOrDir of filesAndDirs) {
        const fullPath = path.join(currentDir, fileOrDir);
        const stat = fs.statSync(fullPath);
        // Check if it's the directory we're looking for
        if (stat.isDirectory()) {
            if (fileOrDir === targetDirName) {
                return fullPath;
            }
            else {
                // Recursively search in this directory
                const found = findCommandsDir(fullPath, targetDirName);
                if (found)
                    return found;
            }
        }
    }
    return null;
}
function NewCommandText(commandName) {
    return `import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";

class ${commandName} extends Command {

    /* <inheritdoc> */
    public CommandName: string = '${commandName.toLowerCase()}';

    /* <inheritdoc> */
    public CommandDescription: string = 'A Description for ${commandName} goes here.';

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
    };

    /* <inheritdoc> */
    public IsEphemeralResponse: boolean = true;
}

export = ${commandName};`;
}
