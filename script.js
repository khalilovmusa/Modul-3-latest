// const buttons = document.querySelectorAll(".buttons-container");
// let leftInput = document.querySelector(".left-side-input");
// let rightInput = document.querySelector(".right-side-input");
// const apiKey = '9c7cd17235ce5991849ddeed';
// const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`

// leftInput.value = 5000;


// buttons.forEach((buttonDiv) => {
//     buttonDiv.addEventListener("click", (e) => {
//         if (!e.target.classList.contains("button")) {
//             return; // Exit if the click is outside the intended target
//         } else {
//             Array.from(e.target.parentElement.children).forEach((elem) => {
//                 elem.style.background = "#fff";
//                 elem.classList.forEach((className) => {
//                     if (className === "selected") {
//                         elem.classList.remove(className)
//                     }
//                 })
//             })
//             e.target.style.background = "blueviolet";
//             e.target.classList.add("selected");
//             selectCurrency();
//         }
//     })
// })

// function selectCurrency(amount) {
//     if (!amount) {
//         amount = leftInput.value;
//     }
//     let currenctFrom;
//     Array.from(document.querySelector(".left-side-buttons-container").children).forEach((button) => {
//         if (button.classList.contains("selected")) {
//             currenctFrom = button.id;
//         }
//     })
//     let currencyTo;
//     Array.from(document.querySelector(".right-side-buttons-container").children).forEach((button) => {
//         if (button.classList.contains("selected")) {
//             currencyTo = button.id;
//         }
//     })
//     if (!currenctFrom && !currencyTo) {

//         document.querySelector(".left-side-buttons-container button:first-child").style.background = "blueviolet";
//         document.querySelector(".right-side-buttons-container button:nth-child(2)").style.background = "blueviolet";

//         currenctFrom = "rub";
//         currencyTo = "usd";
//         fetchData(currenctFrom, currencyTo, amount);
//     } else if (!currenctFrom) {

//         document.querySelector(".left-side-buttons-container button:first-child").style.background = "blueviolet";
//         document.querySelector(".right-side-buttons-container button:nth-child(2)").style.background = "blueviolet";

//         currenctFrom = "rub";
//         fetchData(currenctFrom, currencyTo, amount);
//     } else if (currencyTo) {

//         document.querySelector(".left-side-buttons-container button:first-child").style.background = "blueviolet";
//         document.querySelector(".right-side-buttons-container button:nth-child(2)").style.background = "blueviolet";

//         currencyTo = "usd";
//         fetchData(currenctFrom, currencyTo, amount);
//     }
//     fetchData(currenctFrom, currencyTo, amount)
// }

// function fetchData(currencyFrom, currencyTo, amount) {
//     fetch(url + currencyFrom).then((res) => {
//         return res.json();
//     }).then((data) => {
//         let value = currencyTo.toUpperCase();
//         updateInputInfo(currencyFrom, currencyTo)
//         rightInput.value = amount * data.conversion_rates[value];
//     })
// }

// function updateInputInfo(currencyFrom, currencyTo) {
//     let leftCurrencyInfo = document.querySelector(".left-side-currency-info");
//     let rightCurrencyInfo = document.querySelector(".right-side-currency-info");

//     if (currencyFrom === currencyTo) {
//         let value = currencyFrom.toUpperCase();
//         fetch(url + currencyFrom).then((res) => {
//             return res.json();
//         }).then((data) => {
//             let content = `1${currencyTo} ~ ${data.conversion_rates[value]} ${currencyFrom}`;
//             rightCurrencyInfo.textContent = content;
//             leftCurrencyInfo.textContent = content;
//         })
//     } else {
//         fetch(url + currencyFrom).then((res) => {
//             return res.json();
//         }).then((data) => {
//             let value = currencyTo.toUpperCase();
//             console.log(value)
//             rightCurrencyInfo.textContent = `1${currencyTo} ~ ${data.conversion_rates[value]} ${currencyFrom}`
//         })

