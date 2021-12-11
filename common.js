        var options = "<option value=''>Show country</option>";
        const staticCountryList = {
            at: "Austria",
            be: "Belgium",
            bg: "Bulgaria",
            hr: "Croatia",
            cy: "Cyprus",
            cz: "Czechia",
            dk: "Denmark",
            ee: "Estonia",
            fi: "Finland",
            fr: "France",
            de: "Germany",
            gr: "Greece",
            hu: "Hungary",
            ie: "Ireland",
            it: "Italy",
            lv: "Latvia",
            lt: "Lithuania",
            lu: "Luxembourg",
            mt: "Malta",
            nl: "Netherlands",
            pl: "Poland",
            pt: "Portugal",
            ro: "Romania",
            sk: "Slovakia",
            si: "Slovenia",
            es: "Spain",
            se: "Sweden",
            gb: "United Kingdom"
        };

        for (var cc in staticCountryList) {
            options += "<option value='" + cc + "'>" + staticCountryList[cc] + "</option>";

        }
        document.getElementById("countryListExt").innerHTML = options;
            var xmlhttpext = new XMLHttpRequest();
            xmlhttpext.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var myObj = JSON.parse(this.responseText);
                    var i;
                    var list = "<option value='en'>Choose language</option>";
                    for (i = 0; i < myObj.languages.length; i++) {
                        list += "<option value='" + myObj.languages[i].languageCode + "'> " + myObj.languages[i].languageName + "</option>"

                    }
                    document.getElementById("langListExt").innerHTML = list;
                }
            };
            xmlhttpext.open("GET", "/varia/eci/languages.json", true);
            xmlhttpext.send();
        

        function loadJSONExt(prop = 'levelGoalPercentage', asc) {
            var lang = document.getElementById("langListExt").value;
            if (lang != "") {
                lang = "?language=" + lang;
            }
            var data_file = "/varia/eci/ecitable.php" + lang;
            var http_request = new XMLHttpRequest();
            try {
                // Opera 8.0+, Firefox, Chrome, Safari
                http_request = new XMLHttpRequest();
            } catch (e) {
                // Internet Explorer Browsers
                try {
                    http_request = new ActiveXObject("Msxml2.XMLHTTP");

                } catch (e) {

                    try {
                        http_request = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) {
                        // Something went wrong
                        alert("Your browser broke!");
                        return false;
                    }

                }
            }

            http_request.onreadystatechange = function () {
                var row = "";

                if (http_request.readyState == 4) {
                    // Javascript function JSON.parse to parse JSON data
                    var jsonObj = JSON.parse(http_request.responseText);

                    // jsonObj variable now contains the data structure and can
                    // be accessed as jsonObj.name and jsonObj.country.
                    var countriesJson = jsonObj.countryVotes.signatureCountryCount;
                    var targets = jsonObj.targets;
                    /* countriesJson.sort((a, b) => (a.count / a.treshold < b.count / b.treshold) ? 1 : (a.count / a.treshold === b.count / b.treshold) ? ((a.treshold > b.treshold) ? 1 : -1) : -1 ); */
                    var countryNames = jsonObj.countryNames;
                    var tableRow = [];
                    for (var i = 0; i < countriesJson.length; i++) {
                        var cc = countriesJson[i].countryCode;
                        tableRow[i] = {};
                        tableRow[i].countryFlag = "<img src='https://www.flagcdn.com/32x24/" + cc + ".png'>";
                        tableRow[i].countryName = countryNames[cc];
                        tableRow[i].signatureCount = countriesJson[i].totalCount;
                        tableRow[i].today = targets[cc].today;
                        tableRow[i].level1Value = targets[cc].Level1.value;
                        tableRow[i].level1Type = targets[cc].Level1.type;
                        tableRow[i].level1Percentage = parseFloat(100 * countriesJson[i].totalCount / targets[cc].Level1.value).toFixed(2);
                        tableRow[i].level2Value = targets[cc].Level2.value;
                        tableRow[i].level2Type = targets[cc].Level2.type;
                        tableRow[i].level2Percentage = parseFloat(100 * countriesJson[i].totalCount / targets[cc].Level2.value).toFixed(2);
                        tableRow[i].levelGoalValue = targets[cc].LevelGoal.value;
                        //tableRow[i].levelGoalType = targets[cc].LevelGoal.type;
                        tableRow[i].levelGoalNeed = needPerDay(targets[cc].LevelGoal.value, countriesJson[i].totalCount);
                        tableRow[i].levelGoalPercentage = parseFloat(100 * countriesJson[i].totalCount / targets[cc].LevelGoal.value).toFixed(2);
                        tableRow[i].level3Value = targets[cc].Level3.value;
                        tableRow[i].level3Type = targets[cc].Level3.type;
                        tableRow[i].level3Percentage = parseFloat(100 * countriesJson[i].totalCount / targets[cc].Level3.value).toFixed(2);
                        if (document.getElementById("countryListExt").value != "" && cc == document.getElementById("countryListExt").value) {
                            countryData = "<h1>" + countryNames[cc] + ": " + tableRow[i].signatureCount + "</h1>";
                        }
                    }

                    function needPerDay(target, signatures) {
                        var startDate = new Date("2020-09-25");
                        var endDate = new Date("2021-12-25");
                        var today = new Date();
                        var firstDate = today;
                        var days = [];
                        while (today <= endDate) {
                            // this line modifies the original firstDate reference which you want to make the while loop work
                            firstDate.setDate(firstDate.getDate() + 1);
                            // this pushes a new date , if you were to push firstDate then you will keep updating every item in the array
                            days.push(new Date(firstDate));
                        }
                        var remained = days.length;
                        var need = (target - signatures) / remained;
                        return Math.round(need);
                    }

                    function sortSignaturData(prop, asc) {
                        return function (a, b) {
                            if (asc == true) {
                                return a[prop] - b[prop];
                            }
                            else {
                                return b[prop] - a[prop];
                            }
                        }
                    }

                    tableRow.sort(sortSignaturData(prop, asc));

                    var rowCols = [];
                    var align = "";
                    for (var i = 0; i < tableRow.length; i++) {
                        rowCols[i] = "";
                        for ([key, value] of Object.entries(tableRow[i])) {
                            align = key == "countryFlag" || key == "countryName" ? "center" : "right";
                            if (key.includes("Percentage") && value >= 100) {
                                value = "<span style='background-color:green;color:yellow;font-weight: bold;'>" + value + "</span>";
                            }
                            rowCols[i] += "<td style='text-align:" + align + ";border: 1px solid black;padding:0 6px'>" + value + "</td>";
                        };


                        var cc = countriesJson[i].countryCode;
                        row += "<tr id='" + cc + "'>" + rowCols[i] + "</tr>";
                    }
                    console.log(rowCols);
                    document.getElementById("countryVotesExtended").getElementsByTagName("tbody")[0].innerHTML = row;
                    var allEU = "<tr>"
                        + "<td style='border: 1px solid black;text-align:center;min-width:34px;'><img src='https://www.countryflags.io/eu/shiny/32.png'>"
                        + "</td>"
                        + "<td style='border: 1px solid black;text-align:center;padding:6px'>EU27"
                        + "</td>"
                        + "<td style='text-align:right;border: 1px solid black;padding:6px'>"
                        + jsonObj.totalVotes.signatureCount
                        + "</td>"
                        + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                        + targets.all.today
                        + "</td>"
                        + "<td style='text-align:center;border: 1px solid black;padding:6px' colspan='2'>"
                        + targets.all.Level1.value
                        + "</td>"
                        + "<td style='text-align:right;border: 1px solid black;padding:6px'>"
                        + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.Level1.value).toFixed(2)
                        + "</td>"

                        + "<td style='text-align:center;border: 1px solid black;padding:6px' colspan='2'>"
                        + targets.all.Level2.value
                        + "</td>"
                        + "<td style='text-align:right;border: 1px solid black;padding:6px'>"
                        + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.Level2.value).toFixed(2)
                        + "</td>"

                        + "<td style='text-align:center;border: 1px solid black;padding:6px'>"
                        + targets.all.LevelGoal.value
                        + "</td>"
                        + "<td style='text-align:right;border: 1px solid black;padding:6px'>"
                        + needPerDay(targets.all.LevelGoal.value, jsonObj.totalVotes.signatureCount)
                        + "</td>"
                        + "<td style='text-align:right;border: 1px solid black;padding:6px'>"
                        + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.LevelGoal.value).toFixed(2)
                        + "</td>"
                        + "<td style='text-align:center;border: 1px solid black;padding:6px' colspan='2'>"
                        + targets.all.Level3.value
                        + "</td>"
                        + "<td style='text-align:right;border: 1px solid black;padding:6px'>"
                        + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.Level3.value).toFixed(2)
                        + "</td>"


                        + "</tr>"
                    document.getElementById("countryVotesExtended").getElementsByTagName("tfoot")[0].innerHTML = allEU;
                    document.getElementById("update").innerHTML = "<h2>EU: " + jsonObj.totalVotes.signatureCount + "</h2>" + countryData + "<h4>@ " + jsonObj.when + "</h4>";
                }
            }

            http_request.open("GET", data_file, true);
            http_request.send();

        }

        function prop(name = 'levelGoalPercentage', asc) {
            var a = asc == true ? "" : ", true";
            var b = asc == true ? ", true" : "";
            document.getElementById(name).setAttribute('onclick', "prop('" + name + "'" + a + "); return false;");
            document.getElementById("update").setAttribute('onclick', "loadJSONExt('" + name + "'" + b + ");");
            return loadJSONExt(name, asc);
        }
        window.onload = loadJSONExt();
        setInterval(loadJSONExt(), 3000);

