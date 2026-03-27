import {Mod, MatchTeam, MatchType} from "./common";

export interface ChangeRoomSettingsRequest
{
    name?: string;
    password?: string;
    type?: MatchType;
    max_participants?: number | null;
}

interface EditPlaylistItemRequestParams
{
    ruleset_id?: number;
    beatmap_id?: number;
    required_mods?: Mod[];
    allowed_mods?: Mod[];
    freestyle?: boolean;
}

export type EditCurrentPlaylistItemRequest = EditPlaylistItemRequestParams;

export interface AddPlaylistItemRequest
{
    ruleset_id: number;
    beatmap_id: number;
    required_mods: Mod[];
    allowed_mods: Mod[];
    freestyle: boolean;
}

export interface EditPlaylistItemRequest extends EditPlaylistItemRequestParams
{
    playlist_item_id: number;
}

export interface RemovePlaylistItemRequest
{
    playlist_item_id: number;
}

export interface RollRequest
{
    max: number;
}

export interface MakeRoomRequest
{
    ruleset_id: number;
    beatmap_id: number;
    name: string;
    max_participants?: number;
}

export interface MoveUserRequest
{
    user_id: number;
    team?: MatchTeam | null;
    slot?: number | null;
}

export interface SetLockStateRequest
{
    locked: boolean;
}

export interface StartMatchRequest
{
    countdown: number | null;
}