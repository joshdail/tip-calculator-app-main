const body = document.querySelector("body")

// Class / regex constants

const classDisabled = "disabled"
const classInvalid = "invalid"
const queryInputRadio = 'input[type="radio"]'
const queryInputRadioLabel = "label.btn.btn-primary"
const regexNumeralsDecimalsOnly = /[^0-9.]/g
const regexNumeralsOnly = /[^0-9]/g

// Light/dark display control

const displayBtn = document.getElementById("btn-display-toggle")

// Bill / Number of people inputs

const billInput = document.getElementById("bill")
const peopleInput = document.getElementById("people")

// Alerts

const billErrorAlert = document.getElementById("alert-bill-error")
const tipErrorAlert = document.getElementById("alert-tip-error")
const peopleErrorAlert = document.getElementById("alert-people-error")

// Tip percentage buttons/inputs

const tipOptionsFieldset = document.getElementById("tip-options")
const fivePercentBtn = document.getElementById("5")
const tenPercentBtn = document.getElementById("10")
const fifteenPercentBtn = document.getElementById("15")
const twentyPercentBtn = document.getElementById("25")
const fiftyPercentBtn = document.getElementById("50")
const customPercentBtn = document.getElementById("custom")

// Outputs

const tipDisplay = document.getElementById("display-tip")
const totalDisplay = document.getElementById("display-total")

// Reset button

const resetBtn = document.getElementById("btn-reset")

// Event listeners (bill, number of people)

billInput.addEventListener("input", e => {
  const filteredInput = billInput.value.replace(regexNumeralsDecimalsOnly, "")
  // Force the input value to two decimals
  const inputValue =
    filteredInput.indexOf(".") >= 0
      ? filteredInput.substr(0, filteredInput.indexOf(".") + 1) +
        filteredInput.substr(filteredInput.indexOf(".") + 1, 2).replace(".", "")
      : filteredInput
  billInput.value = inputValue

  const billAmount = Number(inputValue)

  if (billAmount === 0 && billInput.value !== "") {
    handleBillError("Can't be zero")
    return
  }

  billInput.classList.remove(classInvalid)
  billErrorAlert.innerText = ""
})

function handleBillError(message) {
  billInput.classList.add(classInvalid)
  billErrorAlert.innerText = message
}

peopleInput.addEventListener("input", e => {
  const inputValue = peopleInput.value
    .replace(regexNumeralsOnly, "")
    .substr(0, 3)
  peopleInput.value = inputValue

  const peopleCount = Number(inputValue)

  if (peopleCount === 0 && peopleInput.value !== "") {
    handlePeopleError("Can't be zero")
    return
  }

  peopleInput.classList.remove(classInvalid)
  peopleErrorAlert.innerText = ""
})

function handlePeopleError(message) {
  peopleInput.classList.add(classInvalid)
  peopleErrorAlert.innerText = message
}

// Event listeners (tip amounts)

tipOptionsFieldset.addEventListener("click", e => {
  handleRadioEvent(e)
})

// Make radio buttons keyboard accessible
tipOptionsFieldset.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    handleRadioEvent(e)
  }
})

function handleRadioEvent(e) {
  console.log(e.target)
  if (e.target === customPercentBtn) {
    unsetAllRadios()
  }
  if (e.target.matches(queryInputRadio)) {
    calculateTip(Number(e.target.value))
  }
  // Check for enter key pressed on radio buttons
  if (e.target.matches(queryInputRadioLabel)) {
    const valueString = e.target.innerText.slice(0, -1)
    calculateTip(Number(valueString))
  }
}

customPercentBtn.addEventListener("input", e => {
  const inputValue = customPercentBtn.value
    .replace(regexNumeralsOnly, "")
    .substr(0, 2)
  customPercentBtn.value = inputValue

  const customTipAmount = Number(inputValue)

  if (customTipAmount === 0 && customPercentBtn.value !== "") {
    handleTipError("Can't be zero")
    return
  }

  customPercentBtn.classList.remove(classInvalid)
  tipErrorAlert.innerText = ""

  if (customTipAmount > 0) {
    calculateTip(customTipAmount)
  }
})

function handleTipError(message) {
  customPercentBtn.classList.add(classInvalid)
  tipErrorAlert.innerText = message
}

// Function for calculating tip

function calculateTip(percentage) {
  const billAmount = Number(billInput.value)
  const peopleCount = Number(peopleInput.value)
  if (billAmount <= 0 || peopleCount <= 0 || percentage <= 0) {
    unsetAllRadios()
    return
  }
  const tip = (billAmount * (percentage / 100)) / peopleCount
  const total = billAmount / peopleCount + tip

  tipDisplay.innerText = `$${tip.toFixed(2)}`
  totalDisplay.innerText = `$${total.toFixed(2)}`
  resetBtn.disabled = false
}

// Reset handlers

resetBtn.addEventListener("click", e => {
  unsetAllRadios()
  tipDisplay.innerText = `$0.00`
  totalDisplay.innerText = `$0.00`
  customPercentBtn.value = ""
  billInput.value = ""
  peopleInput.value = ""
  resetBtn.disabled = true
})

function unsetAllRadios() {
  const radios = Array.from(document.querySelectorAll(queryInputRadio))
  for (const radio of radios) {
    radio.checked = false
  }
}

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
