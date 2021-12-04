baseUrl = "http://localhost:8080/pcs";

var dataTableInstance;

$(document).ready(function () {

    var employee = JSON.parse(sessionStorage.getItem("employee"));

    if (employee != null) {
        document.getElementById('userName').innerHTML = employee.name;
        dataTableInstance = $('#dataTable').DataTable();
        loadTableData();
    } else {
        $('#userModel').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

});

var loadTableData = function () {

    // $.ajax({
    //     type: "GET",
    //     url: baseUrl + "/report/stock-report",
    //     contentType: "application/json",
    //     headers: {
    //         'Authorization': `Bearer ` + sessionStorage.getItem("token"),
    //     },
    //     success: function (response) {
    //         createTableBody(response);
    //         createCharts(response);
    //     },
    //     error: function (error) {
    //         console.log(error);
    //         console.log("Error occured while getting stock report.");
    //         if (error.status == 401) {
    //             $('#userModel').modal({
    //                 backdrop: 'static',
    //                 keyboard: false
    //             })

    //         } else if (error.status == 403) {
    //             $('#userSessionExpiredModel').modal({
    //                 backdrop: 'static',
    //                 keyboard: false
    //             });
    //         } else {
    //             $('#generalError').modal({
    //                 backdrop: 'static',
    //                 keyboard: false
    //             });
    //         }
    //     }
    // });

    GetRequest("report/stock-report", dataLoadSuccesss);
}

function dataLoadSuccesss(response) {
    createTableBody(response);
    createCharts(response);
}

var createTableBody = function (data) {
    $("#dataTable tbody").empty();

    for (const tableRow of data) {
        var usedStockPercentage = ((tableRow.stock) * 100 / tableRow.maximumCapacity).toFixed(2);
        var percentageClass = "percentage-green";
        if (usedStockPercentage <= 30) {
            percentageClass = "percentage-green";
        } else if (usedStockPercentage <= 60) {
            percentageClass = "percentage-blue";
        } else if (usedStockPercentage <= 90) {
            percentageClass = "percentage-orange";
        } else {
            percentageClass = "percentage-red";
        }

        dataTableInstance.row.add([
            tableRow.address,
            tableRow.monthlyExpectedStock.toFixed(2) + 'Kg',
            tableRow.maximumCapacity.toFixed(2) + 'Kg',
            tableRow.stock.toFixed(2) + 'Kg',
            tableRow.totalMonthlyPaddyLimitPerFarmer.toFixed(2) + 'Kg',
            '<p class=\" ' + percentageClass + '\">' + usedStockPercentage + '%</p>'
        ]).draw(false);
    }

    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#dataTable tbody').append(div);
    }
}

Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var createCharts = function (data) {

    var totalCapacity = 0;
    var currentStock = 0;

    data.forEach(element => {
        totalCapacity += element.maximumCapacity;
        currentStock += element.stock;

        var elementUsedcapacityPercentage = ((element.stock * 100) / element.maximumCapacity).toFixed(2);
        element.percentageStock = elementUsedcapacityPercentage;
    });

    // loading pie chart 
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Free Stock (Kg)", "Used Stock (Kg)"],
            datasets: [{
                data: [(totalCapacity - currentStock), currentStock],
                backgroundColor: ['#1cc88a', 'red'],
                hoverBackgroundColor: ['#1cc88a', 'red'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
    document.getElementById("totalStock").innerHTML = "Total Stock : " + totalCapacity + "Kg";
    document.getElementById("currentStock").innerHTML = "Current Stock : " + currentStock + "Kg";


    //  bar chart loading logics 
    var barChartDataSet = [
        {
            branch: "-",
            percentage: 0,
            capacity: 0,
            stock: 0
        },
        {
            branch: "-",
            percentage: 0,
            capacity: 0,
            stock: 0
        },
        {
            branch: "-",
            percentage: 0,
            capacity: 0,
            stock: 0
        },
        {
            branch: "-",
            percentage: 0,
            capacity: 0,
            stock: 0
        },
        {
            branch: "-",
            percentage: 0,
            capacity: 0,
            stock: 0
        },
        {
            branch: "-",
            percentage: 0,
            capacity: 0,
            stock: 0
        },
    ];

    data.sort((a, b) => {
        return b.percentageStock - a.percentageStock;
    });

    for (let i = 0; i < data.length; i++) {
        barChartDataSet[i].branch = data[i].address;
        barChartDataSet[i].percentage = parseFloat(data[i].percentageStock);
        barChartDataSet[i].capacity = data[i].maximumCapacity;
        barChartDataSet[i].stock = data[i].stock;

        if (i == 6) {
            break;
        }
    }

    // Bar Chart Example
    var ctx = document.getElementById("myBarChart");
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [barChartDataSet[0].branch, barChartDataSet[1].branch, barChartDataSet[2].branch,
            barChartDataSet[3].branch, barChartDataSet[4].branch, barChartDataSet[5].branch],
            datasets: [{
                label: "Used Stock",
                backgroundColor: "#4e73df",
                hoverBackgroundColor: "#2e59d9",
                borderColor: "#4e73df",
                data: [barChartDataSet[0].percentage, barChartDataSet[1].percentage, barChartDataSet[2].percentage,
                barChartDataSet[3].percentage, barChartDataSet[4].percentage, barChartDataSet[5].percentage],
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'Branch'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: true
                    },
                    ticks: {
                        maxTicksLimit: 6
                    },
                    maxBarThickness: 25,
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        // max: 100,
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return (value) + '%';
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: true,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: true
            },
            tooltips: {
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ' : ' + (tooltipItem.yLabel) + '%';
                    }
                }
            },
        }
    });

}

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}