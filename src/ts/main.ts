import '../scss/styles.scss'
import { RefereeSignalRClient, RoomEvent } from './referee-signalr-client.ts';

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
      refereeClient?.makeRoom(fullCommand.slice(1).join(" "));
      break;

    case "close":
      refereeClient?.closeRoom();
      break;

    case "add":
      refereeClient?.invitePlayer(Number.parseInt(fullCommand[1]));
      break;

    case "kick":
      refereeClient?.kickUser(Number.parseInt(fullCommand[1]));
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