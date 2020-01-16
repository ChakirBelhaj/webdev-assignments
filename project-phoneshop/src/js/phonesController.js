$(document).ready(function() {
    $("#phonesForm").submit(function(e) {
        e.preventDefault();
        createPhone();
    });

    $(document).ready(function() {
        $("#phonesTable").DataTable({
            responsive: true,
            columns: [{ data: "image" }, { data: "brand" }, { data: "model" }, { data: "os" }, { data: "screensize" }],
            columnDefs: [
                {
                    targets: 0,
                    render: function(data) {
                        if (data == '<input value="t" required="" type="text" name="image">') {
                            return data;
                        }
                        return '<img class="imageInTable" src="' + data + '">';
                    }
                }
            ],
            lengthMenu: [5, 10, 20]
        });
        getPhoneData();
    });
});

function resetData() {
    $.ajax({
        url: "https://wt.ops.labs.vu.nl/api20/2b9115a4/reset",
        method: "GET",
        success: function(result) {
            $("#phonesTable").DataTable().clear().draw();
            getPhoneData();
            alert("successfully resetted");
        },
        error: function(error) {
            alert(error.responseText);
        }
    });
}

function getPhoneData() {
    $.ajax({
        url: "https://wt.ops.labs.vu.nl/api20/2b9115a4",
        context: document.body,
        method: "GET",
        success: function(result) {
            populateTable(result);
        }
    });
}

function populateTable(phonesData) {
    $.each(phonesData, function(idx, phone) {
        addPhoneToTable(phone);
    });
}

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

function createPhone() {
    var data = $("#phonesForm").serializeArray();

    $.ajax({
        url: "https://wt.ops.labs.vu.nl/api20/2b9115a4",
        data: {
            image: data[1].value,
            brand: data[2].value,
            model: data[3].value,
            os: data[4].value,
            screensize: data[5].value
        },
        method: "POST",
        success: function(result) {
            data = {
                image: data[1].value,
                brand: data[2].value,
                model: data[3].value,
                os: data[4].value,
                screensize: data[5].value
            };
            addPhoneToTable(data);
            alert(data.brand + " successfully added");
        },
        error: function(error) {
            alert(error.responseText);
        }
    });
}