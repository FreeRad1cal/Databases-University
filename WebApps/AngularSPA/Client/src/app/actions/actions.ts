import { Action } from '@ngrx/store';
import { Pagination } from '../models/Pagination';

export enum RootActionTypes {
    SetGlobalBusy = '[Root] Set Global Busy',
    SetGlobalErrors = '[Root] Set Global Errors',
    NoOp = '[Root] NoOp',
    Paginate = '[Root] Paginate'
}

export class SetGlobalBusy implements Action {
    readonly type = RootActionTypes.SetGlobalBusy;

    constructor(public payload: {value: boolean}) {}
}

export class NoOp implements Action {
    readonly type = RootActionTypes.NoOp;
}

export class Paginate implements Action {
    readonly type = RootActionTypes.Paginate;

    constructor(public payload: { key: string, pagination: Pagination}) {}
}

export type RootActionsUnion = 
    SetGlobalBusy
    | NoOp
    | Paginate;