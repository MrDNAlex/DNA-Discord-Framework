import axios from "axios";
import IJob from "./IJob";
import fs from "fs";
import { Attachment, User } from "discord.js";
import JobManager from "./JobManager";
import SizeFormat from "./SizeFormat";
import BotCommunication from "../../DiscordBot/Core/Communication/BotCommunication";
import BotDataManager from "../../DiscordBot/Core/Data/BotDataManager";
import BashScriptRunner from "../Bash-Plugin/BashScriptRunner";

abstract class Job implements IJob {

    /* <inheritdoc> */
    public abstract JobManager: JobManager;

    /* <inheritdoc> */
    public static JobSubdirectory: string = "Job";

    /* <inheritdoc> */
    public static ArchiveSubdirectory: string = "Archive";

    /* <inheritdoc> */
    public JobName: string;

    /* <inheritdoc> */
    public StartTime: number;

    /* <inheritdoc> */
    public JobAuthor: string;

    /* <inheritdoc> */
    public JobFinished: boolean;

    /* <inheritdoc> */
    public JobSuccess: boolean;

    public ArchiveFile: string;

    constructor(jobName: string, jobAuthor: string) {
        this.JobName = jobName;
        this.ArchiveFile = `${this.JobName}Archive.tar.gz`;
        this.JobAuthor = jobAuthor;
        this.JobFinished = false;
        this.JobSuccess = true;
        this.StartTime = Date.now();
    }

    /* <inheritdoc> */
    public abstract JobResourceUsage(): Record<string, number>;

    /* <inheritdoc> */
    public abstract RunJob(): Promise<void>;

    /* <inheritdoc> */
    get JobDirectory(): string {
        return this.JobManager.JobLibraryDirectory + "/" + this.JobName;
    }

    /* <inheritdoc> */
    get ArchiveDirectory(): string {
        return this.JobManager.ArchiveLibraryDirectory + "/" + this.JobName;
    }

    /* <inheritdoc> */
    public RemoveDirectories(): void {
        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");

        if (this.ArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");

        if (fs.existsSync(this.JobDirectory))
            fs.rmSync(this.JobDirectory, { recursive: true, force: true });

        if (fs.existsSync(this.ArchiveDirectory))
            fs.rmSync(this.ArchiveDirectory, { recursive: true, force: true });
    }


    /* <inheritdoc> */
    public CreateDirectories() {
        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");

        if (this.ArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");

        if (!fs.existsSync(this.JobDirectory))
            fs.mkdirSync(this.JobDirectory, { recursive: true });

        if (!fs.existsSync(this.ArchiveDirectory))
            fs.mkdirSync(this.ArchiveDirectory, { recursive: true });
    }

    /* <inheritdoc> */
    public JobElapsedTime(): string {
        const now = Date.now();
        const elapsed = new Date(now - this.StartTime);
        const hours = elapsed.getUTCHours();
        const minutes = elapsed.getUTCMinutes();
        const seconds = elapsed.getUTCSeconds();

        if (hours > 0)
            return `${hours} h:${minutes} m:${seconds} s`;
        else if (minutes > 0)
            return `${minutes} m:${seconds} s`;
        else
            return `${seconds} s`;
    }

    /* <inheritdoc> */
    public async DownloadFiles(attachments: (Attachment | null)[]) {

        if (!attachments)
            return

        for (let i = 0; i < attachments.length; i++) {
            await this.DownloadFile(attachments[i]);
        }
    }

    /* <inheritdoc> */
    public async DownloadFile(attachement: Attachment | null) {
        if (!attachement)
            return

        try {
            const response = await axios({
                method: 'GET',
                url: attachement.url,
                responseType: 'stream',
            });

            let writer = fs.createWriteStream(`${this.JobDirectory}/${attachement.name}`);

            await response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }

    /* <inheritdoc> */
    public CopyFilesToArchive() {
        fs.readdirSync(this.JobDirectory).forEach(file => {
            if (!fs.existsSync(`${this.ArchiveDirectory}/${file}`))
                try {
                    fs.copyFileSync(file, `${this.ArchiveDirectory}/${file}`, fs.constants.COPYFILE_EXCL);
                } catch (e) { console.log(e); }
        });
    }

    /* <inheritdoc> */
    IsFileLarger(filePath: string, maxSize: number, sizeFormat: SizeFormat): boolean {
        if (!fs.existsSync(filePath))
            return false;

        let size = fs.statSync(filePath).size;

        if (size > maxSize * sizeFormat)
            return true;
        else
            return false;
    }

    public async SendFile(message: BotCommunication, filePath: string, largeFileMessage: string, maxFileSizeMB: number = 9.5): Promise<void> {
        if (!fs.existsSync(filePath))
            return

        if (this.IsFileLarger(filePath, maxFileSizeMB, SizeFormat.MB)) {
            let outputFileMessage = largeFileMessage;

            if (message.content?.includes(outputFileMessage))
                return;

            let valIndex = message.files?.indexOf(filePath);
            if (valIndex != -1 && typeof valIndex !== 'undefined')
                message.files?.splice(valIndex, 1);
            message.AddMessage(outputFileMessage);
        }
        else
            message.AddFile(filePath);
    }

    /**
     * Creates the Compressed Archive File
     */
    public async ArchiveJob(dataManager: BotDataManager): Promise<void> {
        let runner = new BashScriptRunner();
        await runner.RunLocally(`tar -zcvf  ${this.ArchiveDirectory}/${this.ArchiveFile} -C  ${this.JobManager.JobLibraryDirectory} ${this.JobName}`).catch(e => {
            console.log(`Failed to Archive Job: ${this.JobName}`);
            e.name += `: Archive Job (${this.JobName})`;
            dataManager.AddErrorLog(e);
        });
    }

    /**
     * Pings the User that the Job has been Completed
     * @param message The Message related to the Job
     * @param jobsUser The User to send the Ping to
     * @param success Whether the Job was Successful or not
     */
    public async PingUser(message: BotCommunication, jobsUser: User): Promise<void> {
        if (this.JobSuccess)
            await jobsUser.send(`${jobsUser} Server has completed the Orca Calculation ${this.JobName} :white_check_mark: \n It can be found here : ${message.GetLink()}`);
        else
            await jobsUser.send(`${jobsUser} Server has encoutered a problem with the Orca Calculation ${this.JobName} :warning:\nThe Job has been Terminated, check the Output File for Errors. \nIt can be found here : ${message.GetLink()}`);
    }

    public async Setup (attachments: (Attachment | null)[]) : Promise<void> {
        await this.RemoveDirectories();
        await this.CreateDirectories();
        await this.DownloadFiles(attachments);
    }

    public async SendArchive(message: BotCommunication, tooLargeMessage: string): Promise<void> {
        await this.SendFile(message, `${this.ArchiveDirectory}/${this.ArchiveFile}`, tooLargeMessage);
    }
}

export default Job;