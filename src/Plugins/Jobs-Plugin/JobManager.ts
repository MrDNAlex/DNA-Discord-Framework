import SSHManager from "../SSH-Plugin/SSHManager";
import SyncInfo from "../SSH-Plugin/SyncInfo";
import Job from "./Job";


abstract class JobManager {

    /* <inheritdoc> */
    abstract JobGlobalDirectory: string;

    public abstract JobCategory: string;

    public abstract HostArchiveDirectory: string;

    public abstract HostJobDirectory: string;

    constructor() {
        //this.SetDirectories();
    }

    //SetDirectories() {
    //    this.JobLibraryDirectory = `${this.JobGlobalDirectory}/${this.JobCategory}/${Job.JobSubdirectory}`;
    //    this.ArchiveLibraryDirectory = `${this.JobGlobalDirectory}/${this.JobCategory}/${Job.ArchiveSubdirectory}`;
    //}

    /* <inheritdoc> */
    get JobLibraryDirectory(): string {
        if (!this.ValidPathValues())
            return "";

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory;
    }

    ///* <inheritdoc> */
    get ArchiveLibraryDirectory(): string {
        if (!this.ValidPathValues())
            return "";

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory;
    }

    /* <inheritdoc> */
    private ValidPathValues(): boolean {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set, Set the value of JobCategory in the Class");

        return true;
    }

    /**
   * Creates the SCP Copy Command for the User to Copy and use in their Terminal
   * @param fileName The Name of the File to Copy
   * @returns The SCP Copy Command to Download the File
   */
    //abstract GetCopyCommand(job: Job): string;

    GetArchiveSyncCommand(syncInfo: SyncInfo, destinationPath: string): string {
        return SSHManager.GetSCPCommand(syncInfo, this.HostArchiveDirectory, destinationPath, true);
    }

    GetHostArchiveCopyCommand(syncInfo: SyncInfo, jobName: string, destinationPath: string): string {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return SSHManager.GetSCPCommand(syncInfo, path, destinationPath, true);
    }

    GetHostJobCopyCommand(syncInfo: SyncInfo, jobName: string, destinationPath: string): string {
        const path = this.HostJobDirectory + "/" + jobName;
        return SSHManager.GetSCPCommand(syncInfo, path, destinationPath, true);
    }

    //abstract GetHostArchiveCopyCommand(syncInfo: SyncInfo, jobName: string, destinationPath: string): string;

    //abstract GetHostJobCopyCommand(syncInfo: SyncInfo, jobName: string, destinationPath: string): string;

    //abstract GetHostArchiveCopyCommand(scpInfo: SCPInfo, jobName : string): string;

    //abstract GetHostJobCopyCommand(scpInfo: SCPInfo, jobName : string): string;



}

export default JobManager;