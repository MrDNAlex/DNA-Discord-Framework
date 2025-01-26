import ICommandHandler from "../Interfaces/ICommandHandler";
import CommandFactory from '../Commands/CommandFactory';
import Command from "../Commands/Command";
import BotCommandLog from "../Logging/BotCommandLog";
import CommandData from "../Data/CommandData";

/**
 * Default Command Handler used for empty and regular Discord Bot Commands
 */
class DefaultCommandHandler implements ICommandHandler {

    public async HandleCommand(commandData: CommandData): Promise<void> {

        if (!commandData.CommandInteraction)
            return console.log("Command Interaction is undefined");

        let Factory = await new CommandFactory(commandData.CommandInteraction.commandName);
        let command = await Factory.CreateCommand<Command>(commandData);

        if (command) {

            if (commandData.DataManager.IsBotCommandBlocked()) {
                command.IsEphemeralResponse = true;
                command.AddToMessage("Bot is busy, try the command again later.");
                return;
            }

            if (command.IsCommandBlocking)
                commandData.DataManager.BotCommandBlock();

            try {
                await command.RunCommand(commandData.BotClient, commandData.CommandInteraction, commandData.DataManager);
            } catch (error) {
                console.log("Error Running Command");
                console.log(error);                
                commandData.DataManager.BotCommandUnblock();
                if (error instanceof Error)
                    commandData.DataManager.AddErrorLog(error);
            }

            console.log("Command Finished");

            commandData.DataManager.BotCommandUnblock();
            const log: BotCommandLog = new BotCommandLog(commandData.CommandInteraction);
            if (command.Response)
                log.AddLogMessage(command.Response);
            commandData.DataManager.AddCommandLog(log);
        }
    }

    /**
     * Gets an Instance of the Default Command Handler
     * @returns Returns an Instance of the Default Command Handler
     */
    public static Instance(): DefaultCommandHandler {
        return new DefaultCommandHandler();
    }
}

export default DefaultCommandHandler;