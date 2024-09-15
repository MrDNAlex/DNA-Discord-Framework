"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BotCommunication_1 = __importDefault(require("./BotCommunication"));
/**
 * The Message Object that is sent as a Response to the User when using a Command
 */
class BotResponse extends BotCommunication_1.default {
    constructor(commandInteraction, isEphemeral = true) {
        super();
        this.CommandInteraction = commandInteraction;
        this.ephemeral = isEphemeral;
    }
    /* <inheritdoc> */
    UpdateCommunication() {
        let diff = (Date.now() - this.CreatedDate.getTime()) / 1000;
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
        // const attemptToAdd = () => {
        //
        //     if (this._MessageReceived)
        //         this.CommunicationInstance?.edit(this);
        //     else
        //         setTimeout(attemptToAdd, 100);
        // }
        //
        // attemptToAdd();
    }
}
exports.default = BotResponse;
