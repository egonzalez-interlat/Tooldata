(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    var colsInfo = [
      {
        id: "total",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "limit",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "page",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "pages",
        dataType: tableau.dataTypeEnum.int
      }
    ];
    
    var tableInformation = {
      id: "infoMentionsTooldata",
      alias: "Information Mentions Tool Data",
      columns: colsInfo
    };

    var colsMentions = [
      {
        id: "id",
        dataType: tableau.dataTypeEnum.string
      },
      {
        id: "created_at",
        dataType: tableau.dataTypeEnum.datetime
      },
      {
        id: "text",
        dataType: tableau.dataTypeEnum.string
      },
      {
        id: "link",
        dataType: tableau.dataTypeEnum.string
      },
      {
        id: "image",
        dataType: tableau.dataTypeEnum.string
      },
      {
        id: "type_post",
        dataType: tableau.dataTypeEnum.string
      },
      {
        id: "location",
        dataType: tableau.dataTypeEnum.string
      },
      {
        id: "title",
        dataType: tableau.dataTypeEnum.string
      },
      {
        id: "sentiment",
        dataType: tableau.dataTypeEnum.string
      },
      {
        id: "shared",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "comments",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "score",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "engagement",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "likes",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "retweets",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "replies",
        dataType: tableau.dataTypeEnum.int
      },
      {
        id: "quoutes",
        dataType: tableau.dataTypeEnum.int
      }
    ];

    var tableMentions = {
        id: "mentionsTooldata",
        alias: "Mentions Tool Data",
        columns: colsMentions
    };

    schemaCallback([tableInformation, tableMentions]);
  };

  // Download the data
  myConnector.getData = function(table, doneCallback) {

    var Now = new Date();
    Now.setHours(Now.getHours() - 5);
    var until_date = Now.toISOString().slice(0,16) + ':00.000-05:00';
    Now.setHours(Now.getHours() - 1);
    var since_date = Now.toISOString().slice(0,16) + ':00.000-05:00';
    var xmlhttp = new XMLHttpRequest();
    var url = `https://api.tooldata.io/collections/b4344d499be94335b08cba0397ef0522/posts?since=${since_date}&until=${until_date}&limit=100`;
    
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

      if (table.tableInfo.id == "infoMentionsTooldata") {
        console.log('Information');
        tableData.push({
          "total": value.total === undefined ? null : value.total,
          "limit": value.limit === undefined ? null : value.limit,
          "page": value.page === undefined ? null : value.page,
          "pages": value.pages === undefined ? null : value.pages
        });
        console.log(tableData);
      }

      if (table.tableInfo.id == "mentionsTooldata") {
        console.log('Mentions');
        value = value.mentions;
        for (var i = 0, len = value.length; i < len; i++) {
          tableData.push({
            "id": value[i].id === undefined ? null : value[i].id,
            "created_at": value[i].created_at === undefined ? null : value[i].created_at,
            "text": value[i].text === undefined ? null : value[i].text,
            "link": value[i].link === undefined ? null : value[i].link,
            "image": value[i].image === undefined ? null : value[i].image,
            "type_post": value[i].type_post === undefined ? null : value[i].type_post,
            "location": value[i].location === undefined ? null : value[i].location,
            "sentiment": value[i].sentiment === undefined ? null : value[i].sentiment,
            "title": value[i].title === undefined ? null : value[i].title,
            "shared": value[i].shared === undefined ? null : value[i].shared,
            "comments": value[i].comments === undefined ? null : value[i].comments,
            "score": value[i].score === undefined ? null : value[i].score,
            "engagement": value[i].engagement === undefined ? null : value[i].engagement,
            "likes": value[i].likes === undefined ? null : value[i].likes,
            "retweets": value[i].retweets === undefined ? null : value[i].retweets,
            "replies": value[i].replies === undefined ? null : value[i].replies,
            "quoutes": value[i].quoutes === undefined ? null : value[i].quoutes
          });
        }
        console.log(tableData);
      }

      table.appendRows(tableData);
      doneCallback();
    };
  };

  tableau.registerConnector(myConnector);

  // Create event listeners for when the user submits the form
  $(document).ready(function() {
      $("#submitButton").click(function() {
        tableau.connectionName = "Tooldata"; // This will be the data source name in Tableau
        tableau.submit(); // This sends the connector object to Tableau
      });
  });
})();