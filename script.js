const body = document.querySelector("body")
const displayBtn = document.getElementById("btn-display-toggle")

// Handlers for display settings

displayBtn.addEventListener("click", e => {
  body.getAttribute("data-display") === "dark"
    ? setDisplayMode("light")
    : setDisplayMode("dark")
  displayBtn.blur()
})

function setDisplayMode(displayMode) {
  sessionStorage.setItem("SPLITTER_DISPLAY_MODE", displayMode)
  body.setAttribute("data-display", displayMode)
}

function onLoad() {
  sessionStorage.getItem("SPLITTER_DISPLAY_MODE") === "dark"
    ? setDisplayMode("dark")
    : setDisplayMode("light")
}

onLoad()
