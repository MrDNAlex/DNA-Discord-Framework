import { APIAttachment, Attachment, AttachmentBuilder, AttachmentPayload, BufferResolvable, InteractionResponse, JSONEncodable, Message, BaseMessageOptions, MessageMentionOptions, APIEmbed } from "discord.js";
import { Stream } from "stream";
import fs from "fs";


abstract class BotCommunication implements BaseMessageOptions { 

    /**
     * The Maximum Number of Minutes that the Response is valid for
     */
    public static MAX_RESPONSE_MINS: number = 15 * (1000 * 60);

    /**
     * The Maximum Number of Edit Attempts for the Response
     */
    public static MAX_EDIT_ATTEMPTS: number = 50;

    /**
     * The Date the Response was created
     */
    public CreatedDate: number = Date.now();

    /**
     * The Message Content of the Response 
     */
    public content?: string = "";

    /**
     * Discord Embeds inside the Message
     */
    public embeds?: readonly (JSONEncodable<APIEmbed> | APIEmbed)[];

    /**
     * Mention Options for the Message
     */
    public allowedMentions?: MessageMentionOptions;

    /**
     * The Files associated with the Response
     */
    public files?: (BufferResolvable | Stream | JSONEncodable<APIAttachment> | Attachment | AttachmentBuilder | AttachmentPayload)[] = [];

    /**
     * Boolean Flag to determine if the Message has been received/initialized and can be updated
     */
    protected _MessageInitialized: boolean = false;

    /**
     * Boolean Flag to determine if the Message has been received and Displayed to the User
     */
    protected _MessageReceived: boolean = false;

    /**
     * The Communication object that is sent to the User
     */
    public CommunicationInstance: InteractionResponse | Message<true> | undefined;

    /**
     * Gets the Link of the Communication Instance
     * @returns The Link of the Communication Instance
     */
    public GetLink(): string {
        this.UpdateCommunication();

        if (this.CommunicationInstance === undefined)
            return "No Link Available";

        if (this.CommunicationInstance instanceof InteractionResponse)
            return `https://discord.com/channels/${this.CommunicationInstance.interaction.guildId}/${this.CommunicationInstance.interaction.channelId}/${this.CommunicationInstance.id}`;

        if (this.CommunicationInstance instanceof Message)
            return `https://discord.com/channels/${this.CommunicationInstance.guildId}/${this.CommunicationInstance.channelId}/${this.CommunicationInstance.id}`;

        return "No Link Available";
    }

    /**
     * Adds Content to the Message as a new Line
     * @param content The String Content to add to the Message
     */
    public AddMessage(content: string, delayUpdate: boolean = false): void {
        this.content += content + "\n";

        if (!delayUpdate)
            this.UpdateCommunication();
    }

    /**
     * Adds a File to the Message
     * @param filePath The File Path to the File to add to the Message
     */
    public AddFile(filePath: string, delayUpdate: boolean = false): void {
        if (!fs.existsSync(filePath)) {
            console.log(`File does not exist : ${filePath}`);
            return;
        }

        if (!this.files?.some(file => file === filePath))
            this.files?.push(filePath);

        if (!delayUpdate)
            this.UpdateCommunication();
    }

    /**
     * Adds a Message as a Text File to the Messages
     * @param content The Content of the Text File
     * @param fileName The File Name of the Text File to be uploaded
     */
    public AddTextFile(content: string, fileName: string, delayUpdate: boolean = false): void {
        const buffer = Buffer.from(content, 'utf-8');
        const file = new AttachmentBuilder(buffer, { name: `${fileName}.txt` });

        if (!this.files?.some(file => file === file))
            this.files?.push(file);

        if (!delayUpdate)
            this.UpdateCommunication();
    }

    /**
     * Updates the Communication Instance with the new Message Content and Files
     */
    public abstract UpdateCommunication(): void;

    /**
     * Waiting Loop for the Message to be Received
     * @param count The Number of Times the Loop has Run through iterations
     */
    protected UpdateMessageLoop(count: number = 0): void {
        if (count > BotCommunication.MAX_EDIT_ATTEMPTS)
            return console.log("Message has Taken too long to edit");

        if (this._MessageReceived)
            this.CommunicationInstance?.edit(this);
        else
            setTimeout(() => { this.UpdateMessageLoop(count + 1); }, 100);
    }
}

export default BotCommunication;