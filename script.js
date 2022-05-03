let button = document.getElementById("button");
let input = document.getElementById("input-point");
let inputTime = document.getElementById("input-time");
let addButton = document.getElementById("addpoint");
let plan = document.getElementById("input-plan");
let plotDiv = document.getElementById("plotDiv");

let planValue;

// Фактический график
var trace1 = {
  x: [1649959200, 1649962800, 1649966400, 1649970000, 1650045600],
  y: [1, 5, 3, 5, 7],
  mode: "lines+markers",
  type: "scatter",
  line: { color: "#FF00FF" },
  name: "Добыто фактически",
};
// Добыто за час
var trace2 = {
  x: [1649962800, 1649966400],
  y: [4, 8],
  // mode: "",
  type: "bar",
  name: "Добыто за час",
};
// план
var trace3 = {
  x: [1649959200, 1650045600],
  y: [],
  mode: "lines+markers",
  type: "scatter",
  line: { color: "#000" },
  name: "План добычи",
};
// прогноз
var trace4 = {
  x: [],
  y: [],
  mode: "lines",
  type: "scatter",
  line: { color: "#0f0", width: 3, dash: "dash" },
  name: "Прогноз",
};

var data = [trace4, trace1, trace2, trace3];

// Прогноз
function forecast(data) {
  let data2 = [...data];
  // let trace= data2[0];
  data2[0].x = [...data2[1].x];
  data2[0].y = [...data2[1].y];

  let raznx =
    new Date(data2[1].x[data2[1].x.length - 1]).valueOf() -
    new Date(data2[1].x[data2[1].x.length - 2]).valueOf();
  // let raznx = data2[1].x[data2[1].x.length - 1] - data2[1].x[data2[1].x.length - 2];
  let razny =
    data2[1].y[data2[1].y.length - 1] - data2[1].y[data2[1].y.length - 2];
  for (i = 0; i < 4; i++) {
    let nextX =
      (raznx + new Date(data2[1].x[data2[1].x.length - 1]).valueOf()) / 1000;

    let nextY = razny + data2[1].y[data2[1].y.length - 1];
    data2[0].x.push(convertFromUnixTime(nextX));
    sortArray(data2[0].x);
    data2[0].y.push(nextY);
  }
  trace4.y=[... data2[0].y];
  Plotly.update("plotDiv", data2, layout);
}

// Функция устанавливает цвет графика прогноза придостижении или не достижении плана
function colorForecastGraph() {
  if (trace4.y[trace4.y.length - 1] > parseInt(planValue)) {
    trace4.line.color = "#0f0";
  } else {
    trace4.line.color = "#FF0000";
  }
}

//Функция перевода времени из юникс формата
function convertFromUnixTime(timestamp, utc = false) {
  if (!timestamp) return "";
  let time = "";
  if (!utc) {
    let dt = new Date(timestamp * 1000);

    year = dt.getFullYear();
    month = ("0" + (dt.getMonth() + 1)).slice(-2);
    day = ("0" + dt.getDate()).slice(-2);
    hours = ("0" + dt.getHours()).slice(-2);
    minutes = ("0" + dt.getMinutes()).slice(-2);
    seconds = ("0" + dt.getSeconds()).slice(-2);
    time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else {
    let dt = new Date(timestamp * 1000);

    year = dt.getUTCFullYear();
    month = ("0" + (dt.getUTCMonth() + 1)).slice(-2);
    day = ("0" + dt.getUTCDate()).slice(-2);
    hours = ("0" + dt.getUTCHours()).slice(-2);
    minutes = ("0" + dt.getUTCMinutes()).slice(-2);
    seconds = ("0" + dt.getUTCSeconds()).slice(-2);

    time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return time;
}
// Проверка отсортирован массив или нет
function isSort(array) {
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[i - 1]) {
      return false;
    }
  }
  return true;
}

// Сортировка массива
function sortArray(array) {
  const newArray = array.sort((a, b) => a - b);
  return newArray;
}

// Добавление точки
function addPoint(value, time) {
  let newData = Object.entries(trace1);
  // Ось Х время
  trace1.x = [];
  let arrX = [];
  let aaa = newData[0];
  arrX = aaa[1];
  arrX.push(parseInt(time));
  trace1.x = sortArray(arrX);
  // Ось Y значение
  trace1.y = [];
  let arrY = [];
  let ddd = newData[1];
  arrY = ddd[1];
  arrY.push(parseInt(value));
  trace1.y = sortArray(arrY);
  rendergraph(2);
}

// Функция отрисовки графика после добавлени точки
function rendergraph(data, value = 1) {
  let trace11 = { ...trace1 };
  let trace22 = { ...trace2 };
  let trace33 = { ...trace3 };
  let trace44 = { ...trace4 };

  var data1 = [trace44, trace11, trace22, trace33];
  let trace1New = [];
  let trace2New = [];
  let trace3New = [];
  let trace4New = [];
  trace11.x.forEach(function (date) {
    let vol1 = convertFromUnixTime(date);
    trace1New.push(vol1);
  });
  trace22.x.forEach(function (date) {
    let vol2 = convertFromUnixTime(date);
    trace2New.push(vol2);
  });
  trace33.x.forEach(function (date) {
    let vol3 = convertFromUnixTime(date);
    trace3New.push(vol3);
  });
  trace44.x.forEach(function (date) {
    let vol4 = convertFromUnixTime(date);
    trace3New.push(vol4);
  });
  trace11.x = trace1New;
  trace22.x = trace2New;
  trace33.x = trace3New;
  trace44.x = trace4New;
  if (value === 1) {
    Plotly.newPlot("plotDiv", data1, layout, config);
  } else {
    Plotly.update("plotDiv", data1, layout, config);
  }
  forecast(data1);
}

// Функция устанавливающая план добычи
function setPlan(value) {
  planValue = value;
  let num = parseInt(value);
  trace3.y.push(num);
  trace3.y.push(num);
  colorForecastGraph();
  rendergraph(data, 2);
}
let config = {
  responsive: true,
};

var layout = {
  title: "Скважина 1-1",
  xaxis: {
    title: "Дата",
    autorange: true,
    range: ["2022-04-15", "2022-04-16"],
    type: "date",
  },
  yaxis: { autorange: true, title: "Добыто" },
};
rendergraph(data);

addButton.addEventListener("click", () => {
  addPoint(input.value, inputTime.value);
});

button.addEventListener("click", () => {
  setPlan(plan.value);
});

// Функция клика на точки
plotDiv.on("plotly_click", function (data) {
  var pts = "";
  for (var i = 0; i < data.points.length; i++) {
    annotate_text =
      "Время = " +
      data.points[i].x +
      " " +
      " Добыто " +
      data.points[i].y.toPrecision(4);

    annotation = {
      text: annotate_text,
      x: data.points[i].x,
      y: parseFloat(data.points[i].y.toPrecision(4)),
    };

    annotations = self.layout.annotations || [];
    annotations.push(annotation);
    Plotly.relayout("plotDiv", { annotations: annotations });
  }
});
