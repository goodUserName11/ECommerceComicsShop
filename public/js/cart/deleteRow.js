function deleteRow(event) {
    // let row = this.parentNode.parentNode;
    // row.parentNode.removeChild(row);

    let row = this.parentNode.parentNode.M_Modal._openingTrigger.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function setDeleteId(event){
    let prodId = this.parentNode.lastElementChild.value;

    deleteModalInput.value=prodId;
}

