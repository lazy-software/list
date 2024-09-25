window.onload = (_event) => {
    refresh();
};

// drawing

function refresh() {
    const addListInput = document.querySelector("#addListInput");
    addListInput.onkeyup = (event) => {
        if (event.key === "Enter") {
            addList(addListInput.value);
            addListInput.value = '';
            refresh();
        }
    };

    const lists = getLists();
    if (lists.size == 0) {
        renderNoLists();
        return;
    }

    const deleteButton = document.querySelector("#deleteButton");
    deleteButton.onclick = function () {
        deleteList(currList);
        refresh();
    };

    const currList = getCurrList();
    render(lists, currList);
}

function renderNoLists() {
    hide(document.querySelector("#listsContainer"));
    hide(document.querySelector("#listActionContainer"));
}

function render(lists, currList) {
    const listsContainer = document.querySelector("#listsContainer");
    show(listsContainer);
    show(document.querySelector("#listActionContainer"));

    renderLists(listsContainer, lists, currList);
}

function renderLists(listsContainer, lists, currList) {
    listsContainer.replaceChildren();
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