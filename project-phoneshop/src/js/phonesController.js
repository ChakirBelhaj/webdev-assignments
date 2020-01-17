//After html is loaded
$(document).ready(function() {
    formOnSubmit();
    dataTablePluginConfiguration();
    getPhoneDataFromApi();
});

//this function is triggered onsubmit
function formOnSubmit(){
    $("#phonesForm").submit(function(e) {
        e.preventDefault();
        createPhone();
    });
}

// after submitting this function adds the formdata to the api through a post request and creates a new tablerow
function createPhone() {
    var formData = $("#phonesForm").serializeArray();
    data = {
        image: formData[1].value,
        brand: formData[2].value,
        model: formData[3].value,
        os: formData[4].value,
        screensize: formData[5].value
    };

    $.ajax({
        url: "http://localhost:8080/api/phones",
        data: data,
        method: "POST",
        success: function(result) {
            addPhoneToTable(data);
            alert(data.brand + " successfully added");
        },
        error: function(error) {
            alert(error.responseText);
        }
    });
}

//calls an ajax get request to reset the data in the table
function resetTableData() {
    $.ajax({
        url: "https://wt.ops.labs.vu.nl/api20/2b9115a4/reset",
        method: "GET",
        success: function(result) {
            $("#phonesTable").DataTable().clear().draw();
            getPhoneDataFromApi();
            alert("successfully resetted");
        },
        error: function(error) {
            alert(error.responseText);
        }
    });
}

// grabs the data that is stored in our api through an ajax request and calls the populatetable function
function getPhoneDataFromApi() {
    $.ajax({
        url: "http://localhost:8080/api/phones",
        context: document.body,
        method: "GET",
        success: function(result) {
            populateTable(result);
        }
    });
}

// populates table with given data
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
            screensize: data.screensize
        })
        .draw();
}