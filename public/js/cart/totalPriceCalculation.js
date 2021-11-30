let totalPriceEl = document.getElementById('total-price');

function totalPriceCalculation(event) {
    let counts = document.getElementsByClassName('table-count');
    let prices = document.getElementsByClassName('table-price');
    let totalPrice = Number(document.getElementById('delivery').innerHTML);

    for (let i = 0; i < counts.length; i++) {
        totalPrice += Number(counts[i].value) * Number(prices[i].innerHTML);
    }

    if(counts.length == 0)
        totalPrice = 0;

    totalPriceEl.innerHTML = totalPrice;
}

