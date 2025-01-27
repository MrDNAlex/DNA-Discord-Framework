"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BotCommunication_1 = __importDefault(require("./BotCommunication"));
/**
 * The Message Object that is sent as a Response to the User when using a Command
 */
class BotResponse extends BotCommunication_1.default {
    constructor(commandInteraction, isEphemeral = true) {
        super();
        this.CommandInteraction = commandInteraction;
        if (isEphemeral)
            this.flags = discord_js_1.MessageFlags.Ephemeral;
    }
    /* <inheritdoc> */
    UpdateCommunication() {
        let diff = (Date.now() - this.CreatedDate);
        if (diff > BotCommunication_1.default.MAX_RESPONSE_MINS)
            return console.log("Response has Taken too long, it's been over 15 minutes");
        if (this._MessageInitialized == false) {
            this._MessageInitialized = true;
            this.CommandInteraction.reply(this).then((message) => {
                this.CommunicationInstance = message;
                this._MessageReceived = true;
            });
            return;
        }
        this.UpdateMessageLoop();
    }
}
exports.default = BotResponse;
