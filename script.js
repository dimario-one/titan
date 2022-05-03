let button = document.getElementById("button");
let input = document.getElementById("input-point");
let inputTime = document.getElementById("input-time");
let addButton = document.getElementById("addpoint");
let plan = document.getElementById("input-plan");
let planValue;

// Фактический график
var trace1 = {
  x: [1649959200, 1649962800, 1649966400, 1649970000, 1650045600],
  y: [1, 5, 3, 5, 10],
  mode: "lines",
  type: "scatter",
  line: { color: "#ff0000" },
  name: "Добыто фактически",
};
// Добыто за час
var trace2 = {
  x: [1649959200, 1650045600],
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
  x: [1649959200, 1650045600],
  y: [],
  mode: "lines",
  type: "scatter",
  line: { color: "#0f0", width: 3, dash: "dash" },
  name: "Прогноз",
};

var data = [trace4, trace1, trace2, trace3];
// Прогноз
function forecast() {
  trace4.x = trace1.x;
  trace4.y = trace1.y;
  let raznx = trace1.x[trace1.x.length - 1] - trace1.x[trace1.x.length - 2];
  let razny = trace1.y[trace1.y.length - 1] - trace1.y[trace1.y.length - 2];
  for (i = 0; i < 4; i++) {
    let nextX = raznx + trace1.x[trace1.x.length - 1];
    let nextY = razny + trace1.y[trace1.y.length - 1];
    trace4.x.push(nextX);
    sortArray(trace4.x);
    trace4.y.push(nextY);
  }
  Plotly.update("plotDiv", data, layout);
}

// Функция устанавливает цвет графика прогноза придостижении или не достижении плана
function colorForecastGraph(){
if(trace4.y[trace4.y.length-1]>parseInt(planValue)){
  trace4.line.color="#0f0";
}else{
  trace4.line.color="#FF0000";
}
}

//Функция перевода времени из юникс формата
// function convertFromUnixTime(timestamp, utc = false) {
//   if (!timestamp) return "";
//   let time = "";
//   if (!utc) {
//     let dt = new Date(timestamp * 1000);

//     year = dt.getFullYear();
//     month = ("0" + (dt.getMonth() + 1)).slice(-2);
//     day = ("0" + dt.getDate()).slice(-2);
//     hours = ("0" + dt.getHours()).slice(-2);
//     minutes = ("0" + dt.getMinutes()).slice(-2);
//     seconds = ("0" + dt.getSeconds()).slice(-2);
//     time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   } else {
//     let dt = new Date(timestamp * 1000);

//     year = dt.getUTCFullYear();
//     month = ("0" + (dt.getUTCMonth() + 1)).slice(-2);
//     day = ("0" + dt.getUTCDate()).slice(-2);
//     hours = ("0" + dt.getUTCHours()).slice(-2);
//     minutes = ("0" + dt.getUTCMinutes()).slice(-2);
//     seconds = ("0" + dt.getUTCSeconds()).slice(-2);

//     time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   }

//   return time;
// }
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
  rendergraph(data, 2);
}

// Функция отрисовки графика после добавлени точки
function rendergraph(data, value = 1) {
  if (value === 1) {
    Plotly.newPlot("plotDiv", data, layout,config);
    forecast();
  } else {
    Plotly.update("plotDiv", data, layout,config);
    forecast();
  }
}

// Функция устанавливающая план добычи
function setPlan(value) {
  planValue=value;
  let num = parseInt(value);
  trace3.y.push(num);
  trace3.y.push(num);
  colorForecastGraph();
  rendergraph(data, 2);
}
let config={
  responsive:true
}

var layout = {
  title: "Click Here<br>to Edit Chart Title",
  xaxis: {
    tickformat: "%d/%h/%m",
    type: "date",
    dtick: 86400000,
  },
};
rendergraph(data);

addButton.addEventListener("click", () => {
  addPoint(input.value, inputTime.value);
});

button.addEventListener("click", () => {
  setPlan(plan.value);
});
