let counts = document.getElementsByClassName('table-count');
let dels = document.getElementsByClassName('table-delete');

for(let i = 0; i < counts.length; i++){
    counts[i].addEventListener('change', countValidation);
    counts[i].addEventListener('change', totalPriceCalculation);
}

for (let i = 0; i < dels.length; i++) {
    dels[i].addEventListener('click', deleteRow);
    dels[i].addEventListener('click', totalPriceCalculation);
}