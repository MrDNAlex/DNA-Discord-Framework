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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const BotData_1 = __importDefault(require("./DiscordBot/Core/Data/BotData"));
const BotDataManager_1 = __importDefault(require("./DiscordBot/Core/Data/BotDataManager"));
/**
 * Utility Class for Searching Files
 */
class FileSearch {
    constructor() {
        /**
         * Path the the Directory of the Bot
         */
        this._directoryPath = fs.realpathSync(process.cwd() + "/src");
        /**
         * Path this Module is Located
         */
        this._modulePath = fs.realpathSync(__dirname);
    }
    /**
    * Gets all the files with JavaScript endings in the Bot Directory
    * @returns An Array of Java Script File Paths within the Bot Directory
    */
    GetAllJSFiles() {
        let AllFiles = [];
        AllFiles.push(...this.GetFiles(this._directoryPath, ".js"));
        if (this._directoryPath != this._modulePath)
            AllFiles.push(...this.GetFiles(this._modulePath, ".js"));
        return AllFiles;
    }
    /**
    * Gets all the Java Script Files within the provided directory and subdirectories through recursion
    * @param Path The start Path to search for files
    * @returns Array of all Java Script Files within the provided directory and subdirectories
    */
    GetFiles(Path, fileExtension) {
        let AllFiles = [];
        if (fs.existsSync(Path)) {
            let files = fs.readdirSync(Path);
            files.forEach(file => {
                let absPath = Path + "/" + file;
                if (fs.lstatSync(absPath).isDirectory())
                    AllFiles.push(...this.GetFiles(absPath, fileExtension));
                else if (path.extname(absPath) === fileExtension)
                    AllFiles.push(absPath);
            });
        }
        return AllFiles;
    }
    /**
     * Gets all the Command Instances from the Provided Directory
     * @returns Array of IT Command Objects
     */
    GetAllCommandInstances(dataManager) {
        let Commands = [];
        const CommandClasses = this.GetAllCommands();
        CommandClasses.forEach(commandClass => {
            const commandInstance = new commandClass(dataManager);
            if (commandInstance.CommandName !== '')
                Commands.push(commandInstance);
        });
        return Commands;
    }
    /**
    * Gets all the Command Classes from the Provided Directory
    * @returns Array of IT Command Objects
    */
    GetAllCommands() {
        let Commands = [];
        const Files = this.GetAllJSFiles();
        Files.forEach(file => {
            const module = require(file);
            try {
                const classType = module;
                try {
                    const moduleInstance = new classType();
                    if ('CommandName' in moduleInstance)
                        Commands.push(module);
                }
                catch (error) {
                    //console.log("Error Occurred: " + error); 
                }
            }
            catch (error) {
                console.log("Error Occurred: " + error);
                if (error instanceof Error)
                    BotData_1.default.Instance(BotDataManager_1.default).AddErrorLog(error);
            }
        });
        return Commands;
    }
}
exports.default = FileSearch;
