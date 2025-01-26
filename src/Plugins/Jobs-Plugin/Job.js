"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const SizeFormat_1 = __importDefault(require("./SizeFormat"));
const BashScriptRunner_1 = __importDefault(require("../Bash-Plugin/BashScriptRunner"));
class Job {
    constructor(jobName, jobAuthor) {
        this.JobName = jobName;
        this.ArchiveFile = `${this.JobName}Archive.tar.gz`;
        this.JobAuthor = jobAuthor;
        this.JobFinished = false;
        this.JobSuccess = true;
        this.StartTime = Date.now();
    }
    /* <inheritdoc> */
    get JobDirectory() {
        return this.JobManager.JobLibraryDirectory + "/" + this.JobName;
    }
    /* <inheritdoc> */
    get ArchiveDirectory() {
        return this.JobManager.ArchiveLibraryDirectory + "/" + this.JobName;
    }
    /* <inheritdoc> */
    RemoveDirectories() {
        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");
        if (this.ArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");
        if (fs_1.default.existsSync(this.JobDirectory))
            fs_1.default.rmSync(this.JobDirectory, { recursive: true, force: true });
        if (fs_1.default.existsSync(this.ArchiveDirectory))
            fs_1.default.rmSync(this.ArchiveDirectory, { recursive: true, force: true });
    }
    /* <inheritdoc> */
    CreateDirectories() {
        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");
        if (this.ArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");
        if (!fs_1.default.existsSync(this.JobDirectory))
            fs_1.default.mkdirSync(this.JobDirectory, { recursive: true });
        if (!fs_1.default.existsSync(this.ArchiveDirectory))
            fs_1.default.mkdirSync(this.ArchiveDirectory, { recursive: true });
    }
    /* <inheritdoc> */
    JobElapsedTime() {
        const now = Date.now();
        const elapsed = new Date(now - this.StartTime).getTime() / 1000;
        const weeks = Math.floor(elapsed / 604800);
        const days = Math.floor(elapsed / 86400) - weeks * 7;
        const hours = Math.floor(elapsed / 3600) - weeks * 168 - days * 24;
        const minutes = Math.floor(elapsed / 60) - weeks * 10080 - days * 1440 - hours * 60;
        const seconds = Math.floor(elapsed) - weeks * 604800 - days * 86400 - hours * 3600 - minutes * 60;
        if (weeks > 0)
            return `${weeks} w:${days} d:${hours} h:${minutes} m:${seconds} s`;
        else if (days > 0)
            return `${days} d:${hours} h:${minutes} m:${seconds} s`;
        else if (hours > 0)
            return `${hours} h:${minutes} m:${seconds} s`;
        else if (minutes > 0)
            return `${minutes} m:${seconds} s`;
        else
            return `${seconds} s`;
    }
    /* <inheritdoc> */
    DownloadFiles(attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!attachments)
                return;
            for (let i = 0; i < attachments.length; i++) {
                yield this.DownloadFile(attachments[i]);
            }
        });
    }
    /* <inheritdoc> */
    DownloadFile(attachement) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!attachement)
                return;
            console.log(`Downloading File: ${attachement.name}`);
            console.log(`Downloading File: ${attachement.url}`);
            console.log(`Downloading File: ${attachement.proxyURL}`);
            try {
                const response = yield (0, axios_1.default)({
                    method: 'GET',
                    url: attachement.url,
                    responseType: 'stream',
                });
                console.log(`Sent Axios Request`);
                let writer = fs_1.default.createWriteStream(`${this.JobDirectory}/${attachement.name}`);
                console.log(`Created Write Stream`);
                yield response.data.pipe(writer);
                console.log(`Piped Data`);
                return new Promise((resolve, reject) => {
                    console.log(`Returning Promise`);
                    writer.on('finish', () => {
                        console.log(`Finished Writing`);
                        resolve();
                    });
                    writer.on('error', reject);
                });
            }
            catch (error) {
                console.log(`Failed to download the file: ${error}`);
            }
        });
    }
    /* <inheritdoc> */
    CopyFilesToArchive() {
        fs_1.default.readdirSync(this.JobDirectory).forEach(file => {
            if (!fs_1.default.existsSync(`${this.ArchiveDirectory}/${file}`))
                try {
                    fs_1.default.copyFileSync(file, `${this.ArchiveDirectory}/${file}`, fs_1.default.constants.COPYFILE_EXCL);
                }
                catch (e) {
                    console.log(e);
                }
        });
    }
    /* <inheritdoc> */
    IsFileLarger(filePath, maxSize, sizeFormat) {
        if (!fs_1.default.existsSync(filePath))
            return false;
        let size = fs_1.default.statSync(filePath).size;
        if (size > maxSize * sizeFormat)
            return true;
        else
            return false;
    }
    SendFile(message_1, filePath_1, largeFileMessage_1) {
        return __awaiter(this, arguments, void 0, function* (message, filePath, largeFileMessage, maxFileSizeMB = 9.5) {
            var _a, _b, _c;
            if (!fs_1.default.existsSync(filePath))
                return;
            if (this.IsFileLarger(filePath, maxFileSizeMB, SizeFormat_1.default.MB)) {
                let outputFileMessage = largeFileMessage;
                if ((_a = message.content) === null || _a === void 0 ? void 0 : _a.includes(outputFileMessage))
                    return;
                let valIndex = (_b = message.files) === null || _b === void 0 ? void 0 : _b.indexOf(filePath);
                if (valIndex != -1 && typeof valIndex !== 'undefined')
                    (_c = message.files) === null || _c === void 0 ? void 0 : _c.splice(valIndex, 1);
                message.AddMessage(outputFileMessage);
            }
            else
                message.AddFile(filePath);
        });
    }
    /**
     * Creates the Compressed Archive File
     */
    ArchiveJob(dataManager) {
        return __awaiter(this, void 0, void 0, function* () {
            let runner = new BashScriptRunner_1.default();
            yield runner.RunLocally(`tar -zcvf  ${this.ArchiveDirectory}/${this.ArchiveFile} -C  ${this.JobManager.JobLibraryDirectory} ${this.JobName}`).catch(e => {
                console.log(`Failed to Archive Job: ${this.JobName}`);
                e.name += `: Archive Job (${this.JobName})`;
                dataManager.AddErrorLog(e);
            });
        });
    }
    /**
     * Pings the User that the Job has been Completed
     * @param message The Message related to the Job
     * @param jobsUser The User to send the Ping to
     * @param success Whether the Job was Successful or not
     */
    PingUser(message, jobsUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.JobSuccess)
                yield jobsUser.send(`${jobsUser} Bot has completed the ${this.JobManager.JobCategory} Job : ${this.JobName} :white_check_mark: \nIt can be found here : ${message.GetLink()}`);
            else
                yield jobsUser.send(`${jobsUser} Bot has encoutered a problem with the ${this.JobManager.JobCategory} Job : ${this.JobName} :warning:\nThe Job has been Terminated, check the Files for Errors.`);
        });
    }
    Setup(attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Removing Dir`);
            yield this.RemoveDirectories();
            console.log(`Create Dir`);
            yield this.CreateDirectories();
            console.log(`Download Files`);
            yield this.DownloadFiles(attachments);
            console.log(`Finished Setup`);
        });
    }
    SendArchive(message, tooLargeMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.SendFile(message, `${this.ArchiveDirectory}/${this.ArchiveFile}`, tooLargeMessage);
        });
    }
}
/* <inheritdoc> */
Job.JobSubdirectory = "Job";
/* <inheritdoc> */
Job.ArchiveSubdirectory = "Archive";
exports.default = Job;
