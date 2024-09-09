const firebaseURL = "https://web-dizajn-projekat1-sv52-2022-default-rtdb.europe-west1.firebasedatabase.app";




function openLogInForm() {
    document.getElementById("login-form").style.display = "block";
}

function openRegisterForm() {
    document.getElementById("register-form").style.display = "block";
}

function closeLogInForm() {
    document.getElementById("login-form").style.display = "none";
}

function closeRegisterForm() {
    document.getElementById("register-form").style.display = "none";
}

function goToLogInForm() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

function goToRegisterForm() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
}

function deleteConfirm() {
    document.getElementById("delete-confirm").style.display = "block";
}

function closeDeleteConfirm() {
    document.getElementById("delete-confirm").style.display = "none";
}

function deleteConfirmYes() {
    document.location.href = "index.html"
}

function deleteConfirmNo() {
    document.getElementById("delete-confirm").style.display = "none";
}

function register() {
    var data = JSON.stringify({
        "adresa": document.getElementById("register-user-address").value,
        "datumRodjenja": document.getElementById("register-birth-date").value,
        "email": document.getElementById("register-user-email").value,
        "ime": document.getElementById("register-first-name").value,
        "korisnickoIme": document.getElementById("register-username").value,
        "lozinka": document.getElementById("register-password").value,
        "prezime": document.getElementById("register-last-name").value,
        "telefon": document.getElementById("register-user-phone-number").value
    });
    
    var request = new XMLHttpRequest();
    request.open("POST", firebaseURL + "/korisnici.json");
    request.send(data);
    closeRegisterForm();
}

function changeUser() {
    var request = new XMLHttpRequest();
    var key = document.getElementById("user-id").innerHTML;
    console.log(key)

    var data = JSON.stringify({
        "adresa": document.getElementById("page-user-address").value,
        "datumRodjenja": document.getElementById("page-birth-date").value,
        "email": document.getElementById("page-user-email").value,
        "ime": document.getElementById("page-first-name").value,
        "korisnickoIme": document.getElementById("page-username").value,
        "lozinka": document.getElementById("page-password").value,
        "prezime": document.getElementById("page-last-name").value,
        "telefon": document.getElementById("page-user-phone-number").value
    });
    
    request.open("PUT", firebaseURL + "/korisnici/" + key + ".json");
    request.send(data);
}

function loadIndex() {
    var agencies = {};
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            
            for (var agency in data) {
                agencies[agency] = data[agency];
            }

            for (var id in agencies) {
                addAgencyCard(agencies[id]["logo"], agencies[id]["naziv"], id);
            }
        }
    }

    request.open("GET", firebaseURL + "/agencije.json");
    request.send();
}

function loadAgencyInfo() {
    var agencyKey = document.location.href.split('?')[1].split('=')[1]
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);

            loadAgencyInfoData(data["logo"], data["naziv"], data["adresa"], data["godina"], data["brojTelefona"], data["email"]);
            loadAgencyInfoDestinations(data["destinacije"]);
        }
    }

    request.open("GET", firebaseURL + "/agencije/" + agencyKey + ".json");
    request.send();
}

function loadAgencyChange() {
    var agencyKey = document.location.href.split('?')[1].split('&')[0].split('=')[1];
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            console.log(data)

            document.getElementById("destination-list").selectedIndex = 0;
            var x = document.getElementById("destination-list");
            for(i=0; i<x.options.length;i++) {
                var choice = x.options[i].value;

                if (choice == data["destinacije"]) {
                    break;
                } else {
                    document.getElementById("destination-list").selectedIndex += 1;
                }
            }

            document.getElementById("id").setAttribute("value", agencyKey);
            document.getElementById("agency-name").setAttribute("value", data["naziv"]);
            document.getElementById("agency-email").setAttribute("value", data["email"]);
            document.getElementById("agency-address").setAttribute("value", data["adresa"]); 
            document.getElementById("agency-year").setAttribute("value", data["godina"]);
            document.getElementById("agency-phone-number").setAttribute("value", data["brojTelefona"]);
            document.getElementById("agency-logo").setAttribute("value", data["logo"]);
        }
    }

    request.open("GET", firebaseURL + "/agencije/" + agencyKey + ".json");
    request.send();
}

