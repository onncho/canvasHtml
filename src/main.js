let dataObject = [
  {
    name: "",
    dataPoints: {
      x: "",
      y: ""
    }
  }
];

let coins = ["BTC", "ETH", "DAX"];
const coinsData = [];
let TimeInterval = 3000;
let chart;
let refreshIntervalId;
let data = [];

//https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD
function contructURL(coins) {
  let SERVER_API = "https://min-api.cryptocompare.com/data/pricemulti?";
  let COINS_API = "fsyms=";
  let CURRENCY_API = "tsyms=";

  let fullRL = SERVER_API + COINS_API + coins + "&" + CURRENCY_API + "USD";

  return fullRL;
}

function fetchCoinsData(url) {
  // axios imported from a cdn
  axios
    .get(url)
    .then(function(response) {
      console.log("SERVER DATA", response);
      mapDataToDataObject(response.data);
      drawChart();
    })
    .catch(function(error) {
      console.log(error);
    });
}

function mapDataToDataObject(serverData) {
  let newTime = Date.now();

  Object.keys(serverData).map(k => {
    let dataItem = {
      name: k,
      dataPoints: {
        x: newTime,
        y: serverData[k].USD + Math.floor(Math.random() * 100)
      }
    };

    if (!coinsData[k]) {
      dataItem.dataPoints = [dataItem.dataPoints];
      coinsData[k] = dataItem;
    } else {
      coinsData[k].dataPoints.push(dataItem.dataPoints);
    }
  });
}

// TODO: improve chart resolution for small changes
function drawChart() {
  for (var key in coinsData) {
    //TODO: try the chart.options.data for update
    var found = data.find(function(element) {
      return element.name == key;
    });

    if (!found) {
      data.push({
        type: "line",
        xValueType: "dateTime",
        lineThickness: 3,
        showInLegend: true,
        name: key,
        dataPoints: coinsData[key].dataPoints
      });
    } else {
      found.dataPoints = coinsData[key].dataPoints;
    }
  }

  console.log("DATA TO CHART", data);
  chart.render();
}

function initChart() {
  console.log("DATA TO CHART", data);
  chart = new CanvasJS.Chart("chartContainer", {
    backgroundColor: "rgba(0,0,0,0)",
    legend: {
      fontColor: "#FFF"
    },
    axisY: {
      includeZero: false
    },
    title: {
      text: "Coin Chart"
    },
    data: data //Later add datapoints,
  });

  chart.render(); // Render Chart before using set method
}

function init() {
  initChart();
  fetchCoinsData(contructURL(coins));
}

function stopInterval() {
  alert("stopped");
  clearInterval(refreshIntervalId);
}

window.onload = function() {
  try {
    refreshIntervalId = setInterval(init, TimeInterval);
  } catch (error) {
    console.log(error);
  }
};
