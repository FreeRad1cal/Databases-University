import { Action } from '@ngrx/store';

export enum RootActionTypes {
    SetGlobalBusy = '[Root] Set Global Busy'
}

export class SetGlobalBusy implements Action {
    readonly type = RootActionTypes.SetGlobalBusy;

    constructor(public payload: {value: boolean}) {}
}

export type RootActionsUnion = 
    SetGlobalBusy;