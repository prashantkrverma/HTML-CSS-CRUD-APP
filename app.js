const request = ({ url, method, data }, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 201) {
                callback(null, JSON.parse(xhr.response))
            } else {
                callback(xhr.status, null)
            }
        }
    }
    xhr.ontimeout = function () {
        console.log('Requets Timeout')
    }
    xhr.open(method, url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if(data) xhr.send(JSON.stringify(data))
    else xhr.send()
}
let people = []
window.onload = fetchPeople()
function fetchPeople() {
    request({
        url: `https://simple-nodejs-crud.herokuapp.com/api/people`,
        method: "GET"
    }, (err, res) => {
        if (!err) {
            console.log("RESPONSE: ", res)
            people = res.data.property
            let table = document.getElementById("table-body")
            clearChildDOM(table)
            people.forEach((element, index) => {
                let row = DOMCreator("tr")
                row.append(DOMCreator("th", index + 1, { name: "scope", value: "row" }))
                row.append(DOMCreator("td", element["fName"]))
                row.append(DOMCreator("td", element["lName"]))
                row.append(DOMCreator("td", element["phone"]))
                row.append(DOMCreator("td", element["email"]))
                let actions = DOMCreator("td")
                actions.innerHTML = `<span class="d-flex align-items-center"><i class="fas fa-user-edit p-2 py-0 fs-5 text-secondary" onclick="showEditForm('${element["_id"]}')"></i><i class="fas fa-trash p-2 py-0 fs-5 text-danger" onclick="deleteUser('${element["_id"]}')"></i></span`
                row.append(actions)
                table.append(row)
            });
        }
        else console.log("ERROR: ", err)
    })
}
const DOMCreator = (element = "div", data, attribute) => {
    let Element = document.createElement(element)
    if (data) Element.append(data)
    if (attribute) Element.setAttribute(attribute.name, attribute.value)
    return Element
}
const clearChildDOM = (DOM) => {
    while (DOM.firstChild) {
        DOM.removeChild(DOM.firstChild);
    }
}
const myModal = new bootstrap.Modal(document.getElementById('register-form'), {
    keyboard: false
})
const registerUser = (form) => {
    let data = getFormValues(form)
    request({
        url: `https://simple-nodejs-crud.herokuapp.com/api/people`,
        method: "POST",
        data
    }, (err, res)=>{
        if (!err) {
            console.log("RESPONSE: ", res)
            fetchPeople()
            alert(res.data.title)
        }
        else console.log("ERROR: ", err)
    })
    myModal.hide()
}
const showRegisterForm = () => {
    myModal.show()
    const editForm = document.querySelector('#user-form')
    setFormValues(editForm, null)
    editForm.setAttribute("onsubmit", "registerUser(this)")
}
const showEditForm = (id) => {
    myModal.show()
    const editForm = document.querySelector('#user-form')
    getUser(id)
    setFormValues(editForm, getUser(id))
    editForm.setAttribute("onsubmit", `updateUser(this,'${id}')`)
}
const updateUser = (form, id) => {
    let data = getFormValues(form)
    if(window.confirm("Are you sure you want to update this user details?")){
        request({
            url: `https://simple-nodejs-crud.herokuapp.com/api/people/${id}`,
            method: "PUT",
            data
        }, (err, res)=>{
            if (!err) {
                console.log("RESPONSE: ", res)
                fetchPeople()
                alert(res.data.title)
            }
            else console.log("ERROR: ", err)
        })
    }
    myModal.hide()
}
const deleteUser = (id) => {
    if(window.confirm("Are you sure you want to delete this user?")){
        request({
            url: `https://simple-nodejs-crud.herokuapp.com/api/remove/${id}`,
            method: "DELETE",
        }, (err, res) => {
            if (!err) {
                console.log("RESPONSE: ", res)
                fetchPeople()
                alert(res.data.title)
            }
            else console.log("ERROR: ", err)
        })
    }
    
}
const getFormValues = (form) => {
    let myObj = {}
    let Elements = form.elements
    for (let i = 0; i < form.length; i++)
        if (Elements[i].tagName === "INPUT") myObj[Elements[i].name] = Elements[i].value
    return myObj
}
const setFormValues = (form, data) => {
    let Elements = form.elements
    for (let i = 0; i < form.length; i++) {
        switch (Elements[i].name) {
            case "fName":
                Elements[i].value = data ? data.fName : ""
                break;
            case "lName":
                Elements[i].value = data ? data.lName : ""
                break;
            case "phone":
                Elements[i].value = data ? data.phone : ""
                break;
            case "email":
                Elements[i].value = data ? data.email : ""
                break;
            case "submit":
                Elements[i].innerHTML = data ? "Update" : "Register"
        }
    }
}
const getUser = (id) => people.filter(i => i._id === id)[0]
