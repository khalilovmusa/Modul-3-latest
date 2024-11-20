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
        //!

        return;
    } else if(currencyFrom !== currencyTo) {
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
    }else{
        updateInputInfo(currencyFrom, currencyTo);
    }
}

async function updateInputInfo(currencyFrom, currencyTo) {
    if (currencyFrom === currencyTo) {

        let amount = leftInput.value;
        rightInput.value = amount;

        document.querySelector(".left-side-currency-info").textContent = `1 ${currencyFrom} ~ 1 ${currencyFrom}`;

        document.querySelector(".right-side-currency-info").textContent = `1 ${currencyFrom} ~ 1 ${currencyFrom}`;
        return;
    } else {
        try {
            const [dataTo, dataFrom] = await Promise.all([
                fetch(url + currencyFrom).then((res) => res.json()),
                fetch(url + currencyTo).then((res) => res.json())
            ]);
            const rateTo = currencyTo.toUpperCase();
            const rateFrom = currencyFrom.toUpperCase();

            document.querySelector(".left-side-currency-info").textContent = `1 ${currencyFrom} ~ ${dataTo.conversion_rates[rateTo]} ${currencyTo}`;
            document.querySelector(".right-side-currency-info").textContent = `1 ${currencyTo} ~ ${dataFrom.conversion_rates[rateFrom]} ${currencyFrom}`;

        } catch {
            console.log("Error fetching currency info.");
        }
    }

}

leftInput.addEventListener("input", () => selectCurrency(leftInput.value, "left"));
rightInput.addEventListener("input", () => selectCurrency(rightInput.value, "right"));

function init() {
    selectCurrency();
}

init();
