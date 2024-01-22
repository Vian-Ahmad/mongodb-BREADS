let id = null, conditional = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc'
let data = ``




function getId(_id) {
    id = _id
}

function onDelete(_id) {
    userId = _id
    document.getElementById("notification-delete").style.display = "block";

}

function cancleDelete() {
    document.getElementById("notification-delete").style.display = "none";
}

function onUpdate(_id, name, phone){
    
}
// let addButton = document.getElementById('addButton')
// addButton.onclick = () => {
//     conditional = true
//     const name = document.getElementById('name').value = ""
//     const phone = document.getElementById('phone').value = ""
// }


// function onDelete(_id) {
//     document.getElementById("notification-delete").style.display = "block";
//     document.getElementById("btn-yes").setAttribute("href", `users/delete/${usersid}`);
//     return false
// }

// function cancleDelete() {
//     document.getElementById("notification-delete").style.display = "none";
// }

// function onUpdate(usersid, title) {
//     document.getElementById("notification-update").style.display = "block";
//     document.getElementById("btn-submit").setAttribute("href", `users/delete/${usersid}`);
//     return false
// }

// function cancleUpdate() {
//     document.getElementById("notification-update").style.display = "none";
// }


const readData = async function () {
    try {
        const response = await fetch(`http://localhost:3000/api/users`);
        const users = await response.json()
        let html = ''
        users.data.forEach((item, index) => {
            html += ` <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td class="actions">${setActionsButtons(item._id)}
                    
                </td>
            </tr>`
            document.getElementById("bodytable").innerHTML = html
        });
    } catch (error) {
        alert('failed to read data user')
    }
}

readData()

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
            console.log("Failed to delete data")
        }
    } catch (error) {
        console.log(error)
    }
}