function loadDestinationChange() {
    var destinationKey = document.location.href.split('?')[1].split('&')[0].split('=')[1];
    var data = null;
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data_ = JSON.parse(request.responseText);

            for (var i in data_) {
                for (var j in data_[i]) {
                    if (j == destinationKey) {
                        data = data_[i][j];
                        break
                    }
                }
                if (data != null) {
                    break
                }
            }

            var slike = "";
            for (var slika in data["slike"]) {
                slike += data["slike"][slika] + "\n";
            }

            document.getElementById("travel-type").selectedIndex = 0;
            var x = document.getElementById("travel-type");
            for(i=0; i<x.options.length;i++) {
                var choice = x.options[i].value;

                if (choice == data["tip"]) {
                    break;
                } else {
                    document.getElementById("travel-type").selectedIndex += 1;
                }
            }

            document.getElementById("transportation-type").selectedIndex = 0;
            var x = document.getElementById("transportation-type");
            for(i=0; i<x.options.length;i++) {
                var choice = x.options[i].value;

                if (choice == data["prevoz"]) {
                    break;
                } else {
                    document.getElementById("transportation-type").selectedIndex += 1;
                }
            }

            document.getElementById("id").setAttribute("value", destinationKey);
            document.getElementById("destination-name").setAttribute("value", data["naziv"]);
            document.getElementById("ticket-price").setAttribute("value", data["cena"]);
            document.getElementById("max-passengers").setAttribute("value", data["maxOsoba"]);
            document.getElementById("destination-images").innerHTML = slike;
            document.getElementById("destination-description").innerHTML = data["opis"];
        }
    }

    request.open("GET", firebaseURL + "/destinacije" + ".json");
    request.send();
}



function loadUserChange() {
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);

            var string = '<label for="page-username">Korisničko ime:</label><select id="page-username" name="page-username" onChange="userChangeUpdate()" required>';
            for (var id in data) {
                string += '<option value="' + data[id]["korisnickoIme"] + '">' + data[id]["korisnickoIme"] + '</option>';
            }
            document.getElementById("username-div").innerHTML += string + '</select>';
            var username = document.getElementById("page-username").options[0].value;
            
            for (var id in data) {
                if (data[id]["korisnickoIme"] == username) {
                    var user = data[id]
                    document.getElementById("user-id").innerHTML = id;
                }
            }

            document.getElementById("page-password").setAttribute("value", user["lozinka"]);
            document.getElementById("page-user-email").setAttribute("value", user["email"]);
            document.getElementById("page-first-name").setAttribute("value", user["ime"]);
            document.getElementById("page-last-name").setAttribute("value", user["prezime"]);
            document.getElementById("page-birth-date").setAttribute("value", user["datumRodjenja"]);
            document.getElementById("page-user-phone-number").setAttribute("value", user["telefon"]);
            document.getElementById("page-user-address").setAttribute("value", user["adresa"]);
        }
    }

    request.open("GET", firebaseURL + "/korisnici" + ".json");
    request.send();
}

function userChangeUpdate() {
    var counter = document.getElementById("page-username").selectedIndex;
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);

            var limit = 0;
            for (var id in data) {
                document.getElementById("user-id").innerHTML = id;
                var user = data[id]

                if (counter == limit) {
                    break;
                }
                limit += 1;
            }

            document.getElementById("page-password").setAttribute("value", user["lozinka"]);
            document.getElementById("page-user-email").setAttribute("value", user["email"]);
            document.getElementById("page-first-name").setAttribute("value", user["ime"]);
            document.getElementById("page-last-name").setAttribute("value", user["prezime"]);
            document.getElementById("page-birth-date").setAttribute("value", user["datumRodjenja"]);
            document.getElementById("page-user-phone-number").setAttribute("value", user["telefon"]);
            document.getElementById("page-user-address").setAttribute("value", user["adresa"]);
        }
    }

    request.open("GET", firebaseURL + "/korisnici" + ".json");
    request.send();
}

function userChangeReset() {
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            var key = document.getElementById("page-user-email").getAttribute("value")

            document.getElementById("page-username").selectedIndex = 0;
            for (var id in data) {
                if (data[id]["email"] == key) {
                    break;
                }
                document.getElementById("page-username").selectedIndex += 1;
            }
        }
    }

    request.open("GET", firebaseURL + "/korisnici" + ".json");
    request.send();
}

