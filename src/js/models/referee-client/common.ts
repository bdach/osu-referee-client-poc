export enum MatchType
{
    HeadToHead = "head_to_head",
    TeamVersus = "team_versus",
}

export interface Mod
{
    acronym: string;
    settings: Partial<Record<string, boolean | number | string>>;
}

export enum MatchTeam
{
    Blue = 'blue',
    Red = 'red',
}

export const Ruleset: Partial<Record<number, string>> =
{
    0: "osu!",
    1: "taiko",
    2: "catch",
    3: "mania"
}

export enum CountdownType
{
    MatchStart = "match_start",
    ServerShuttingDown = "server_shutting_down",
}

export enum MatchUserStatus
{
    Idle = 'idle',
    Ready = 'ready',
    Playing = 'playing',
    FinishedPlay = 'finished_play',
    Spectating = 'spectating',
}

export interface PlaylistItem
{
    id: number;
    ruleset_id: keyof typeof Ruleset;
    beatmap_id: number;
    required_mods: Mod[];
    allowed_mods: Mod[];
    freestyle: boolean;
    was_played: boolean;
    order: number;
}

export interface Player
{
    user_id: number;
    status: MatchUserStatus;
    style: Style;
    mods: Mod[];
    team?: MatchTeam | null;
}

export interface Referee
{
    user_id: number;
}

export interface Style
{
    ruleset_id?: keyof typeof Ruleset | null;
    beatmap_id?: number | null;
}

export interface MatchState
{
    type: MatchType;
}

export interface TeamVersusRoomState extends MatchState
{
    type: MatchType.TeamVersus;
    locked: boolean;
}