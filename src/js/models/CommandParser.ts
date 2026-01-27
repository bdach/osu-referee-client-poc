import RefereeClient from "./RefereeClient";

export default class CommandParser
{
    private client: RefereeClient;

    constructor(client: RefereeClient)
    {
        this.client = client;
    }

    execute(command: string)
    {
        const split = command.split(/\s+/);

        switch (split[0].toLowerCase()) {
            case "ping":
                return this.client.ping(split.slice(1).join(' '));

            default:
                break;
        }
    }
}