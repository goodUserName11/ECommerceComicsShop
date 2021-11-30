function countValidation(event) {
    if(event.target.value < 1 || event.target.value > 100){
        event.target.value = 1;
    }
}