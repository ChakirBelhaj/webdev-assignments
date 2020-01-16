function dataTablePluginConfiguration(){
    $("#phonesTable").DataTable({
        responsive: true,
        columns: [{ data: "image" }, { data: "brand" }, { data: "model" }, { data: "os" }, { data: "screensize" }],
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
            }
        ],
        lengthMenu: [5, 10, 20]
    });
}