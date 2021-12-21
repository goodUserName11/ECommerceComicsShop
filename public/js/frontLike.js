function favChange(event) {
    //Текущая иконка
    let favIcon = event.target.childNodes[0];
    if (favIcon.textContent == '\n                         favorite \n                         \n                    ') {
        favIcon.textContent = 'favorite_border';
    }
    else {
        favIcon.textContent = 'favorite';
    }
}

function like(event){
    this.parentElement.lastElementChild.submit();
}

let favClickables = document.getElementsByClassName('favourite');

for (let i = 0; i < favClickables.length; i++) {
    favClickables[i].addEventListener('click', favChange);
    favClickables[i].addEventListener('click', like);
}

let cartClickables = document.getElementsByClassName('cartClickables');

function addToCart(event){
    this.parentElement.children[1].submit();
}

for (let i = 0; i < cartClickables.length; i++) {
    cartClickables[i].addEventListener('click', addToCart);
}