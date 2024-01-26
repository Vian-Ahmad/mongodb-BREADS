let userId = null, conditional = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc'
let data = ``

function getId(_id) {
    userId = _id
}


    function onDelete(_id) {
        userId = _id
        document.getElementById("notification-delete").style.display = "block";

    }

    function cancleDelete() {
        document.getElementById("notification-delete").style.display = "none";
    }

function onAdd() {
    userId = null
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("notification-form").style.display = "block";
}

function onUpdate(_id) {
    if (userId = _id) {
        document.getElementById("notification-form").style.display = "block";
        fillUpdateForm(userId);
    } else {
        alert("Please Choose User");
    }
}


function cancleform() {
    userId = null
    document.getElementById("notification-form").style.display = "none"

}

const limitData = () => {
    limit = document.getElementById("limit").value
    page = 1
    readData()
}

const searchName = () => {
    query = document.getElementById("searchName").value
    page = 1
    readData()
}

const reset = () => {
    document.getElementById('searchName').value = ''
    limit = document.getElementById('limit').value = "5"
    sortBy = '_id'
    sortMode = 'desc'
    let defaultName = `<a onclick="sortNameAsc('name')"><i class="fa-solid fa-sort"
    style="color: #000000;"></i></a>&nbsp;Name`
    let defaultPhone = `<a onclick="sortPhoneAsc('phone')"><i class="fa-solid fa-sort"
    style="color: #000000;"></i></a>&nbsp;Phone`
    query = ''

    document.getElementById('sort-name').innerHTML = defaultName
    document.getElementById('sort-phone').innerHTML = defaultPhone
    readData()
}

const changePage = (num) => {
    page = num
    readData(page)
}

const sortNameAsc = (name) => {
    sortBy = name
    sortMode = 'asc'
    let random = `<a type="button" onclick="sortPhoneAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
    let sortAsc = `
    <a type="button" onclick="sortNameDesc('name')"><i class="fa-solid fa-sort-up"></i></a>
    <span>Name</span>
    `
    document.getElementById(`sort-name`).innerHTML = sortAsc
    document.getElementById(`sort-phone`).innerHTML = random
    readData()
}

const sortNameDesc = (name) => {
    sortBy = name
    sortMode = 'desc'
    let sortDesc = `
    <a type="button" onclick="sortNameAsc('name')"><i class="fa-solid fa-sort-down"></i></a>
    <span>Name</span>
    `
    document.getElementById(`sort-name`).innerHTML = sortDesc
    readData()
}

const sortPhoneAsc = (phone) => {
    sortBy = phone
    sortMode = 'asc'
    let random = `<a type="button" onclick="sortNameAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
    let sortAsc = `
    <a type="button" onclick="sortPhoneDesc('phone')"><i class="fa-solid fa-sort-up"></i></a>
    <span>Phone</span>
    `
    document.getElementById(`sort-phone`).innerHTML = sortAsc
    document.getElementById(`sort-name`).innerHTML = random
    readData()
}

const sortPhoneDesc = (phone) => {
    sortBy = phone
    sortMode = 'desc'
    let sortDesc = `
    <a type="button" onclick="sortPhoneAsc('phone')"><i class="fa-solid fa-sort-down"></i></a>
    <span>Phone</span>
    `
    document.getElementById(`sort-phone`).innerHTML = sortDesc
    readData()
}

const readData = async function () {
    try {
        const response = await fetch(`http://localhost:3000/api/users?query=${query}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortMode=${sortMode}`);
        const users = await response.json()
        let html = ''
        let pagination = ''
        let pageNumber = ''
        const offset = users.offset
        users.data.forEach((item, index) => {
            html += ` <tr>
                <td>${index + 1 + offset}</td>
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td class="actions">${setActionsButtons(item._id)}                    
                </td>
            </tr>`
        });

        for (let i = 1; i <= users.pages; i++) {
            pageNumber += `<a class="${page == i ? 'active' : ''}" id="pagination-container" onclick="changePage(${i})">${i}</a>`;
        }

        if (document.getElementById('limit').value == 0) {
            pagination += `
        <span>Showing ${users.offset + 1} to ${users.total} of ${users.total} entries </span>
        <div class="page">
        <a class="basket-pagi active" id="pagination-container">1</a>
        </div>`
        } else {
            pagination = `
        <span>Showing ${users.offset + 1} to ${(Number(limit) + Number(users.offset)) >= users.total ? Number(users.total) : Number(limit) + Number(users.offset)} of ${users.total} entries </span>
        <div class="page">
        ${users.page == 1 ? '' : '<a id="pagination-container" onclick="changePage(page - 1)"><span>&laquo</span></a>'}
        ${pageNumber}
        ${users.page == users.pages ? '' : '<a id="pagination-container" onclick="changePage(page + 1)"><span>&raquo</span></a>'}
        </div>`
        }

        document.getElementById('pagination-container').innerHTML = pagination
        document.getElementById("bodytable").innerHTML = html

    } catch (error) {
        alert('failed to read data user')
    }
}

readData()

async function fillUpdateForm(userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        const userData = await response.json();

        if (response.ok) {
            document.getElementById("name").value = userData.name;
            document.getElementById("phone").value = userData.phone;
        } else {
            console.log("Failed to fetch user data for add/update");
        }
    } catch (error) {
        console.log(error);
    }
}

async function saveData() {
    try {
        const addUpdateName = document.getElementById("name").value;
        const addUpdatePhone = document.getElementById("phone").value;

        let method, url;
        if (userId) {
            method = "PUT";
            url = `http://localhost:3000/api/users/${userId}`;
        } else {
            method = "POST";
            url = "http://localhost:3000/api/users";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: addUpdateName, phone: addUpdatePhone })
        });

        if (response.ok) {
            readData();
            cancleform();
        } else {
            console.log("Failed to save data");
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteData() {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.ok) {
            readData()
            cancleDelete()
        } else {
            alert("Failed to delete data")
        }
    } catch (error) {
        alert(error)
    }
}