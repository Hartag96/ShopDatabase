const priceFormat = () => {
    let trigger = document.querySelectorAll('#price');

    trigger.forEach((elemnet) => { // Dla podstron wyświetlajacych
        if (elemnet.textContent !== "") {
            var text = ((parseFloat(elemnet.textContent)) / 100).toFixed(2);
            elemnet.innerHTML = text + " zł";
        } else if (elemnet.value !== "") { // Dla podstrony edytujacej
            var text = ((parseFloat(elemnet.value)) / 100).toFixed(2);
            elemnet.value = text;
        }
    })
}
document.addEventListener('DOMContentLoaded', priceFormat);
