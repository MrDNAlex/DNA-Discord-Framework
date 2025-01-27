"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
class BotCommunication {
    constructor() {
        /**
         * The Date the Response was created
         */
        this.CreatedDate = Date.now();
        /**
         * The Message Content of the Response
         */
        this.content = "";
        /**
         * The Files associated with the Response
         */
        this.files = [];
        /**
         * Boolean Flag to determine if the Message has been received/initialized and can be updated
         */
        this._MessageInitialized = false;
        /**
         * Boolean Flag to determine if the Message has been received and Displayed to the User
         */
        this._MessageReceived = false;
    }
    /**
     * Gets the Link of the Communication Instance
     * @returns The Link of the Communication Instance
     */
    GetLink() {
        this.UpdateCommunication();
        if (this.CommunicationInstance === undefined)
            return "No Link Available";
        if (this.CommunicationInstance instanceof discord_js_1.InteractionResponse)
            return `https://discord.com/channels/${this.CommunicationInstance.interaction.guildId}/${this.CommunicationInstance.interaction.channelId}/${this.CommunicationInstance.id}`;
        if (this.CommunicationInstance instanceof discord_js_1.Message)
            return `https://discord.com/channels/${this.CommunicationInstance.guildId}/${this.CommunicationInstance.channelId}/${this.CommunicationInstance.id}`;
        return "No Link Available";
    }
    /**
     * Adds Content to the Message as a new Line
     * @param content The String Content to add to the Message
     */
    AddMessage(content, delayUpdate = false) {
        this.content += content + "\n";
        if (!delayUpdate)
            this.UpdateCommunication();
    }
    /**
     * Adds a File to the Message
     * @param filePath The File Path to the File to add to the Message
     */
    AddFile(filePath, delayUpdate = false) {
        var _a, _b;
        if (!fs_1.default.existsSync(filePath)) {
            console.log(`File does not exist : ${filePath}`);
            return;
        }
        if (!((_a = this.files) === null || _a === void 0 ? void 0 : _a.some(file => file === filePath)))
            (_b = this.files) === null || _b === void 0 ? void 0 : _b.push(filePath);
        if (!delayUpdate)
            this.UpdateCommunication();
    }
    /**
     * Adds a Message as a Text File to the Messages
     * @param content The Content of the Text File
     * @param fileName The File Name of the Text File to be uploaded
     */
    AddTextFile(content, fileName, delayUpdate = false) {
        var _a, _b;
        const buffer = Buffer.from(content, 'utf-8');
        const file = new discord_js_1.AttachmentBuilder(buffer, { name: `${fileName}.txt` });
        if (!((_a = this.files) === null || _a === void 0 ? void 0 : _a.some(file => file === file)))
            (_b = this.files) === null || _b === void 0 ? void 0 : _b.push(file);
        if (!delayUpdate)
            this.UpdateCommunication();
    }
    /**
     * Waiting Loop for the Message to be Received
     * @param count The Number of Times the Loop has Run through iterations
     */
    UpdateMessageLoop(count = 0) {
        var _a;
        if (count > BotCommunication.MAX_EDIT_ATTEMPTS)
            return console.log("Message has Taken too long to edit");
        if (this._MessageReceived)
            (_a = this.CommunicationInstance) === null || _a === void 0 ? void 0 : _a.edit(this);
        else
            setTimeout(() => { this.UpdateMessageLoop(count + 1); }, 100);
    }
}
/**
 * The Maximum Number of Minutes that the Response is valid for
 */
BotCommunication.MAX_RESPONSE_MINS = 15 * (1000 * 60);
/**
 * The Maximum Number of Edit Attempts for the Response
 */
BotCommunication.MAX_EDIT_ATTEMPTS = 50;
exports.default = BotCommunication;
