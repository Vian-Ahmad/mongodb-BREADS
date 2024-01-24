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
        fillUpdateForm(userId); // Mengisi formulir jika ada ID yang dipilih
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


// const renderPagination = (totalPages, currentPage) => {
//     const paginationContainer = document.getElementById('pagination-container');
//     paginationContainer.innerHTML = '';

//     const prevButton = document.createElement('a');
//     prevButton.className = 'pagination-btn';
//     prevButton.innerHTML = '&laquo;';
//     prevButton.onclick = function () {
//         if (currentPage > 1) {
//             changePage(currentPage - 1);
//         }
//     };
//     if (currentPage > 1) {
//         paginationContainer.appendChild(prevButton);
//     }

//     for (let i = 1; i <= totalPages; i++) {
//         const pageLink = document.createElement('a');
//         pageLink.className = 'pagination-btn';
//         pageLink.textContent = i;

//         pageLink.onclick = function () {
//             changePage(i);
//         };

//         if (i === currentPage) {
//             pageLink.classList.add('active');
//         }

//         paginationContainer.appendChild(pageLink);
//     }

//     const nextButton = document.createElement('a');
//     nextButton.className = 'pagination-btn';
//     nextButton.innerHTML = '&raquo;';
//     nextButton.onclick = function () {
//         if (currentPage < totalPages) {
//             changePage(currentPage + 1);
//         }
//     };

//     if (currentPage < totalPages) {
//         paginationContainer.appendChild(nextButton);
//     }

// }

const changePage = (num) => {
    page = num
    readData(page)
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
            // pageNumber += `<a ${page == i ? ' active' : ''} " ${users.pages == 1 ? `style =border-radius:4px;` : ''} ${i == 1 && page == i ? `style="border-top-left-radius:4px; border-bottom-left-radius:5px;"` : ''}  ${i == users.pages && page == i ? `style="border-top-right-radius:4px; border-bottom-right-radius:5px;"` : ''} id="pagination-container" onclick="changePage(${i})">${i}</a>`
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
        </div>
        `
        }
        // const targetElement = document.getElementById('rightfooter');

        //     if (document.getElementById('limit').value == 0) {
        //         const newSpan = document.createElement('span');
        //         newSpan.textContent = `Showing ${users.offset + 1} to ${users.total} of ${users.total} entries`;
        //         targetElement.insertBefore(newSpan, targetElement.firstChild);
        //     } else {
        //         const newSpan = document.createElement('span');
        //         newSpan.textContent = `Showing ${users.offset + 1} to ${(Number(limit) + Number(users.offset)) >= users.total ? Number(users.total) : Number(limit) + Number(users.offset)} of ${users.total} entries`;
        //         targetElement.insertBefore(newSpan, targetElement.firstChild);
        //     }
        //     renderPagination(users.pages, users.page)

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