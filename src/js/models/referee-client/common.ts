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