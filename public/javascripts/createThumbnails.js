const previewFile = () => {
    const thumbnails = document.querySelector('.thumbnailsContener');
    const deleteTriggers = document.querySelectorAll('#deleteTrigger');
    const fileInput = document.querySelector('input[type=file]');
    const imagesToDelete = document.querySelector('#imagesToDelete');

    const fileList = [];

    const deleteThumbnail = (e) => {
        if (e.target.value === "new")
            fileList.forEach((element) => {
                if (element.name === e.target.name) {
                    delete element;
                    e.target.parentNode.remove();
                }
            })
        else if (e.target.value === "existing") {
            imagesToDelete.value += e.target.name+",";
            e.target.parentNode.remove();
        }
    };

    const checkChanges = () => {
        let files = fileInput.files;

        [].forEach.call(files, (file) => {
            let reader = new FileReader();
            fileList.push(file);

            reader.addEventListener("load", () => {
                let thumbnail = document.createElement("div");
                let image = new Image();
                let caption = document.createElement("div");
                let paragraph = document.createElement("p");
                let button = document.createElement("button");
                thumbnail.className = "thumbnail p-2 col-sm-12 col-md-12 col-lg-6 col-xl-4";
                image.className = "img-thumbnail rounded border border-secondary mx-auto d-block";
                image.alt = file.name;
                image.src = reader.result;
                button.className = "m-1 btn btn-outline-danger btn-block";
                button.id = "deleteTrigger";
                button.value = "new";
                button.name = file.name;
                button.innerHTML = "Usuń";
                caption.className = "caption";
                paragraph.className = "p-2 w-100 d-inline-block text-truncate text-secondary";
                paragraph.innerHTML = file.name;

                thumbnail.appendChild(image);
                thumbnail.appendChild(button);
                thumbnail.appendChild(caption);
                caption.appendChild(paragraph);
                thumbnails.appendChild(thumbnail);
                button.addEventListener('click', deleteThumbnail)
            }, false);
            reader.readAsDataURL(file);
        })
    }

    deleteTriggers.forEach((elemnet) => {
        elemnet.addEventListener("click", deleteThumbnail);
    });

    fileInput.addEventListener('change', checkChanges);
}

document.addEventListener('DOMContentLoaded', previewFile);
