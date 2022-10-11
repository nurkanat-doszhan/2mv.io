const companyAvatar = document.getElementById("company-logo");
const companyName = document.getElementById("company-name");
const parent = document.getElementById("parent");
const container = document.getElementsByClassName('container')[0];
const footer = document.getElementsByTagName('footer')[0];
const lang = document.getElementById("lang");
const lang1 = document.getElementById("language");
const errorTextH2 = document.createElement("h2");
const errorTextP = document.createElement("p");
const errorTextStyle = "color: #091e42; width: 280px; text-align: center; ";
errorTextH2.innerHTML = "Уупс!";
errorTextP.innerHTML = "QR code не найден. Обратитесь к администратору.";
errorTextH2.style.cssText = errorTextStyle + "font-size: 24px; margin: 10px auto;";
errorTextP.style.cssText = errorTextStyle + "font-size: 16px; margin: 0 auto 10px;";

window.onload = function () {
    var url = document.location.href;
    var x = url.split('/');
    let sd = '';
    if (x.length <= 4) sd = x[x.length - 1];
    else
        sd = x[x.length - 2];
    // const instance1 = axios.default;
    // const instance = instance1.create({
        const instance = axios.create({
        method: 'get',
        baseURL: `https://2mv.io/load-widgets?id=${sd}`
    });
    instance().then(function (response) {
        var response = response.data;
        if (response.surveyName == "") {

        } else {
            companyName.innerHTML = response.surveyName;
        }
        if (response.surveyAvatar != "") {
            companyAvatar.setAttribute('src', response.surveyAvatar);
        } else {
            if (companyAvatar.getAttribute('src') == '../images/logo2.svg') {
                companyAvatar.classList.add("xdef");
            }
        }

        

        /*** Language ***/

        let str = response.settings.localeData;
        let words = str.split(';');
        let selectElem = `
            <label class="select" for="language">
                <select id="language" required="required" style="text-transform: uppercase;">
                    <option value="0" selected="selected">RU</option>
                    ${words.map((lang, i) => {
                        return (
                            `<option value="${i + 1}">${lang}</option>`
                        )
                    })}
                </select>
                <svg>
                    <use xlink:href="#select-arrow-down"></use>
                </svg>
            </label>
            <!-- SVG Sprites-->
            <svg class="sprites">
                <symbol id="select-arrow-down" viewbox="0 0 10 6">
                    <polyline points="1 1 5 5 9 1"></polyline>
                </symbol>
            </svg>
        `;

        if (response.settings.locale) {
            lang.innerHTML = selectElem
        }
        else {
            
        }
        
        let select = document.getElementById('language')
        var currentLang = 'ru';

        lod('0');
        function lod(value) {
            parent.innerHTML = '';
            for (var i = 0; i < response.widgets.length; i++) {
                parent.innerHTML += widget(i,value);
            }
        }
        select.onchange = function () {
            select.options[select.selectedIndex].value == 0 ? companyName.innerHTML = response.surveyName : 
            select.options[select.selectedIndex].value == 1 ? companyName.innerHTML = response.surveyName2 :
            companyName.innerHTML = response.surveyName3;
            //  window.location = '?locale=' + select.options[select.selectedIndex].value;
            currentLang = select.options[select.selectedIndex].text
            lod(select.options[select.selectedIndex].value);
        }

        /*** Widgets ***/

        function widget(id,value) {
            if (x.length <= 4)
                var id2 = x[x.length - 1] + "/0001";
            else
                var id2 = x[x.length - 2] + '/' + x[x.length - 1];
            var id1;
            const android = /Android/i.test(navigator.userAgent);
            const iphone = /iP(ad|od|hone)/i.test(navigator.userAgent);

            if (android) {
                id1 = `android-app://apps.mvoter.com/http/2mv.io/${id2}/web`;
            } else if (iphone) {
                id1 = `https://apps.apple.com/kz/app/mvoter/id1629861262`;
            }

            function path() {
                var getHttp, link, number;
                if (response.widgets[id].link) {
                    link = response.widgets[id].link;
                    getHttp = link.substr(0, 4);
                }
                else {
                    link = '';
                    getHttp = '';
                }

                if (response.widgets[id].type == "one") {
                    return 'https://mvoter.com/interview/' + id2 +`?locale=${currentLang}`
                } else if (response.widgets[id].type == "two") {
                    return id1+`/${currentLang}`;
                }
                else {
                    let getNum = link.split('//').pop().replace(/[^a-z^0-9]/ig, '');
                    let toNumber = Number(getNum);
                    if (getHttp == "http") {
                        return link;
                    } else if (!isNaN(toNumber)) {
                        link = `tel:${toNumber}`;
                        return link;
                    } else {
                        if (link == '')
                            return link;
                        else
                            return 'http://' + link;
                    }
                }
            }

            function hint() {
                if (response.widgets[id].hint) return response.widgets[id].hint;
                else return "";
            }

            return `
            <div class="card">
                <h3>${value == '0' ? response.widgets[id].title : value == '1' ? response.widgets[id].title2 : response.widgets[id].title3}</h3>
                <img src="${response.widgets[id].picture}" alt="" draggable="false">
                <a href="${path()}">Выбрать</a>
                <p>${hint()}</p>
            </div>`;
        }
    }, function (err) {
        container.innerHTML = "";
        container.append(errorTextH2);
        container.append(errorTextP);
        footer.remove();
    });
};
