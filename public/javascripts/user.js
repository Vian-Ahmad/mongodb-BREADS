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
        alert("Pilih pengguna terlebih dahulu.");
    }
}

function cancleform() {
    userId = null
    document.getElementById("notification-form").style.display = "none"

}

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