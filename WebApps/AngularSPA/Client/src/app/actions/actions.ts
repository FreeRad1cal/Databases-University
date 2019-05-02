import { Action } from '@ngrx/store';

export enum RootActionTypes {
    SetGlobalBusy = '[Root] Set Global Busy',
    SetGlobalErrors = '[Root] Set Global Errors',
    NoOp = '[Root] NoOp'
}

export class SetGlobalBusy implements Action {
    readonly type = RootActionTypes.SetGlobalBusy;

    constructor(public payload: {value: boolean}) {}
}

export class NoOp implements Action {
    readonly type = RootActionTypes.NoOp;
}

export type RootActionsUnion = 
    SetGlobalBusy
    | NoOp;