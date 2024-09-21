window.onload = (_event) => {
    refresh();
};

// lists

function getLists() {
    const items = JSON.parse(localStorage.getItem("lists"));
    if (items == null) return new Set();
    else return new Set(items);
}

function addList(list) {
    const lists = getLists();
    lists.add(list);
    saveLists(lists);
    if (lists.size == 1) {
        setCurrList(list);
    }
}

function saveLists(lists) {
    localStorage.setItem("lists", JSON.stringify(Array.from(lists.values()).sort()));
}

function deleteList(list) {
    const lists = getLists();
    lists.delete(list);
    saveLists(lists);
    if (lists.size > 0) {
        setCurrList(lists.values().next().value);
    } else {
        setCurrList(null);
    }
    resetList(list);
}

function getCurrList() {
    return localStorage.getItem("curr_list");
}

function setCurrList(list) {
    localStorage.setItem("curr_list", list);
}

function resetList(list) {
    localStorage.removeItem(list + "_items");
    localStorage.removeItem(list + "_checked");
}

function cleanList(list) {
    const checked = getChecked(list);
    checked.forEach((_value, item, _set) => {
        removeItem(list, item);
    });
    localStorage.removeItem(list + "_checked");
}

// items

function getItems(list) {
    const items = JSON.parse(localStorage.getItem(list + "_items"));
    if (items == null) return new Set();
    else return new Set(items);
}

function saveItems(list, items) {
    localStorage.setItem(list + "_items", JSON.stringify(Array.from(items.values()).sort()));
}

function addItem(list, item) {
    const items = getItems(list);
    items.add(item);
    saveItems(list, items);
}

function removeItem(list, item) {
    const items = getItems(list);
    items.delete(item);
    saveItems(list, items);
}

// checked

function getChecked(list) {
    const checked = JSON.parse(localStorage.getItem(list + "_checked"));
    if (checked == null) return new Set();
    else return new Set(checked);
}

function check(list, item) {
    const checked = getChecked(list);
    checked.add(item);
    saveChecked(list, checked);
}

function uncheck(list, item) {
    const checked = getChecked(list);
    checked.delete(item);
    saveChecked(list, checked);
}

function saveChecked(list, checked) {
    localStorage.setItem(list + "_checked", JSON.stringify(Array.from(checked.values())));
}

// drawing

function refresh() {
    const addListButton = document.querySelector("#addListButton");
    addListButton.onclick = function () {
        const addListInput = document.querySelector("#addListInput");
        addList(addListInput.value);
        addListInput.value = '';
        refresh();
    }

    const lists = getLists();
    if (lists.size == 0) {
        renderNoLists();
        return;
    }

    const currList = getCurrList();

    const addItemInput = document.querySelector("#addItemInput");
    addItemInput.setAttribute("placeholder", "add item to " + currList);

    const addItemButton = document.querySelector("#addItemButton");
    addItemButton.onclick = function () {
        const addItemInput = document.querySelector("#addItemInput");
        addItem(currList, addItemInput.value);
        addItemInput.value = '';
        refresh();
    };

    const cleanButton = document.querySelector("#cleanButton");
    cleanButton.onclick = function () {
        cleanList(currList);
        refresh();
    };

    const resetButton = document.querySelector("#resetButton");
    resetButton.onclick = function () {
        resetList(currList);
        refresh();
    };

    const deleteButton = document.querySelector("#deleteButton");
    deleteButton.onclick = function () {
        deleteList(currList);
        refresh();
    };

    const destroyButton = document.querySelector("#destroyButton");
    destroyButton.onclick = function () {
        localStorage.clear();
        refresh();
    };

    const items = getItems(currList);
    if (items.size == 0) {
        renderNoItems(lists, currList);
        return;
    }

    render(lists, currList);
}

function renderNoLists() {
    hide(document.querySelector("#addItemContainer"));
    hide(document.querySelector("#listActionContainer"));
    hide(document.querySelector("#listsContainer"));
    hide(document.querySelector("#listContainer"));
    hide(document.querySelector("#destroyButton"));

    const actionTextContainer = document.querySelector("#actionTextContainer");
    show(actionTextContainer);
    actionTextContainer.innerHTML = "add a list to get started!";
}

function renderNoItems(lists, currList) {
    hide(document.querySelector("#listActionContainer"));
    hide(document.querySelector("#listContainer"));

    show(document.querySelector("#addItemContainer"));
    
    const actionTextContainer = document.querySelector("#actionTextContainer");
    actionTextContainer.innerHTML = "add an item to get started!";
    show(actionTextContainer);
    const listsContainer = document.querySelector("#listsContainer");
    show(listsContainer);
    show(document.querySelector("#destroyButton"));

    renderLists(listsContainer, lists, currList);
}

function render(lists, currList) {
    hide(document.querySelector("#actionTextContainer"));

    show(document.querySelector("#listActionContainer"));
    const listContainer = document.querySelector("#listContainer");
    show(listContainer);
    show(document.querySelector("#addItemContainer"));
    const listsContainer = document.querySelector("#listsContainer");
    show(listsContainer);
    show(document.querySelector("#destroyButtonContainer"));

    const tbody = document.querySelector("#listContainer tbody");
    tbody.replaceChildren();
    const checked = getChecked(currList);
    getItems(currList).forEach((_value, item, _set) => {
        renderItem(tbody, item, checked, currList);
    });

    renderLists(listsContainer, lists, currList);
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

function renderLists(listsContainer, lists, currList) {
    listsContainer.replaceChildren();
    const legend = document.createElement("legend");
    legend.innerText = "lists";
    listsContainer.appendChild(legend);
    lists.forEach((_value, list, _set) => {
        renderList(listsContainer, list, currList);
    });
}

/**
 * <div>
 *   <input type="radio" name="active" value="groceries" id="groceries" />
 *   <label for="groceries">groceries</label>
 * </div>
 */
function renderList(listsContainer, list, currList) {
    const div = document.createElement("div");
    listsContainer.appendChild(div);

    const input = document.createElement("input");
    div.appendChild(input);
    input.setAttribute("type", "radio");
    input.setAttribute("name", "curr");
    input.setAttribute("value", list);
    input.setAttribute("id", list);
    if (list == currList) {
        input.checked = true;
    }
    input.addEventListener("change", (event) => {
        if (event.currentTarget.checked) {
            setCurrList(list);
            refresh();
        }
    });

    const label = document.createElement("label");
    div.appendChild(label);
    label.setAttribute("for", list);
    label.innerText = " " + list;
}

function hide(element) {
    element.setAttribute("hidden", true);
}

function show(element) {
    element.removeAttribute("hidden");
}
