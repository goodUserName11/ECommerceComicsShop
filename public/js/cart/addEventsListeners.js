let counts = document.getElementsByClassName('table-count');
let dels = document.getElementsByClassName('table-delete');
let modalDeleteBtn = document.getElementsByClassName('table-delete-yes')[0];
let deleteModalInput = document.getElementById('delete-modal-input');
let payBtn = document.getElementById('pay-btn');
let newOrderInput = document.getElementById('new-order-input');


for(let i = 0; i < counts.length; i++){
    counts[i].addEventListener('change', countValidation);
    counts[i].addEventListener('change', totalPriceCalculation);
}

for(let i = 0; i < dels.length; i++){
    dels[i].addEventListener('click', setDeleteId);
}

modalDeleteBtn.addEventListener('click', deleteRow);
modalDeleteBtn.addEventListener('click', totalPriceCalculation);