//         fetch(url + currencyTo).then((res) => {
//             return res.json();
//         }).then((data) => {
//             let value = currencyFrom.toUpperCase();
//             leftCurrencyInfo.textContent = `1${currencyFrom} ~ ${data.conversion_rates[value]} ${currencyTo}`;
//         })

//     }
// }


// leftInput.addEventListener("input", () => {
//     selectCurrency();
// })

// rightInput.addEventListener("input", () => {
//     selectCurrency(rightInput.value);
// })

// function init() {
//     selectCurrency();

// }



// init();

const buttons = document.querySelectorAll(".buttons-container");
let leftInput = document.querySelector(".left-side-input");
let rightInput = document.querySelector(".right-side-input");
const apiKey = '906546be0091e103480f7413';
const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;

leftInput.value = 5000;

buttons.forEach((buttonDiv) => {
    buttonDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("button")) {
            Array.from(e.target.parentElement.children).forEach((elem) => {
                elem.style.background = "#fff";
                elem.classList.remove("selected");
            });
            e.target.style.background = "blueviolet";
            e.target.classList.add("selected");
            selectCurrency();
        }
    });
});

async function selectCurrency(amount, source = "left") {
    let currencyFrom, currencyTo;

    Array.from(document.querySelector(".left-side-buttons-container").children).forEach((button) => {
        if (button.classList.contains("selected")) {
            currencyFrom = button.id;
        }
    });

    Array.from(document.querySelector(".right-side-buttons-container").children).forEach((button) => {
        if (button.classList.contains("selected")) {
            currencyTo = button.id;
        }
    });

    if (!currencyFrom) {
        currencyFrom = "rub";
        document.querySelector(".left-side-buttons-container button:first-child").style.background = "blueviolet";
    }

    if (!currencyTo) {
        currencyTo = "usd";
        document.querySelector(".right-side-buttons-container button:nth-child(2)").style.background = "blueviolet";
    }

    if (!amount) {
        amount = source === "left" ? leftInput.value : rightInput.value;
    }

    if (source === "left") {
        await fetchData(currencyFrom, currencyTo, amount, "right");
    } else {
        await fetchData(currencyTo, currencyFrom, amount, "left");
    }
}

async function fetchData(currencyFrom, currencyTo, amount, target) {
    if (!navigator.onLine) {
        document.querySelector("#error-message").style.display = "block";
        return;
    }

    try {
        const response = await fetch(url + currencyFrom);
        const data = await response.json();
        const rate = currencyTo.toUpperCase();

        if (target === "right") {
            rightInput.value = (amount * data.conversion_rates[rate]).toFixed(2);
        } else {
            leftInput.value = (amount / data.conversion_rates[rate]).toFixed(2);
        }

        updateInputInfo(currencyFrom, currencyTo);
    } catch {
        console.log("Network error or API issue.");
    }
}

async function updateInputInfo(currencyFrom, currencyTo) {
    try {
        const [dataFrom, dataTo] = await Promise.all([
            fetch(url + currencyFrom).then((res) => res.json()),
            fetch(url + currencyTo).then((res) => res.json())
        ]);

        const rateTo = currencyTo.toUpperCase();
        const rateFrom = currencyFrom.toUpperCase();

        document.querySelector(".right-side-currency-info").textContent = `1 ${currencyTo} ~ ${dataFrom.conversion_rates[rateTo]} ${currencyFrom}`;
        document.querySelector(".left-side-currency-info").textContent = `1 ${currencyFrom} ~ ${dataTo.conversion_rates[rateFrom]} ${currencyTo}`;
    } catch {
        console.log("Error fetching currency info.");
    }
}

leftInput.addEventListener("input", () => selectCurrency(leftInput.value, "left"));
rightInput.addEventListener("input", () => selectCurrency(rightInput.value, "right"));

function init() {
    selectCurrency();
}

init();
