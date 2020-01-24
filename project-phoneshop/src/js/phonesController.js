//After html is loaded
$(document).ready(function() {
    formOnSubmit();
    dataTablePluginConfiguration();
    getPhoneDataFromApi();
});

//this function is triggered onsubmit
function formOnSubmit() {
    $("#phonesForm").submit(function(e) {
        e.preventDefault();
        createPhone();
    });

    $("#modalForm").submit(function(e) {
        e.preventDefault();
        updatePhoneById($("#phoneId").val());
    });
}

// grabs the data that is stored in our api through an ajax request and calls the populatetable function
function getPhoneDataFromApi() {
    $.ajax({
        url: "http://localhost:8080/api/phones",
        context: document.body,
        method: "GET",
        async: false,
        success: function(response) {
            populateTable(response);
        }
    });
}

//refreshes the data inside the table
function refreshTable(){
    $("#phonesTable").DataTable().clear().draw();
    getPhoneDataFromApi();
}

//calls an ajax get request to reset the data in the table
function resetTableData() {
    $.ajax({
        url: "http://localhost:8080/api/reset",
        method: "GET",
        success: function(response) {
            refreshTable();
            alert("successfully resetted");
        },
        error: function(error) {
            alert(error.responseText);
        }
    });
}

//populates table with given data
function populateTable(data) {
    $.each(data, function(idx, phone) {
        addPhoneToTable(phone);
    });
}

//add new tablerow with given data
function addPhoneToTable(data) {
    var table = $("#phonesTable").DataTable();
    table.row
        .add({
            image: data.image,
            brand: data.brand,
            model: data.model,
            os: data.os,
            screensize: data.screensize,
            id: data.id
        })
        .draw();
}

// after submitting this function adds the formdata to the api through a post request and creates a new tablerow
function createPhone() {
    var formData = $("#phonesForm").serializeArray();
    $.ajax({
        url: "http://localhost:8080/api/phones",
        data: {
            image: formData[1].value,
            brand: formData[2].value,
            model: formData[3].value,
            os: formData[4].value,
            screensize: formData[5].value
        },
        method: "POST",
        success: function(response) {
            refreshTable();
            alert("Phone successfully added");
        },
        error: function(error) {
            alert(error.responseText);
        }
    });
}

// get request to acquire specific phone information by id
function getPhoneById(id) {
    $.ajax({
        url: "http://localhost:8080/api/phones/" + id,
        context: document.body,
        method: "GET",
        success: function(response) {
            fillModal(response);
        }
    });
}

//fills up modal with data
function fillModal(data) {
    $("#phoneId").val(data.id);
    $("#image").val(data.image);
    $("#brand").val(data.brand);
    $("#model").val(data.model);
    $("#os").val(data.os);
    $("#screensize").val(data.screensize);
}

//add new tablerow with given data
function updatePhoneById(id) {
    $.ajax({
        url: "http://localhost:8080/api/phones/" + id,
        data: {
            id: id,
            image: $("#image").val(),
            brand: $("#brand").val(),
            model: $("#model").val(),
            os: $("#os").val(),
            screensize: $("#screensize").val()
        },
        method: "PUT",
        success: function(response) {
            refreshTable();
            $('#closeModal').click();
            alert("successfully updated");
        },
        error: function(error) {
            alert(error.responseText);
        }
    });
}

// delete specific phone by id
function deletePhoneById(id){
    $.ajax({
        url: "http://localhost:8080/api/phones/" + id,
        method: "DELETE",
        success: function(response) {
            refreshTable();
            alert("successfully deleted");
        },
        error: function(error) {
            alert(error.responseText);
        }
    });
}