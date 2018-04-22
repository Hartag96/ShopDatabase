const menuSearch = () => {
    let trigger = document.querySelector('#search');
    let input = document.querySelector('#searchInput');

    const searchRedirect = () => {
        let link = '/product/?search='+input.value;
        window.location.href = link;
    }
    trigger.addEventListener("click", searchRedirect)

}

document.addEventListener('DOMContentLoaded', menuSearch);
