export interface InOutStatus {
    sAMAccountName: string;
    notes?: string;
    lastStatusChangeTime: Date;
    statusChangedBy?: string;
    status: {
        rowID: number,
        description: string;
    };
}
