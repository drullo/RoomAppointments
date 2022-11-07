export interface DirectoryEntry {
    displayName?: string;
    distinguishedName: string;
    mail?: string;
    memberOf?: string[];
    name?: string;
    sAMAccountName: string;
    telephoneNumber?: string;
    whenCreated: Date;
}
