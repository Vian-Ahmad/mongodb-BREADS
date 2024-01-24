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

//     for (let i = 1; i <= totalPages; i++) {
//         const pageLink = document.getElementById(`page-link-${i}`);
//         if (pageLink) {
//             pageLink.href = `/users?page=${i}`;
//             pageLink.textContent = i;

//             // Menambahkan event listener onclick
//             // pageLink.onclick = function() {
//             //     changePage(i);
//             // };

//             if (i === currentPage) {
//                 pageLink.classList.add('active');
//             }
//         }
//     }
// };

const renderPagination = (totalPages, currentPage) => {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.className = 'pagination';
        pageLink.textContent = i;

        pageLink.onclick = function() {
                changePage(i);
            };

        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        paginationContainer.appendChild(pageLink);
    }
};

const changePage = (num) => {
    page = num
    readData(page)
}

const readData = async function () {
    try {
        const response = await fetch(`http://localhost:3000/api/users?query=${query}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortMode=${sortMode}`);
        const users = await response.json()
        let html = ''
        const offset = users.offset
        users.data.forEach((item, index) => {
            html += ` <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td class="actions">${setActionsButtons(item._id)}                    
                </td>
            </tr>`
        });
        renderPagination(users.pages, users.page)
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