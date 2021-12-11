        var opts = "<option value=''>Show country</option>";
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

        for (var cc in staticCountryNames) {
            opts += "<option value='" + cc + "'>" + staticCountryNames[cc] + "</option>";

        }
        document.getElementById("countryList").innerHTML = opts;
        var selectedCountry = "";

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var myObj = JSON.parse(this.responseText);
                var i;
                var list = "<option value='en'>Choose other language</option>";
                for (i = 0; i < myObj.languages.length; i++) {
                    list += "<option value='" + myObj.languages[i].languageCode + "'> " + myObj.languages[i].languageName + "</option>"

                }
                document.getElementById("langlist").innerHTML = list;
            }
        };
        xmlhttp.open("GET", "https://kodanikupalk.ee/varia/eci/languages.json", true);
        xmlhttp.send();

        function loadJSON() {
            var lang = document.getElementById("langlist").value;
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

                if (http_request.readyState == 4) {
                    // Javascript function JSON.parse to parse JSON data
                    var jsonObj = JSON.parse(http_request.responseText);

                    // jsonObj variable now contains the data structure and can
                    // be accessed as jsonObj.name and jsonObj.country.
                    document.getElementById("time").innerHTML = "<h4>@ " + jsonObj.when + "</h4>";
                    document.getElementById("signatureCountHeader").innerHTML = "<h1>Signatures: " + jsonObj.totalVotes.signatureCount + "</h1>";
                    document.getElementById("goal").innerHTML = "<h1>required: " + jsonObj.totalVotes.goal + "</h1>";
                    document.getElementById("statement").innerHTML = "<h3><a href='" + jsonObj.signUrl + "en' target='_blank'>Join with them! sign.eci-ubi.eu</a></h3>";
                    var countriesJson = jsonObj.countryVotes.signatureCountryCount;
                    countriesJson.sort((a, b) => (a.totalCount / a.treshold < b.totalCount / b.treshold) ? 1 : (a.totalCount / a.treshold === b.totalCount / b.treshold) ? ((a.treshold > b.treshold) ? 1 : -1) : -1);
                    var countryNames = jsonObj.countryNames;
                    var row = "";
                    for (var i = 0; i < countriesJson.length; i++) {
                        var cc = countriesJson[i].countryCode;
                        row += "<tr><td style='border: 0.5px solid black;text-align:center;'><img src='https://www.flagcdn.com/32x24/" + cc + ".png'></td><td style='text-align:right;border: 0.5px solid black;padding:4px'>" + (i+1) + "</td><td style='text-align:center;border: 0.5px solid black;padding:4px'>" + countryNames[cc] + "</td>"
                            + "<td style='width:15%;text-align:right;border: 0.5px solid black;padding:4px'>" + countriesJson[i].totalCount + "</td>"
                            + "<td style='width:10%;text-align:right;border: 0.5px solid black;padding:4px'>" + countriesJson[i].treshold + "</td>"
                            + "<td style='text-align:right;border: 0.5px solid black;padding:4px'>" + parseFloat(countriesJson[i].percentage).toFixed(2) + "</td></tr>";

                        if (document.getElementById("countryList").value == "") {
                            selectedCountry = "ee";
                        } else {
                            selectedCountry = document.getElementById("countryList").value;
                        }
                        if (cc == selectedCountry) {
                            var ee = "<h1>" + countryNames[cc] + ": <span style='white-space:nowrap'>" + countriesJson[i].totalCount + " / " + countriesJson[i].treshold + "</span></h1>";
                            document.getElementById("selectedCountryCount").innerHTML = ee;
                        }
                    }
                    document.getElementById("countryVotes").getElementsByTagName("tbody")[0].innerHTML = row;

                }
            }

            http_request.open("GET", data_file, true);
            http_request.send();


        }

        window.onload = loadJSON();
        setInterval(loadJSON(), 3000);
