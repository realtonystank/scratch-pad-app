const optionsCont = document.querySelector(".options-cont");
const toolsCont = document.querySelector(".tools-cont");
const pencilToolCont = document.querySelector(".pencil-tool-cont");
const pencil = document.querySelector(".pencil");
const eraserToolCont = document.querySelector(".eraser-tool-cont");
const eraser = document.querySelector(".eraser");
const sticky = document.querySelector(".stickyNote");
const upload = document.querySelector(".upload");
// -------------------------------------------------------
let optionsFlag = true;
let pencilFlag = false;
let eraserFlag = false;

optionsCont.addEventListener("click", function (e) {
  optionsFlag = !optionsFlag;
  if (optionsFlag) showTools();
  else hideTools();
});

function showTools() {
  const iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  toolsCont.style.display = "flex";
}
function hideTools() {
  const iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "none";
  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", function (e) {
  pencilFlag = !pencilFlag;

  if (pencilFlag) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});

eraser.addEventListener("click", function (e) {
  eraserFlag = !eraserFlag;
  if (eraserFlag) {
    eraserToolCont.style.display = "flex";
  } else {
    eraserToolCont.style.display = "none";
  }
});

upload.addEventListener("click", function (e) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", function (e) {
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    const template = `
      <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
      </div>
      <div class="note-cont">
        <img src=${url}/>
      </div>
  `;
    createSticky(template);
  });
});

sticky.addEventListener("click", function (e) {
  const template = `
      <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
      </div>
      <div class="note-cont">
        <textarea cols="30" rows="10" spellcheck="false"></textarea>
      </div>
  `;
  createSticky(template);
});

// -------------------------------------------------------------

function createSticky(stickyTemplate) {
  const stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = stickyTemplate;
  document.body.appendChild(stickyCont);
  const dragSticky = stickyCont.querySelector(".header-cont");
  dragSticky.addEventListener("mousedown", () => {
    dragSticky.addEventListener("mousemove", onDrag);
  });
  document.addEventListener("mouseup", () => {
    dragSticky.removeEventListener("mousemove", onDrag);
  });

  function onDrag({ movementX, movementY }) {
    const getStyle = window.getComputedStyle(stickyCont);
    const left = parseInt(getStyle.left);
    const top = parseInt(getStyle.top);

    stickyCont.style.left = `${left + movementX}px`;
    stickyCont.style.top = `${top + movementY}px`;
  }

  const minimize = stickyCont.querySelector(".minimize");
  const remove = stickyCont.querySelector(".remove");
  noteActions(minimize, remove, stickyCont);
}

// -----------------------------------------------------------

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", () => {
    stickyCont.remove();
  });

  minimize.addEventListener("click", () => {
    const noteCont = stickyCont.querySelector(".note-cont");
    const display = window
      .getComputedStyle(noteCont)
      .getPropertyValue("display");
    if (display === "none") {
      noteCont.style.display = "block";
    } else {
      noteCont.style.display = "none";
    }
  });
}
