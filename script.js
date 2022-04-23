let button=document.getElementById("button");
let input = document.getElementById("input-point");
let inputTime = document.getElementById("input-time");
let addButton=document.getElementById("addpoint");

// Фактический график
var trace1 = {
    x: [ '2022-04-15 00:00:00', '2022-04-15 23:59:59'],
    y: [1, 5, 3, 10, 5],
    mode: "lines+markers",
    type: "scatter",
    line: {color: '#ff0000'}
};
// Добыто за час
var trace2 = {
    x: ['2022-04-15 00:00:00', '2022-04-15 23:59:59'],
    y: [4, 8],
    mode: "lines+markers",
    type: "bar",

};
// Прогноз
var trace3 = {
    x: [ '2022-04-15 00:00:00', '2022-04-16 00:00:00'],
    y: [15,15],
    mode: "lines+markers",
    type: "scatter",
    line: {color: '#000'}
};

//  Функция добавления точки на графике
function setValue(value, date) {
    let newData = Object.entries(trace1);
    let arr = [];
    let elementX;
    let elementY;
    // Создаем массив
    arr.push(newData[0]);
    arr.push(newData[1]);

    for (i = 0; i < arr.length; i++) {
        let elem = arr[i];
        for (a = 0; a < elem.length; a++) {
            // Ось икс
            if (elem[a] === "x") {
                elementX = elem[a + 1];
                for (b = 0; b < elementX.length; b++) {
                    if (date < elementX[b]) {
                        // Если дата меньше элемента массива
                        elementX.splice(b, 0, date);
                        console.log(elementX);
                    } else {
                        // если дата равна элементу массива
                        if (date === elementX[b]) {
                            elementX.splice(b, 1, date);
                        } else {
                            // если дата больше всех элементов массива
                            elementX.push(date);
                        }
                    }
                }
            } else {
                // Ось y
                if (elem[a] === "y") {
                    elementY = elem[a + 1];
                    for (b = 0; b < elementY.length; b++) {
                        if (value < elementY[b]) {
                            // Если value меньше элемента массива
                            elementY.splice(b, 0, value);
                            console.log(elementY);
                        } else {
                            // если value равна элементу массива
                            if (value === elementY[b]) {
                                elementY.splice(b, 1, value);
                            } else {
                                // если value больше всех элементов массива
                                elementY.push(value);
                            }
                        }
                    }
                }
            }
        }
    }
    trace1.x=elementX;
    trace1.y=elementY;
    Plotly.update("plotDiv", data, layout, { editable: true });
}

// Функция устанавливающая план добычи
function setPlan(value){
for(i=0;i< trace3.y.length;i++){
    trace3.y=value;
}
 
    Plotly.update("plotDiv", data, layout, { editable: true });
}

var data = [trace1, trace2,trace3];
var layout = { title: "Click Here<br>to Edit Chart Title" };
Plotly.newPlot("plotDiv", data, layout, { editable: true });
addButton.addEventListener("click",()=>{setValue(input.value, inputTime.value)})
button.addEventListener("click",()=>{setValue(15, 25)});