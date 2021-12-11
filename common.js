            let opts = "<option value=''>Show country</option>";
            const staticCountryNames = {
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

			for (let cc in staticCountryNames) {
                opts += "<option value='" + cc + "'>" + staticCountryNames[cc] + "</option>";

            }
            document.getElementById("countryList").innerHTML = opts;
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let myObj = JSON.parse(this.responseText);
                    let i;
                    let list = "<option value='en'>Choose language</option>";
                    for (i = 0; i < myObj.languages.length; i++) {
                        list += "<option value='" + myObj.languages[i].languageCode + "'> " + myObj.languages[i].languageName + "</option>"

                    }
                    document.getElementById("langlist").innerHTML = list;
                }
            };
            xmlhttp.open("GET", "languages.json", true);
            xmlhttp.send();

            function loadJSONExt(prop = 'targetPopPercentage', asc) {
                let sortDir = asc ? "&asc=" + asc : "";
                let sortField = "?sort=" + prop + sortDir;
                let lang = document.getElementById("langlist").value;
                if (lang != "") {
                    lang = "&language=" + lang;
                }
                let data_file = "ecitable.php" + sortField + lang;
                let http_request = new XMLHttpRequest();
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
                    let row = "";
                    let countryData = "";

                    if (http_request.readyState == 4) {
                        // Javascript function JSON.parse to parse JSON data
                        let jsonObj = JSON.parse(http_request.responseText);

                        // jsonObj variable now contains the data structure and can
                        // be accessed as jsonObj.name and jsonObj.country.

// start joomla smalltable
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
// end Joomla smalltable 
// start bigtable
                        let countriesJson = jsonObj.countryVotes.signatureCountryCount;
                        let targets = jsonObj.targets;
                        /*document.getElementById("timeDetailed").innerHTML = "<h4>@ " + jsonObj.when + "</h4>";*/
                        /* countriesJson.sort((a, b) => (a.count / a.treshold < b.count / b.treshold) ? 1 : (a.count / a.treshold === b.count / b.treshold) ? ((a.treshold > b.treshold) ? 1 : -1) : -1 ); */
                        let countryNames = jsonObj.countryNames;


                        document.getElementById("sign").innerHTML = "<a style='color:white;width:230px;' href='" + jsonObj.signUrl + "'>Sign ECI for UBI</a>";

                        let tableRow = [];
                        for (let i = 0; i < countriesJson.length; i++) {
                            let cc = countriesJson[i].countryCode;
                            tableRow[i] = {};
                            tableRow[i].countryFlag = "<img src='https://www.flagcdn.com/32x24/" + cc + ".png''>";
                            tableRow[i].countryName = countryNames[cc];
                            tableRow[i].signatureCount = countriesJson[i].totalCount;
                            tableRow[i].today = targets[cc].today;
                            tableRow[i].yesterday = targets[cc].yesterday;
                            tableRow[i].targetPop = targets[cc].TargetPop;
                            tableRow[i].targetPopPercentage = parseFloat(100 * countriesJson[i].totalCount / targets[cc].TargetPop).toFixed(2);
                            tableRow[i].threshold = countriesJson[i].treshold;
                            tableRow[i].thresholdTotalNeed = totalNeed(countriesJson[i].treshold, countriesJson[i].totalCount);
                            tableRow[i].thresholdNeed = needPerDay(countriesJson[i].treshold, countriesJson[i].totalCount);
                            tableRow[i].thresholdPercentage = parseFloat(countriesJson[i].percentage).toFixed(2);
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
                            tableRow[i].targetMEP = targets[cc].TargetMEP;
                            tableRow[i].targetMEPPercentage = parseFloat(100 * countriesJson[i].totalCount / targets[cc].TargetMEP).toFixed(2);

                            if (document.getElementById("countryList").value != "" && cc == document.getElementById("countryList").value) {
                                countryData += "<h1>" + countryNames[cc] + ": " + tableRow[i].signatureCount + "</h1>";
                            }
                        }
// end bigtable
                        function needPerDay(target, signatures) {
                            let startDate = new Date("2020-09-25");
                            let endDate = new Date("2022-06-25");
                            let today = new Date();
                            let firstDate = today;
                            let days = [];
                            while (today <= endDate) {
                                // this line modifies the original firstDate reference which you want to make the while loop work
                                firstDate.setDate(firstDate.getDate() + 1);
                                // this pushes a new date , if you were to push firstDate then you will keep updating every item in the array
                                days.push(new Date(firstDate));
                            }
                            let remained = days.length;
                            let need = (target - signatures) / remained;
                            return Math.round(need);
                        }

                        function totalNeed(target, signatures) {
                            return target - signatures;
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

                        let rowCols = [];
                        let align = "";
                        let orderNum = asc == true ? tableRow.length : 1;
                        let sortLabel = prop.includes("Pop") ? "POP" : (
                            prop.includes("threshold") ? "THR" : (
                                prop.includes("Goal") ? "Opt. goal" : (
                                    prop.includes("1") ? "Level 1" : (
                                        prop.includes("2") ? "Level 2" : (
                                            prop.includes("3") ? "Level 3" : (
                                                prop.includes("MEP") ? "MEP-goal" : prop
                                            ))))
                            ));
                        sortLabel += prop.includes("Percent") ? " %" : "";

                        for (let i = 0; i < tableRow.length; i++) {
                            rowCols[i] = "";
                            for ([key, value] of Object.entries(tableRow[i])) {
                                align = key == "countryFlag" || key == "countryName" ? "center" : "right";
                                if (key.includes("Percentage") && value >= 100) {
                                    value = "<div style='background-color:green;color:yellow;font-weight: bold;padding:3px;'>" + value + "</div>";
                                }
                                rowCols[i] += "<td style='text-align:" + align + ";border: 1px solid black;padding:0 6px'>" + value + "</td>";
                            };

                            /*
                                Weird issue. orderNum should be displayed correctly under the countryData variable as it does under the row variable. But the orderNum appears under countryData like the data was permanently ordered by some other, unknown data :o Only prop shows correct data. 
                            */
                            let cc = countriesJson[i].countryCode;
                            let selectedCnt = false;
                            if (cc == document.getElementById("countryList").value) {
                                countryData += "<h1 style='color:green;'># " + (orderNum) + " (" + sortLabel + ")</h1>";
                                selectedCnt = true;
                            }

                            row += "<tr id='" + cc + "'><td style='text-align:right;border: 1px solid black;padding:0 6px'>" + (orderNum)
                                //+(selectedCnt == true ? (" " + orderNum + " " + prop) : "") 
                                + "</td>" + rowCols[i] + "</tr>";


                            if (asc == true) {
                                orderNum--;
                            } else {
                                orderNum++;
                            }

                        }

                        console.log(rowCols);
                        document.getElementById("countryVotesExtended").getElementsByTagName("tbody")[0].innerHTML = row;
                        let allEU = "<tr><td style='border: 1px solid black;text-align:center;padding:0 6px'></td>"
                            + "<td style='border: 1px solid black;text-align:center;min-width:34px;'><img src='https://www.flagcdn.com/32x24/eu.png''>"
                            + "</td>"
                            + "<td style='border: 1px solid black;text-align:center;padding:0 6px'>EU27"
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + jsonObj.totalVotes.signatureCount
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + targets.all.today
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + targets.all.yesterday
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px' colspan='2'><h4>Total <br>is the goal: "
                            + jsonObj.totalVotes.goal
                            + "<br>, signed: "
                            + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.TargetMEP).toFixed(2)
                            + " %</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + targets.all.threshold
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + totalNeed(targets.all.threshold, jsonObj.totalVotes.signatureCount)
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + needPerDay(targets.all.threshold, jsonObj.totalVotes.signatureCount)
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.threshold).toFixed(2)
                            + "</td>"
                            + "<td style='text-align:center;border: 1px solid black;padding:0 6px' colspan='2'>"
                            + targets.all.Level1.value
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.Level1.value).toFixed(2)
                            + "</td>"

                            + "<td style='text-align:center;border: 1px solid black;padding:0 6px' colspan='2'>"
                            + targets.all.Level2.value
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.Level2.value).toFixed(2)
                            + "</td>"

                            + "<td style='text-align:center;border: 1px solid black;padding:0 6px'>"
                            + targets.all.LevelGoal.value
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + needPerDay(targets.all.LevelGoal.value, jsonObj.totalVotes.signatureCount)
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.LevelGoal.value).toFixed(2)
                            + "</td>"
                            + "<td style='text-align:center;border: 1px solid black;padding:0 6px' colspan='2'>"
                            + targets.all.Level3.value
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px'>"
                            + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.Level3.value).toFixed(2)
                            + "</td>"
                            + "<td style='text-align:right;border: 1px solid black;padding:0 6px' colspan='2'><h4>Total is the goal: "
                            + jsonObj.totalVotes.goal
                            + "<br>, signed: "
                            + parseFloat(100 * jsonObj.totalVotes.signatureCount / targets.all.TargetMEP).toFixed(2)
                            + " %</td>"

                            + "</tr>"
                        document.getElementById("countryVotesExtended").getElementsByTagName("tfoot")[0].innerHTML = allEU;
                        document.getElementById("update").innerHTML = "<h2>EU27: " + jsonObj.totalVotes.signatureCount + "</h2>" + countryData + "<h3>@ " + jsonObj.when + "</h3>";

                    }
                }

                http_request.open("GET", data_file, true);
                http_request.send();

            }

            function prop(name = 'targetPopPercentage', asc) {
                let a = asc == true ? "" : ", true";
                let b = asc == true ? ", true" : "";
                document.getElementById(name).setAttribute('onclick', "prop('" + name + "'" + a + "); return false;");
                document.getElementById("update").setAttribute('onclick', "loadJSONExt('" + name + "'" + b + ");");
                let oldActive = document.getElementsByClassName("active")[0];
                if (oldActive && oldActive.getElementsByTagName("a")[0].id != name) oldActive.classList.remove("active");
                document.getElementById(name).parentElement.classList.add("active");
                return loadJSONExt(name, asc);
            }
            window.onload = loadJSONExt();
            setInterval(loadJSONExt(), 3000);
