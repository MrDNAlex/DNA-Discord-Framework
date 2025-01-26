import ILogMessage from '../Interfaces/ILogMessage';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import BotCommunication from '../Communication/BotCommunication';

/**
 * Class representing an instance of a Discord Bot Log
 */
class BotCommandLog implements ILogMessage {

    /* <inheritdoc */
    public User: string;

    /* <inheritdoc */
    public LogMessage: string;

    /* <inheritdoc */
    public LogCommand: string;

    /* <inheritdoc */
    public LogDate: Date;

    /* <inheritdoc */
    constructor(interaction: ChatInputCommandInteraction<CacheType>) {
        this.User = interaction.user.username;
        this.LogCommand = interaction.commandName;
        this.LogMessage = "";
        this.LogDate = new Date();
    }

    /**
     * Adds an additional message to the Log Instance
     * @param message Message to add to the Log
     */
    public AddLogMessage(message: BotCommunication) {
        if (message.content)
            this.LogMessage = message.content;
    }
}

export default BotCommandLog;