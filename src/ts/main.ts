import '../scss/styles.scss'

const ulEvents = document.getElementById("ul-events") as HTMLUListElement;
const textboxCommand = document.getElementById("textbox-command") as HTMLInputElement;
const btnSendCommand = document.getElementById("btn-send-command") as HTMLButtonElement;

textboxCommand.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    commitText();
  }
})

btnSendCommand.addEventListener("click", _ => commitText());

function commitText() {
  if (textboxCommand.value == "") {
    return;
  }

  addTextLine(textboxCommand.value);
  textboxCommand.value = "";
}

function addTextLine(text: string, type?: string) {
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