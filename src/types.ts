export interface Agency {
    _id: string;
    routeNo: string;
    description: string;
    agencyNo: string;
    person: string;
    coverImage: string;
    file: string;
    createdAt: string;
    lastCalibrationDates: Date[]; // Array of date objects
}
