//configuration for the datatable plugin
function dataTablePluginConfiguration(){
    $("#phonesTable").DataTable({
        responsive: true,
        columns: [{ data: "image" }, { data: "brand" }, { data: "model" }, { data: "os" }, { data: "screensize" }, { data: "id" }],
        columnDefs: [
            {
                targets: 0,
                "orderable": false,
                render: function(data) {
                    if (data == '<input value="t" required="" type="text" name="image">') {
                        return data;
                    }
                    return '<img class="imageInTable" src="' + data + '">';
                }
            },
            {
                targets: 5,
                "orderable": false,
                render: function(phoneId) {
                    return '<button type="button" data-toggle="modal" data-target="#phoneUpdateModal" id='+ phoneId +' onclick="getPhoneById('+phoneId+')" class="btn btn-warning">Update</button> <button type="button" id='+phoneId+' onclick="deletePhoneById('+phoneId+')" class="btn btn-danger">Delete</button>';
                }
            }
        ],
        lengthMenu: [3, 10, 20]
    });
}