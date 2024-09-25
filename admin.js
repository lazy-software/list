window.onload = (_event) => {
    const destroyButton = document.querySelector("#destroyButton");
    destroyButton.onclick = function () {
        localStorage.clear();
    };
};