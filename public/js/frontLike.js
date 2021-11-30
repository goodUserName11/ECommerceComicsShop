function favChange(event) {
    //Текущая иконка
    let favIconName = event.target.innerText;

    if (favIconName == 'favorite') {
        event.target.innerText = 'favorite_border';
    }
    else {
        event.target.innerText = 'favorite';
    }
}

let favIcons = document.getElementsByClassName('fav-icon');

for (let i = 0; i < favIcons.length; i++) {
    favIcons[i].addEventListener('click', favChange);
}