function loadDestinationInfo() {
    var destinationKey = document.location.href.split('?')[1].split('=')[1]
    var data = null;
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data_ = JSON.parse(request.responseText);

            for (var i in data_) {
                for (var j in data_[i]) {
                    if (j == destinationKey) {
                        data = data_[i][j];
                        break
                    }
                }
                if (data != null) {
                    break
                }
            }

            loadDestinationInfoData(data["naziv"], data["tip"], data["prevoz"], data["cena"], data["maxOsoba"], data["opis"]);

            var string = '<div class="destination-images">';

            for (var id in data["slike"]) {
                string += ('<div class="card"><img src="' + data["slike"][id] + '" alt="Destination image"></div>');
            }

            document.getElementById("content").innerHTML += string + '</div>';
        }
    }

    request.open("GET", firebaseURL + "/destinacije" + ".json");
    request.send();
}

function loadAgencyInfoData(logo, naziv, adresa, godina, brojTelefona, email) {
    var string = '<div class="agency-logo"><img src="" alt="Agency logo"></div><div class="agency-data"><div class="agency-name"></div><div class="agency-text"><ul><li></li><li></li><li></li><li></li></ul></div></div>';

    string = string.slice(0, 177) + email + string.slice(177);
    string = string.slice(0, 168) + brojTelefona + string.slice(168);
    string = string.slice(0, 159) + godina + string.slice(159);
    string = string.slice(0, 150) + adresa + string.slice(150);
    string = string.slice(0, 111) + naziv + string.slice(111);
    string = string.slice(0, 35) + logo + string.slice(35);

    document.getElementById("middle").innerHTML = string;
}

function loadAgencyInfoDestinations(destinasionsKey) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            console.log(data)

            for (var id in data) {
                addDestinationCard(data[id]["slike"][0], data[id]["naziv"], data[id]["opis"], data[id]["cena"], id);
            }
        }
    }

    request.open("GET", firebaseURL + "/destinacije/" + destinasionsKey + ".json");
    request.send();
}

function loadDestinationInfoData(naziv, tip, vrsta, cijena, broj, opis) {
    var string = '<div class="destination-name"></div><div class="destination-data"><div class="destination-info-names"><ul><li>Tip putovanja:</li><li>Vrsta prevoza:</li><li>Cijena karte:</li><li>Max. broj osoba:</li></ul></div><div class="destination-info"><ul><li></li><li></li><li> din.</li><li></li></ul></div><div class="destination-description"></div></div>';
    
    string = string.slice(0, 333) + opis + string.slice(333);
    string = string.slice(0, 280) + broj + string.slice(280);
    string = string.slice(0, 266) + cijena + string.slice(266);
    string = string.slice(0, 257) + vrsta + string.slice(257);
    string = string.slice(0, 248) + tip + string.slice(248);
    string = string.slice(0, 30) + naziv + string.slice(30);

    document.getElementById("content").innerHTML = string;
}

function addAgencyCard(logo, name, id) {
    var card = '<button class="card" onclick="goToAgencyInfo()"><div class="agency-image-div"><div class="pole"></div><div class="agency-image"><img src="" alt="Agency logo"></div></div><div class="agency-data"><div class="agency-data-name"></div><div class="agency-data-rating"></div></div></button>';

    card = card.slice(0, 263) + (Math.random() * 5).toFixed(1) + card.slice(263);
    card = card.slice(0, 225) + name + card.slice(225);
    card = card.slice(0, 138) + logo + card.slice(138);
    card = card.slice(0, 45) + "'" + id + "'" + card.slice(45);

    document.getElementById("content").innerHTML += card;
}

function addDestinationCard(image, name, description, price, id) {
    var card = '<button class="card" onclick="goToDestinationInfo()"><div class="destination-image-div"><div class="pole"></div><div class="destination-image"><img src="" alt="Destination image"></div></div><div class="destination-data"><div class="destination-name"></div><div class="destination-description"></div><div class="destination-price"> din.</div></div></button>'

    card = card.slice(0, 331) + price + card.slice(331);
    card = card.slice(0, 294) + description + card.slice(294);
    card = card.slice(0, 251) + name + card.slice(251);
    card = card.slice(0, 153) + image + card.slice(153);
    card = card.slice(0, 50) + "'" + id + "'" + card.slice(50);

    document.getElementById("content").innerHTML += card;
}

function goToAgencyInfo(id) {
    document.location.href = "agency_info.html?id=" + id;
}

function goToAgencyChange() {
    document.location.href = "agency_change.html?id=" + document.location.href.split('?')[1].split('=')[1];
}

function goToDestinationChange() {
    document.location.href = "destination_change.html?id=" + document.location.href.split('?')[1].split('=')[1];
}

function goToDestinationInfo(id) {
    document.location.href = "destination_info.html?id=" + id;
}