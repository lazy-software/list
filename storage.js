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
    removeAll(list);
}

function getCurrList() {
    return localStorage.getItem("curr_list");
}

function setCurrList(list) {
    localStorage.setItem("curr_list", list);
}

function removeAll(list) {
    localStorage.removeItem(list + "_items");
    localStorage.removeItem(list + "_checked");
}

function removeChecked(list) {
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

function uncheckAll(list) {
    localStorage.removeItem(list + "_checked");
}

function uncheck(list, item) {
    const checked = getChecked(list);
    checked.delete(item);
    saveChecked(list, checked);
}

function saveChecked(list, checked) {
    localStorage.setItem(list + "_checked", JSON.stringify(Array.from(checked.values())));
}