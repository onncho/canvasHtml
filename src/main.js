let dataObject = [
  {
    id: "",
    name: "",
    dataPoints: {
      x: "",
      y: ""
    }
  }
];

//https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD

let coins = ["BTC","ETH", "DAX"];
const coinsData = [];
let TimeInterval = 3000;
let chart;

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
  //{"BTC":{"USD":4155.61},"ETH":{"USD":159.91}}

  //coinsData = [];
  let newTime = Date.now();

  Object.keys(serverData).map(k => {
    let dataItem = {
      id: k,
      name: k,
      dataPoints: {
        x: newTime,
        y: serverData[k].USD
      }
    };

    var found = coinsData.find(function(element) {
      return element.name == k;
    });

    coinsData.map(e => {
      if (e.name == k) {
        e.dataPoints.push(dataItem.dataPoints);
      }
    });
    if (!found) {
      dataItem.dataPoints = [dataItem.dataPoints];
      coinsData.push(dataItem);
    }
  });
}

function drawChart() {
  var data = [];

  for (var i = 0; i < coinsData.length; i++) {
    data.push({
      type: "splineArea",
      xValueType: "dateTime",
      lineThickness: 3,
      //axisYType: "primary", // for align the y to right
      showInLegend: true,
      name: coinsData[i].name,
      dataPoints: coinsData[i].dataPoints
    });
  }

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
    data: [] //Later add datapoints,
  });

  data.map(item => {
    chart.options.data.push(item);
  });

  chart.render();
}

function initChart() {
  chart = new CanvasJS.Chart("chartContainer", {
    backgroundColor: "rgba(0,0,0,0)",
    legend: {
      fontColor: "#FFF"
    },
    title: {
      text: "Coin Chart"
    },
    data: [] //Later add datapoints,
  });

  chart.render(); // Render Chart before using set method
}

function init() {
  //initChart();
  fetchCoinsData(contructURL(coins));
}


var updateChart = function (count) {

	count = count || 1;

	for (var j = 0; j < count; j++) {



		yVal = yVal +  Math.round(5 + Math.random());
		dps.push({
			x: xVal,
			y: yVal
		});
		xVal++;
	}

	if (dps.length > dataLength) {
		dps.shift();
	}

	chart.render();
};



window.onload = function() {
  try {
    setInterval(init, 3000);

    var dps = []; // dataPoints
    var dataLength = 20; // number of dataPoints visible at any point

    var chart2 = new CanvasJS.Chart("chartContainer2", {
      title: {
        text: "Dynamic Data"
      },
      axisY: {
        includeZero: false
      },
      data: [
        {
          type: "line",
          dataPoints: dps
        }
      ]
    });
    
    updateChart(dataLength);
  } catch (error) {
    console.log(error);
  }
};
