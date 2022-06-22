(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
      var cols = [
        {
          id: "id",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "name",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "status",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "created_at",
          dataType: tableau.dataTypeEnum.date
        },
        {
          id: "updated_at",
          dataType: tableau.dataTypeEnum.date
        }
      ];

      var tableSchema = {
          id: "collectionsTooldata",
          alias: "Collections Tool Data",
          columns: cols
      };

      schemaCallback([tableSchema]);
  };

  // Download the data
  myConnector.getData = function(table, doneCallback) {
    var xmlhttp = new XMLHttpRequest();
    var url = "https://api.tooldata.io/collections";
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var value = JSON.parse(this.responseText);
        getTableJson(value);
      }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Authorization", "ApiKey aAJoMJ8DNOqXPhRKNCNTG9yhc/+k2FSQwTfaIy5jPFM=");
    xmlhttp.send();

    function getTableJson(value) {
      var tableData = [];
      // Iterate over the JSON object
      for (var i = 0, len = value.length; i < len; i++) {
          tableData.push({
              "id": value[i].id,
              "name": value[i].name,
              "status": value[i].status,
              "created_at": value[i].created_at,
              "updated_at": value[i].updated_at
          });
      }

      table.appendRows(tableData);
      doneCallback();
    };
  };

  tableau.registerConnector(myConnector);
})();

// Create event listeners for when the user submits the form
$(document).ready(function() {
    $("#submitButton").click(function() {
      var xmlhttp = new XMLHttpRequest();
      var url = "https://api.tooldata.io/collections";
      var tableData = [];
      
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var value = JSON.parse(this.responseText);
          getTableJson(value);
        }
      };
      
      xmlhttp.open("GET", url, true);
      xmlhttp.setRequestHeader("Accept", "application/json");
      xmlhttp.setRequestHeader("Authorization", "ApiKey aAJoMJ8DNOqXPhRKNCNTG9yhc/+k2FSQwTfaIy5jPFM=");
      xmlhttp.send();
      console.log(tableData);

      function getTableJson(value) {
          // Iterate over the JSON object
          for (var i = 0, len = value.length; i < len; i++) {
              tableData.push({
                  "id": value[i].id,
                  "name": value[i].name,
                  "status": value[i].status,
                  "created_at": value[i].created_at,
                  "updated_at": value[i].updated_at,
                  "tags": value[i].tags
              });
          }
      };
      tableau.connectionName = "Collections Tooldata"; // This will be the data source name in Tableau
      tableau.submit(); // This sends the connector object to Tableau
    });
});