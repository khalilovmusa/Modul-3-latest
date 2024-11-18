fetch("https://v6.exchangerate-api.com/v6/9c7cd17235ce5991849ddeed/latest/USD").then((res) => {
    return res.json();
}).then((data) => {
    console.log(data)
})