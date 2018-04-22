const deleteButton = () => {
    let trigger = document.querySelector('#delete');

    const deletingRequet = () => {
        var oReq = new XMLHttpRequest();
        var link = window.location.href.slice(0, window.location.href.lastIndexOf("/"));
        oReq.open("DELETE", window.location.href, true);
        oReq.send();
        oReq.onload = () => {
            if (oReq.readyState == 4 && oReq.status == "200") {
                console.log('Object deleted', oReq);
                setTimeout(() => {
                    window.location.href = link;
                }, 200)

            } else {
                console.error('Delete error');
            }
        }
    }
    trigger.addEventListener("click", deletingRequet);
}

const disableButton = () => {
    let trigger = document.querySelector('#disable');

    const DisablingRequet = () => {
        var oReq = new XMLHttpRequest();
        oReq.open("PUT", window.location.href, true);
        oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        oReq.send(JSON.stringify({
            available: "false"
        }));
        oReq.onload = () => {
            if (oReq.readyState == 4 && oReq.status == "200") {
                console.log('Object Updated', oReq);
                setTimeout(() => {
                    window.location.reload();
                }, 200)
            } else
                console.error('Update error');
        }
    }
    trigger.addEventListener("click", DisablingRequet);
}

const editButton = () => {
    let trigger = document.querySelector('#edit');

    const EditingRequet = () => {
        window.location.href = window.location.href.replace("product", "edit");
    }
    trigger.addEventListener("click", EditingRequet);
}

document.addEventListener('DOMContentLoaded', deleteButton);
document.addEventListener('DOMContentLoaded', disableButton);
