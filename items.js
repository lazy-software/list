window.onload = (_event) => {
    refresh();
};

function refresh() {
    const lists = getLists();
    if (lists.size == 0) {
        renderNoLists();
        return;
    }

    const currList = getCurrList();

    const addItemInput = document.querySelector("#addItemInput");
    addItemInput.setAttribute("placeholder", "add item to " + currList);
    addItemInput.onkeyup = (event) => {
        if (event.key === "Enter") {
            addItem(currList, addItemInput.value);
            addItemInput.value = '';
            refresh();
        }
    };

    const uncheckButton = document.querySelector("#uncheckButton");
    uncheckButton.onclick = function () {
        console.log('hello?');
        uncheckAll(currList);
        refresh();
    };

    const removeButton = document.querySelector("#removeButton");
    removeButton.onclick = function () {
        removeChecked(currList);
        refresh();
    };
    
    const resetButton = document.querySelector("#removeAllButton");
    resetButton.onclick = function () {
        removeAll(currList);
        refresh();
    };

    const items = getItems(currList);
    if (items.size == 0) {
        renderNoItems(lists, currList);
        return;
    }

    render(currList);
}

function renderNoLists() {
    hide(document.querySelector("#addItemContainer"));
    hide(document.querySelector("#itemsActionContainer"));
    hide(document.querySelector("#itemsContainer"));

    const actionTextContainer = document.querySelector("#actionTextContainer");
    show(actionTextContainer);
    actionTextContainer.innerHTML = "hey, you need a <a href=\"lists.html\">list</a>!";
}

function renderNoItems() {
    hide(document.querySelector("#itemsActionContainer"));
    hide(document.querySelector("#itemsContainer"));
    show(document.querySelector("#addItemContainer"));
}

function render(currList) {
    hide(document.querySelector("#actionTextContainer"));

    show(document.querySelector("#itemsActionContainer"));
    const itemsContainer = document.querySelector("#itemsContainer");
    show(itemsContainer);
    show(document.querySelector("#addItemContainer"));

    const tbody = document.querySelector("#itemsContainer tbody");
    tbody.replaceChildren();
    const checked = getChecked(currList);
    getItems(currList).forEach((_value, item, _set) => {
        renderItem(tbody, item, checked, currList);
    });
}

function renderItem(tbody, item, checked, currList) {
    const tr = document.createElement("tr");
    tbody.appendChild(tr);

    const td1 = document.createElement("td");
    tr.appendChild(td1);

    const label = document.createElement("label");
    td1.appendChild(label);

    const input = document.createElement("input");
    label.appendChild(input);
    input.setAttribute("type", "checkbox");
    input.checked = checked.has(item);
    input.addEventListener("change", (event) => {
        event.currentTarget.checked ? check(currList, item) : uncheck(currList, item);
    });

    const text = document.createElement("span");
    text.innerText = " " + item;
    label.appendChild(text);
}

function hide(element) {
    element.setAttribute("hidden", true);
}

function show(element) {
    element.removeAttribute("hidden");
}
