import {Mod, CountdownType, MatchTeam, MatchType, MatchUserStatus, PlaylistItem, MatchState} from "./common";

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

export interface PlaylistItemAddedEvent extends RoomEvent
{
    playlist_item: PlaylistItem;
}

export interface PlaylistItemChangedEvent extends RoomEvent
{
    playlist_item: PlaylistItem;
}

export interface PlaylistItemRemovedEvent extends RoomEvent
{
    playlist_item_id: number;
}

export interface RollCompletedEvent extends RoomEvent
{
    user_id: number;
    max: number;
    result: number;
}

export interface RoomSettingsChangedEvent extends RoomEvent
{
    name: string;
    password: string;
    type: MatchType;
    playlist_item_id: number;
}

export interface MatchStateChangedEvent extends RoomEvent
{
    state: MatchState;
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

export interface UserBannedEvent extends RoomEvent
{
    banned_user_id: number;
    banning_user_id: number;
}

export interface UserLeftEvent extends RoomEvent
{
    user_id: number;
}

export interface RefereeAddedEvent extends RoomEvent
{
    user_id: number;
}

export interface RefereeRemovedEvent extends RoomEvent
{
    user_id: number;
}

export type RefereeInvitedEvent = RoomEvent;

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