import '../scss/styles.scss'
import { RefereeSignalRClient, RoomEvent } from './referee-signalr-client.ts';

const ulEvents = document.getElementById("ul-events") as HTMLUListElement;
const textboxCommand = document.getElementById("textbox-command") as HTMLInputElement;
const btnSendCommand = document.getElementById("btn-send-command") as HTMLButtonElement;

textboxCommand.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    commitText();
  }
})

btnSendCommand.addEventListener("click", _ => commitText());

const refereeClient = new RefereeSignalRClient(addTextLine);
await refereeClient.start();

refereeClient.onPong((msg: string) => addTextLine(`PONG: ${msg}`));
refereeClient.onRoomEventLogged((ev: RoomEvent) => addTextLine(JSON.stringify(ev)));

function commitText() {
  if (textboxCommand.value == "") {
    return;
  }

  const fullCommand = textboxCommand.value.split(/\s+/);

  switch (fullCommand[0].toLowerCase()) {
    case "ping":
      refereeClient.ping(fullCommand.slice(1).join(" "));
      break;

    case "watch":
      refereeClient.startWatching(Number.parseInt(fullCommand[1]));
      break;

    case "unwatch":
      refereeClient.stopWatching(Number.parseInt(fullCommand[0]));
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