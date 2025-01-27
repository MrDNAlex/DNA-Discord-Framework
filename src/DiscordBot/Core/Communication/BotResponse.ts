import { CacheType, ChatInputCommandInteraction, InteractionReplyOptions, InteractionEditReplyOptions, MessageFlagsString, BitFieldResolvable, MessageFlags,  } from "discord.js";
import BotCommunication from "./BotCommunication";
/**
 * The Message Object that is sent as a Response to the User when using a Command
 */
class BotResponse extends BotCommunication implements InteractionReplyOptions, InteractionEditReplyOptions  {

    /**
     * The Command Interaction that the Response is associated with
     */
    public CommandInteraction: ChatInputCommandInteraction<CacheType>;

    /**
     * Flags that indicate Interaction Message Features
     */
    //public flags?: BitFieldResolvable<Extract<MessageFlagsString, 'Ephemeral' | 'SuppressEmbeds' | 'SuppressNotifications'>, MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds | MessageFlags.SuppressNotifications>
    public flags?: number;

    constructor(commandInteraction: ChatInputCommandInteraction<CacheType>, isEphemeral: boolean = true) {
        super();
        this.CommandInteraction = commandInteraction;
        if (isEphemeral)
            this.flags = MessageFlags.Ephemeral;
    }

    /* <inheritdoc> */
    public UpdateCommunication(): void {
        let diff = (Date.now() - this.CreatedDate);

        if (diff > BotCommunication.MAX_RESPONSE_MINS)
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

export default BotResponse;