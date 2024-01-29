let title = '', page = 1, complete = '', startdate = '', enddate = '', sortBy = '_id', sortMode = 'desc', limit = 10, executor = executorid, deadline = '', todoId = null, id = null, complt = false;


function getId(_id) {
    todoId = _id
}

$(window).scroll(function () {
    if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
        page++
        loadData(complt)
    }
})

function onDelete(_id) {
    todoId = _id
    $("#todos-deleteModal").show()

}

function cancleDelete() {
    $("#todos-deleteModal").hide()
}

function cancleEdit() {
    $("#todos-formModal").hide()
}

const searchTodo = () => {
    page = 1
    title = $("#titleSearch").val()
    startdate = $("#startdate").val()
    enddate = $("#enddate").val()
    if ($("#bycomplete").val()) complete = $("#bycomplete").val()
    else complete = ""
    loadData(!complt)

}

const reset = () => {
    title = ''
    startdate = ''
    enddate = ''
    complete = ''
    $('#titleSearch').val('')
    $('#startdate').val('')
    $('#enddate').val('')
    $('#complete').val('')
    page = 1

    sortBy = '_id'
    sortMode = 'desc'
    let defaultMode = `
    <button class="sortingbydeadline" onclick="sortToggle()"><i class="fa-solid fa-sort"></i>&nbsp;sort by deadline</button>
    `
    $('#btnClick').html(defaultMode)
    loadData(!complt)
}

const sortToggle = () => {
    page = 1;
    sortBy = 'deadline';
    sortMode = (sortMode === 'asc') ? 'desc' : 'asc';

    const arrowIcon = (sortMode === 'asc') ? 'fa-sort-down' : 'fa-sort-up';
    const buttonText = `<i class="fa-solid ${arrowIcon}" style="color: #ffffff;"></i>&nbsp;sort by deadline`;
    
    $("#btnClick").html(`<button class="sortingbydeadline" onclick="sortToggle()">${buttonText}</button>`);
    loadData(!complt);
}


const getData = async (_id) => {
    try {
        getId(_id)
        const response = await $.ajax({
            url: `/api/todos/${todoId}`,
            method: "GET",
            dataType: "json",
        });
        $('#titleEditM').val(response.title)
        $('#deadlineM').val(moment(response.deadline).format('YYYY-MM-DDTHH:mm'))
        $('#completeM').prop('checked', response.complete)
        $("#todos-formModal").show()
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
                startdate,
                enddate,
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
                    <a type="button" onclick="getData('${item._id}')"><i class="fa-solid fa-pencil"></i></a>
                    <a type="button" onclick="onDelete('${item._id}')"><i class="fa-solid fa-trash mx-2"></i></a>
                 </div>    
                </div>`
        });

        if (page === 1) {
            $('#showTodos').html(list)
        } else if (page > 1) {
            $('#showTodos').append(list)
        }
    } catch (error) {
        throw error

    }
}
loadData(complt)

$('#saveBtn').click(() => {
    addTodo()
})

$('#btn-sub').click(() => {
    updateTodos()
})

const addTodo = async () => {
    try {
        title = $('#title').val()
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
        <a type="button" onclick="getData('${response[0]._id}')"><i class="fa-solid fa-pencil"></i></a>
        <a type="button" onclick="onDelete('${response[0]._id}')"><i class="fa-solid fa-trash mx-2"></i></a>
        </div>
         </div>`

        $('#showTodos').prepend(addList)
        title = ''
        $('#title').val('')

    } catch (error) {
        throw error
    }
}

function handleTitleKeyPress(event) {
    if (event.key === "ENTER") {
        addTodo();
    }
}
$('#title').on('keypress', handleTitleKeyPress);

const updateTodos = async () => {
    try {
        let title = $('#titleEditM').val()
        let deadline = $('#deadlineM').val()
        let complete = $('#completeM').prop('checked')
        const response = await $.ajax({
            url: `/api/todos/${todoId}`,
            method: "PUT",
            dataType: "json",
            data: {
                title,
                executor,
                deadline,
                complete: Boolean(complete)
            }
        })
        console.log(response, 'apa nih')
        let editList = ""
        editList += `
        ${moment(new Date(deadline)).format('YYYY-MM-DDTHH:mm')} ${title}
        `
        $(`#${response._id}`).attr('class', `show-todos ${response.complete == false && new Date(`${response.deadline}`).getTime() < new Date().getTime() ? ' redClr' : response.complete == true ? ' greenclr' : ' greyClr'}`).html(editList)
        title = $('#titleSearch').val()
        if ($('#bycomplete').val()) {
            complete = $('#bycomplete').val()
        } else {
            complete = ''
        }
        $("#todos-formModal").hide()
        loadData(complt)

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
        $("#todos-deleteModal").hide()
        $(`#${todoId}`).remove()
    } catch (error) {
        throw error
    }
    loadData(complt)
}