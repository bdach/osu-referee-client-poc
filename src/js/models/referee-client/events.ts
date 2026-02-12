import {Mod, CountdownType, MatchTeam, MatchType} from "./common";

export interface RoomEvent
{
    room_id: number;
}

export interface CountdownStartedEvent extends RoomEvent
{
    countdown_id: number;
    seconds: number;
    type: CountdownType;
}

export interface CountdownStoppedEvent extends RoomEvent
{
    countdown_id: number;
    type: CountdownType;
}

export interface MatchAbortedEvent extends RoomEvent
{
    playlist_item_id: number;
}

export interface MatchCompletedEvent extends RoomEvent
{
    playlist_item_id: number;
}

export interface MatchStartedEvent extends RoomEvent
{
    playlist_item_id: number;
    type: MatchType;
    teams: null | Partial<Record<number, MatchTeam>>;
}

export interface PlaylistItemChangedEvent extends RoomEvent
{
    playlist_item_id: number;
    ruleset_id: number;
    beatmap_id: number;
    required_mods: Mod[];
    allowed_mods: Mod[];
    freestyle: boolean;
    expired: boolean;
}

export interface RoomSettingsChangedEvent extends RoomEvent
{
    name: string;
    password: string;
    type: MatchType;
    playlist_item_id: number;
}

export interface UserJoinedEvent extends RoomEvent
{
    user_id: number;
}

export interface UserKickedEvent extends RoomEvent
{
    kicked_user_id: number;
    kicking_user_id: number;
}

export interface UserLeftEvent extends RoomEvent
{
    user_id: number;
}

export interface UserModsChangedEvent extends RoomEvent
{
    user_id: number;
    mods: Mod[];
}

export interface UserStatusChangedEvent extends RoomEvent
{
    user_id: number;
    status: MatchUserStatus;
}

export enum MatchUserStatus
{
    Idle = 'idle',
    Ready = 'ready',
    Playing = 'playing',
    FinishedPlay = 'finished_play',
    Spectating = 'spectating',
}

export interface UserStyleChangedEvent extends RoomEvent
{
    user_id: number;
    beatmap_id: number | null;
    ruleset_id: number | null;
}

export interface UserTeamChangedEvent extends RoomEvent
{
    user_id: number;
    team: MatchTeam;
}