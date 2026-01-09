import '../scss/styles.scss'
import {
  APIMod,
  MatchType,
  RefereeSignalRClient,
  RoomEvent,
} from './referee-signalr-client.ts';

const ulEvents = document.getElementById("ul-events") as HTMLUListElement;
const textboxCommand = document.getElementById("textbox-command") as HTMLInputElement;
const btnSendCommand = document.getElementById("btn-send-command") as HTMLButtonElement;
const btnLogOut = document.getElementById("btn-log-out") as HTMLButtonElement;

let refereeClient: RefereeSignalRClient | undefined = undefined;

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("code"))
{
  refereeClient = new RefereeSignalRClient(addTextLine, urlParams.get("code")!);
  await refereeClient.start();

  refereeClient.onPong((msg: string) => addTextLine(`PONG: ${msg}`));
  refereeClient.onRoomEventLogged((ev: RoomEvent) =>
    addTextLine(JSON.stringify(ev)),
  );

  textboxCommand.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      commitText();
    }
  });
  btnSendCommand.addEventListener('click', (_) => commitText());
  btnLogOut.addEventListener('click', (_) => window.location.search = "");
}
else
{
  textboxCommand.setAttribute("disabled", "disabled");
  btnSendCommand.setAttribute("disabled", "disabled");
  btnLogOut.setAttribute("disabled", "disabled");

  const node = document.createElement("li");

  const url = new URL(import.meta.env.VITE_WEB_OAUTH_AUTHORIZE_URL);
  const params = url.searchParams;
  params.append("client_id", import.meta.env.VITE_WEB_CLIENT_ID);
  params.append("redirect_uri", "http://localhost:5173");
  params.append("response_type", "code");
  params.append("scope", "public multiplayer.write");

  node.innerHTML = `<a href="${url.toString()}">Please log in with osu! to continue.</a>`
  node.classList.add('list-group-item');
  node.classList.add('list-group-item-primary');
  ulEvents.appendChild(node);
}

function commitText() {
  if (textboxCommand.value == "") {
    return;
  }

  const fullCommand = textboxCommand.value.split(/\s+/);

  switch (fullCommand[0].toLowerCase()) {
    case "ping":
      refereeClient?.ping(fullCommand.slice(1).join(" "));
      break;

    case "make":
      refereeClient?.makeRoom(Number.parseInt(fullCommand[1]), Number.parseInt(fullCommand[2]), fullCommand.slice(3).join(" "));
      break;

    case "close":
      refereeClient?.closeRoom(Number.parseInt(fullCommand[1]));
      break;

    case "name":
      refereeClient?.setRoomName(Number.parseInt(fullCommand[1]), fullCommand.slice(2).join(" "));
      break;

    case "password":
      refereeClient?.setRoomPassword(Number.parseInt(fullCommand[1]), fullCommand.slice(2).join(" "));
      break;

    case "matchtype":
      // this bad but i cant figure out what TS doesnt like about it
      const type: any = MatchType[fullCommand[2] as any];
      if (type != null)
        refereeClient?.setMatchType(Number.parseInt(fullCommand[1]), type);
      break;

    case "add":
      refereeClient?.invitePlayer(Number.parseInt(fullCommand[1]), Number.parseInt(fullCommand[2]));
      break;

    case "host":
      refereeClient?.setHost(Number.parseInt(fullCommand[1]), Number.parseInt(fullCommand[2]));
      break;

    case "kick":
      refereeClient?.kickUser(Number.parseInt(fullCommand[1]), Number.parseInt(fullCommand[2]));
      break;

    case "map":
      const roomId = Number.parseInt(fullCommand[1]);
      const beatmapId = Number.parseInt(fullCommand[2]);
      const rulesetId: number | undefined = fullCommand.length > 3 ? Number.parseInt(fullCommand[3]) : undefined;
      refereeClient?.setBeatmap(roomId, beatmapId, rulesetId);
      break;

    case "mods":
      const mods = JSON.parse(fullCommand[2]) as APIMod[];
      if (mods != null)
        refereeClient?.setRequiredMods(Number.parseInt(fullCommand[1]), mods);
      break;

    case "freemods":
      const freeMods = JSON.parse(fullCommand[2]) as APIMod[];
      if (freeMods != null)
        refereeClient?.setAllowedMods(Number.parseInt(fullCommand[1]), freeMods);
      break;

    case "freestyle":
      refereeClient?.setFreestyle(Number.parseInt(fullCommand[1]), fullCommand[2] == "1"); // lol. lmao even
      break;

    case "start":
      refereeClient?.startGameplay(Number.parseInt(fullCommand[1]), fullCommand.length > 2 ? Number.parseInt(fullCommand[2]) : undefined);
      break;

    case "aborttimer":
      refereeClient?.abortGameplayCountdown(Number.parseInt(fullCommand[1]));
      break;

    case "abort":
      refereeClient?.abortGameplay(Number.parseInt(fullCommand[1]));
      break;
  }

  textboxCommand.value = "";
}

type BootstrapListItemType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

function addTextLine(text: string, type?: BootstrapListItemType) {
  const node = document.createElement("li");
  node.innerText = text;
  node.classList.add("list-group-item")
  if (type !== undefined) {
    node.classList.add(`list-group-item-${type}`);
  }

  ulEvents.appendChild(node);
  while (ulEvents.childElementCount > 15)
    ulEvents.removeChild(ulEvents.children[0]);
}