/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.93319973279893, "KoPercent": 0.06680026720106881};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5061614294516328, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "/parabank/services_proxy/bank/requestLoan?customerId=12656&amount=24&downPayment=2&fromAccountId=13788-1,182"], "isController": false}, {"data": [0.75, 500, 1500, "Account Opener"], "isController": true}, {"data": [0.07317073170731707, 500, 1500, "/parabank/login.htm-1,168"], "isController": false}, {"data": [0.07317073170731707, 500, 1500, "login"], "isController": true}, {"data": [0.2926829268292683, 500, 1500, "/parabank/login.htm-1,168-1"], "isController": false}, {"data": [0.52, 500, 1500, "/parabank/index.htm-949"], "isController": false}, {"data": [0.2073170731707317, 500, 1500, "/parabank/login.htm-1,168-0"], "isController": false}, {"data": [0.08, 500, 1500, "/parabank/services_proxy/bank/customers/13100/accounts-952"], "isController": false}, {"data": [0.0, 500, 1500, "Request Loan"], "isController": true}, {"data": [0.74, 500, 1500, "/parabank/logout.htm-953-1"], "isController": false}, {"data": [1.0, 500, 1500, "/parabank/logout.htm-953-0"], "isController": false}, {"data": [0.6321428571428571, 500, 1500, "/parabank/register.htm-1,022"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "/parabank/services_proxy/bank/billpay?accountId=13788&amount=4-1,172"], "isController": false}, {"data": [0.9776119402985075, 500, 1500, "/parabank/logout.htm-1,023-0"], "isController": false}, {"data": [0.6791044776119403, 500, 1500, "/parabank/logout.htm-1,023-1"], "isController": false}, {"data": [0.376865671641791, 500, 1500, "/parabank/logout.htm-1,023"], "isController": false}, {"data": [1.0, 500, 1500, "/parabank/requestloan.htm-1,181"], "isController": false}, {"data": [0.4875, 500, 1500, "/parabank/logout.htm-1,186"], "isController": false}, {"data": [1.0, 500, 1500, "/parabank/logout.htm-1,186-0"], "isController": false}, {"data": [0.45, 500, 1500, "/parabank/transfer.htm-1,070"], "isController": false}, {"data": [0.4875, 500, 1500, "Log out"], "isController": true}, {"data": [0.875, 500, 1500, "/parabank/logout.htm-1,186-1"], "isController": false}, {"data": [0.75, 500, 1500, "/parabank/services_proxy/bank/createAccount?customerId=12656&newAccountType=0&fromAccountId=13788-1,185"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "/parabank/services_proxy/bank/transfer?fromAccountId=14343&toAccountId=14343&amount=20-1,075"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "Transfer funds"], "isController": true}, {"data": [0.803448275862069, 500, 1500, "/parabank/register.htm-1,018"], "isController": false}, {"data": [0.45, 500, 1500, "/parabank/logout.htm-953"], "isController": false}, {"data": [0.5, 500, 1500, "Bill payment"], "isController": true}, {"data": [0.95, 500, 1500, "/parabank/billpay.htm-1,171"], "isController": false}, {"data": [0.0, 500, 1500, "/parabank/login.htm-950-1"], "isController": false}, {"data": [0.0, 500, 1500, "/parabank/login.htm-950"], "isController": false}, {"data": [0.012987012987012988, 500, 1500, "/parabank/login.htm-950-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1497, 1, 0.06680026720106881, 2146.9485637942607, 310, 13930, 678.0, 6612.2, 9136.299999999997, 12975.08, 65.5342993477214, 95.97848458772928, 51.542047892133255], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/parabank/services_proxy/bank/requestLoan?customerId=12656&amount=24&downPayment=2&fromAccountId=13788-1,182", 1, 0, 0.0, 2187.0, 2187, 2187, 2187.0, 2187.0, 2187.0, 2187.0, 0.45724737082761774, 0.16610939643347053, 0.32060899634202106], "isController": false}, {"data": ["Account Opener", 2, 0, 0.0, 668.0, 433, 903, 668.0, 903.0, 903.0, 903.0, 1.4958863126402393, 0.4981418287210172, 0.9948228309648467], "isController": true}, {"data": ["/parabank/login.htm-1,168", 41, 0, 0.0, 6513.999999999998, 1026, 13505, 6468.0, 13139.800000000001, 13463.1, 13505.0, 2.17092025839246, 5.337793620274278, 3.0579240244096155], "isController": false}, {"data": ["login", 41, 0, 0.0, 6513.999999999998, 1026, 13505, 6468.0, 13139.800000000001, 13463.1, 13505.0, 2.141998850634763, 5.2666825303014475, 3.017185785747871], "isController": true}, {"data": ["/parabank/login.htm-1,168-1", 41, 0, 0.0, 2914.365853658537, 437, 8473, 1911.0, 6726.200000000001, 7108.7, 8473.0, 2.4651274651274653, 5.134879768668831, 1.7321771472162095], "isController": false}, {"data": ["/parabank/index.htm-949", 50, 0, 0.0, 906.8599999999999, 357, 2783, 706.0, 1591.3999999999999, 1810.1999999999985, 2783.0, 8.791981712678037, 13.093527452962897, 4.636396606295059], "isController": false}, {"data": ["/parabank/login.htm-1,168-0", 41, 0, 0.0, 3598.585365853657, 531, 8550, 2182.0, 7288.2, 8464.3, 8550.0, 2.233358753676871, 0.8392117877764462, 1.576554244062534], "isController": false}, {"data": ["/parabank/services_proxy/bank/customers/13100/accounts-952", 50, 0, 0.0, 2458.579999999999, 1044, 4819, 2395.5, 3903.9, 4523.799999999999, 4819.0, 6.2375249500998, 2.2386866891217565, 3.2223151353542914], "isController": false}, {"data": ["Request Loan", 1, 0, 0.0, 2565.0, 2565, 2565, 2565.0, 2565.0, 2565.0, 2565.0, 0.3898635477582846, 1.122380604288499, 0.5040813840155945], "isController": true}, {"data": ["/parabank/logout.htm-953-1", 50, 0, 0.0, 611.3999999999999, 327, 1436, 522.5, 1302.5999999999995, 1406.9499999999998, 1436.0, 10.254306808859722, 15.631809500615258, 6.098508639253486], "isController": false}, {"data": ["/parabank/logout.htm-953-0", 50, 0, 0.0, 330.48, 310, 442, 326.0, 345.5, 365.29999999999984, 442.0, 10.615711252653927, 4.074193869426751, 6.178675690021231], "isController": false}, {"data": ["/parabank/register.htm-1,022", 140, 1, 0.7142857142857143, 1161.2499999999993, 324, 6030, 476.0, 3228.7000000000003, 3499.5499999999997, 5603.600000000004, 7.205352547606794, 12.708581285383428, 7.058390697375193], "isController": false}, {"data": ["/parabank/services_proxy/bank/billpay?accountId=13788&amount=4-1,172", 21, 0, 0.0, 450.47619047619037, 336, 773, 372.0, 741.2, 770.6999999999999, 773.0, 3.4285714285714284, 1.1222895408163265, 2.638392857142857], "isController": false}, {"data": ["/parabank/logout.htm-1,023-0", 134, 0, 0.0, 348.65671641791033, 313, 796, 328.0, 361.5, 486.5, 792.1500000000001, 8.288488897136142, 3.3551176779860206, 4.82415955341127], "isController": false}, {"data": ["/parabank/logout.htm-1,023-1", 134, 0, 0.0, 995.2611940298506, 322, 6118, 485.5, 3115.5, 3787.75, 5578.650000000009, 8.394412077930212, 12.901661263546954, 4.9581209280836935], "isController": false}, {"data": ["/parabank/logout.htm-1,023", 134, 0, 0.0, 1344.283582089552, 647, 6435, 810.5, 3606.0, 4326.75, 5899.150000000009, 8.121212121212121, 15.769176136363637, 9.523555871212121], "isController": false}, {"data": ["/parabank/requestloan.htm-1,181", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 6.655092592592593, 1.5656001984126984], "isController": false}, {"data": ["/parabank/logout.htm-1,186", 40, 0, 0.0, 771.3000000000001, 650, 1962, 678.5, 906.7, 1246.4499999999991, 1962.0, 5.859088911674235, 11.303492795151604, 6.9290592500366195], "isController": false}, {"data": ["/parabank/logout.htm-1,186-0", 40, 0, 0.0, 329.0, 317, 348, 328.0, 341.6, 345.84999999999997, 348.0, 6.167129201356769, 2.4965129220629048, 3.6075296793092817], "isController": false}, {"data": ["/parabank/transfer.htm-1,070", 20, 0, 0.0, 1206.0, 429, 3459, 828.0, 2939.1000000000013, 3435.7499999999995, 3459.0, 2.6167735182519953, 6.522129113240874, 1.5281548475729425], "isController": false}, {"data": ["Log out", 40, 0, 0.0, 771.3000000000001, 650, 1962, 678.5, 906.7, 1246.4499999999991, 1962.0, 5.859947260474655, 11.305148741942574, 6.9300743480808675], "isController": true}, {"data": ["/parabank/logout.htm-1,186-1", 40, 0, 0.0, 441.825, 327, 1641, 347.5, 581.8, 900.4499999999992, 1641.0, 6.149116064565718, 9.37379900076864, 3.675057647963105], "isController": false}, {"data": ["/parabank/services_proxy/bank/createAccount?customerId=12656&newAccountType=0&fromAccountId=13788-1,185", 2, 0, 0.0, 668.0, 433, 903, 668.0, 903.0, 903.0, 903.0, 1.4958863126402393, 0.4981418287210172, 0.9948228309648467], "isController": false}, {"data": ["/parabank/services_proxy/bank/transfer?fromAccountId=14343&toAccountId=14343&amount=20-1,075", 21, 0, 0.0, 2413.5714285714284, 959, 4091, 2087.0, 3754.2, 4058.2999999999997, 4091.0, 2.886201209455745, 1.0679642403106102, 2.0265416695299616], "isController": false}, {"data": ["Transfer funds", 21, 0, 0.0, 3562.1428571428573, 1428, 6903, 3513.0, 4934.6, 6712.799999999997, 6903.0, 2.2300095571838168, 6.118630203355633, 2.806074619040034], "isController": true}, {"data": ["/parabank/register.htm-1,018", 145, 0, 0.0, 682.5655172413796, 443, 3788, 482.0, 1353.4000000000005, 2012.6999999999985, 3535.4599999999955, 6.410823238128924, 11.428000513971174, 3.220307457003272], "isController": false}, {"data": ["/parabank/logout.htm-953", 50, 0, 0.0, 942.3200000000004, 654, 1836, 844.5, 1629.7999999999995, 1765.4999999999998, 1836.0, 9.635767970707265, 18.387002553478514, 11.338965238967045], "isController": false}, {"data": ["Bill payment", 21, 0, 0.0, 817.5714285714286, 669, 1148, 750.0, 1061.8, 1139.8999999999999, 1148.0, 3.4285714285714284, 12.17904974489796, 4.542091836734694], "isController": true}, {"data": ["/parabank/billpay.htm-1,171", 20, 0, 0.0, 385.44999999999993, 329, 646, 345.5, 617.2000000000003, 645.25, 646.0, 8.936550491510276, 30.26034684986595, 5.2100787533512065], "isController": false}, {"data": ["/parabank/login.htm-950-1", 77, 0, 0.0, 4791.727272727273, 2199, 7480, 5015.0, 6716.6, 6784.7, 7480.0, 6.425769840607527, 13.463001622089626, 4.649897902236502], "isController": false}, {"data": ["/parabank/login.htm-950", 77, 0, 0.0, 10637.53246753247, 6981, 13930, 10890.0, 13311.6, 13540.599999999999, 13930.0, 5.2746951637210575, 13.41626153839567, 7.407237934991095], "isController": false}, {"data": ["/parabank/login.htm-950-0", 77, 0, 0.0, 5844.363636363635, 1104, 9388, 6061.0, 7464.2, 7857.399999999999, 9388.0, 7.022984312294783, 3.1487994801167454, 4.780293032880335], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /Welcome/", 1, 100.0, 0.06680026720106881], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1497, 1, "Test failed: text expected to contain /Welcome/", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/parabank/register.htm-1,022", 140, 1, "Test failed: text expected to contain /Welcome/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
