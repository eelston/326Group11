import { Place } from '../models/Location.ts'

export class CrowdingReport {
    // declare property types
    private _user_id: string;
    private _parent: Place; // associated location
    score: number;
    timestamp: number; // Date.now() returns a number

    constructor(user_id: string, parent: Place, score: number, timestamp: number) {
        this._user_id = user_id;
        this._parent = parent;
        this.score = score;
        this.timestamp = timestamp
    }

    get parent() {
        return this._parent;
    }
}
