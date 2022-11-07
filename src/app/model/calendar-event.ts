import { EmailAddress } from "./email-address";

export interface CalendarEvent {
    attendees: Attendee[];

    body: {
        content: string;
        contentType: number; // 0=text, 1=html
    };

    bodyPreview: string;

    categories: string[];
    changeKey: string;
    createdDateTime: Date;
    end: Date;
    hasAttachments: boolean;
    hideAttendees: boolean;
    id: string;
    importance: number; // 0=low, 1=normal, 2=high
    isAlLDay: boolean;
    isCancelled: boolean;
    isDraft: boolean;
    isOnlineMeeting: boolean;
    isOrganizer: boolean;
    isReminderOn: boolean;
    lastModifiedDateDate: Date;
    location: Location;
    locations: Location[];
    onlineMeeting: OnlineMeetingInfo;
    onlineMeetingProvider: number; // unknown, teamsForBusiness, skypeForBusiness, and skypeForConsumer
    onlineMeetingUrl: string;
    organizer: Recipient;
    originalEndTimeZone: string;
    originalStart: Date;
    originalStartTimeZone: string;
    recurrence: PatternedRecurrence;
    reminderMinutesBeforeStart: number;
    responseRequested: boolean;
    responseStatus: ResponseStatus;
    sensitivity: string; // normal, personal, private, confidential
    seriesMasterId: string;
    showAs: string; // free, tentative, busy, oof, workingElsewhere, unknown
    start: Date;
    subject: string;
    transactionId: string;
    type: string;
    webLink: string;

    //#region Not real MS Graph properties - UtilityApi populates these
    isHappeningNow: boolean;
    isToday: boolean;
    spansMultipleDays: boolean;
    //#endregion
}
export interface Attendee {
    emailAddress: EmailAddress;
    proposedNewTime: {
        end: Date;
        start: Date;
    };
    status: {
        response: string;
        time: Date;
    };
    type: number; // required, optional, resource
}
export interface Location {
    address: Address;
    coordinates: Coordinates;
    displayName: string;
    locationEmailAddress: string;
    locationUri: string;
    locationType: number; // default, conferenceRoom, homeAddress, businessAddress, geoCoordinates, streetAddress, hotel, restaurant, localBusiness, postalAddress
    uniqueId: string;
    uniqueIdType: number;
}
export interface Address {
    city: string;
    countryOrRegion: string;
    postalCode: string;
    state: string;
    street: string;
}
export interface Coordinates {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    latitude: number;
    longitude: number;
}
export interface Recipient {
    emailAddress: EmailAddress;
}
export interface ResponseStatus {
    response: string;
    time: Date;
}
export interface PatternedRecurrence {
    pattern: RecurrencePattern;
    range: RecurrenceRange;
}
export interface RecurrencePattern {
    dayOfMonth: number;
    daysOfWeek: string[];
    firstDayOfWeek: string;
    index: number; // first, second, third, fourth, last
    interval: number;
    month: number;
    type: number; // daily, weekly, absoluteMonthly, relativeMonthly, absoluteYearly, relativeYearly
}
export interface RecurrenceRange {
    endDate: Date;
    numberOfOccurrences: number;
    recurrenceTimeZone: string;
    startDate: Date;
    type: number; // endDate, noEnd, numbered
}
export interface OnlineMeetingInfo {
    conferenceId: string;
    joinUrl: string;
    phones: Phone[];
    quickDial: string;
    tollFreeNumbers: string[];
    tollNumber: string;
}
export interface Phone {
    number: string;
    type: number; // home, business, mobile, other, assistant, homeFax, businessFax, otherFax, pager, radio
}