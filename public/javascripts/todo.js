let title = '', page = 1, complete = '', startDeadline = '', endDeadline = '', sortBy = '_id', sortMode = 'desc', limit = 10, executor = executorid, deadline = null, todoId = null, id = null, complt = false;


function getId(_id) {
    todoId = _id
}

// $(window).scroll(function () {
//     if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
//         page++
//         loadData(complt)
//     }
// })

function onDelete(_id) {
    todoId = _id
    document.getElementById("todos-deleteModal").style.display = "block";

}

function cancleDelete() {
    document.getElementById("todos-deleteModal").style.display = "none";
}

const getData = async (_id) => {
    try {
        getId(_id)
        const response = await $.ajax({
            url: `/api/todos/${todoId}`,
            method: "GET",
            dataType: "json",
        });
        $('#editTitle').val(response.title)
        $('#editDeadline').val(moment(response.deadline).format('YYYY-MM-DDThh:mm'))
        $('#editComplete').prop('checked', response.complete)
    } catch (err) {
        throw err
    }
    loadData(complt)
}

const loadData = async () => {
    try {
        const response = await $.ajax({
            url: "/api/todos",
            method: "GET",
            dataType: "json",
            data: {
                executor,
                sortBy,
                sortMode,
                deadline,
                title,
                startDeadline,
                endDeadline,
                complete,
                page,
                limit
            }
        });
        let list = ''
        response.data.forEach((item) => {
            list += `
            <div id="${item._id}" class="show-todos ${item.complete == false && new Date(`${item.deadline}`).getTime() < new Date().getTime() ? ' redClr' : item.complete == true ? ' greenClr' : ' greyClr'}">
                 ${moment(item.deadline).format('DD-MM-YYYY HH:mm')} ${item.title}
                 <div>
                    <a type="button" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#formTodo" ><i class="fa-solid fa-pencil"></i></a>
                    <a type="button" onclick="onDelete('${item._id}')"  data-bs-toggle="modal" data-bs-target="#todos-deleteModal"><i class="fa-solid fa-trash mx-2"></i></a>
                 </div>    
                </div>`
        });

        if (page === 1) {
            $('#showTodos').html(list)
        } else if (page > 1) {
            $('#showTodos').append(list)
        }
    } catch (error) {
        throw error.message

    }
}
loadData(complt)

$('#saveBtn').click(() => {
    addTodo()
})



const addTodo = async () => {
    title = $('#title').val()
    console.log(title, "WOIYAAAAAAAHHH")
    console.log($('#coba').val())
    try {
        const a_day = 24 * 60 * 60 * 1000
        const response = await $.ajax({
            url: `/api/todos`,
            method: "POST",
            dataType: "json",
            data: {
                title,
                executor
            }
        });        
        let addList = ''
        addList += `
        <div id="${response[0]._id}" class="show-todos ${response[0].complete == false && new Date(`${response[0].deadline}`).getTime() < new Date().getTime() ? ' redClr' : response[0].complete == true ? ' greenClr' : ' greyClr'}">
        ${moment(new Date(Date.now() + a_day)).format('DD-MM-YYYY HH:mm')} ${title}
        <div>
        <a type="button" onclick="getData('${response[0]._id}')" data-bs-toggle="modal" data-bs-target="#formTodo"><i class="fa-solid fa-pencil"></i></a>
        <a type="button" onclick="onDelete('${response[0]._id}')" data-bs-toggle="modal" data-bs-target="#todos-deleteModal"><i class="fa-solid fa-trash mx-2"></i></a>
        </div>
         </div>`

        $('#showTodos').prepend(addList)
        // title = ''
        // $('#title').val('')

    } catch (error) {
        throw error
    }
}

const deleteTodos = async () => {
    try {
        const response = await $.ajax({
            url: `/api/todos/${todoId}`,
            method: "DELETE",
            dataType: "json"
        })
        document.getElementById("todos-deleteModal").style.display = "none";
        $(`#${todoId}`).remove()
    } catch (error) {
        throw error
    }
    loadData(complt)
}