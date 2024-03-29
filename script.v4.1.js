const companyAvatar = document.getElementById("company-logo");
const companyName = document.getElementById("company-name");
const parent = document.getElementById("parent");
const container = document.getElementsByClassName("container")[0];
const footer = document.getElementsByTagName("footer")[0];
const lang = document.getElementById("lang");
const lang2 = document.getElementById("lang2");
const lang1 = document.getElementById("language");
const errorTextH2 = document.createElement("h2");
const errorTextP = document.createElement("p");
const errorTextStyle = "color: #091e42; width: 280px; text-align: center; ";

errorTextH2.innerHTML = "Уупс!";
errorTextP.innerHTML = "QR code не найден. Обратитесь к администратору.";
errorTextH2.style.cssText =
  errorTextStyle + "font-size: 24px; margin: 10px auto;";
errorTextP.style.cssText =
  errorTextStyle + "font-size: 16px; margin: 0 auto 10px;";

window.onload = function () {
  var url = document.location.href;
  var x = url.split("/");
  let sd = "";

  if (x.length <= 4) {
    sd = x[x.length - 1];
  } else {
    sd = x[x.length - 2];
  }
  const instance1 = axios.default;
  const instance = instance1.create({
    //   const instance = axios.create({
    method: "get",
    baseURL: `https://2mv.io/load-widgets?id=${sd}` /* ${sd} 8d880a4b 8cef47f2 */
  });
  instance().then(
    function (response) {
      var response = response.data;
      if (response.surveyName == "") {
      } else {
        companyName.innerHTML = response.surveyName;
      }
      if (response.surveyAvatar != "") {
        companyAvatar.setAttribute("src", response.surveyAvatar);
      } else {
        if (companyAvatar.getAttribute("src") == "../images/logo2.svg") {
          companyAvatar.classList.add("xdef");
        }
      }

      /*** Language ***/
      /** localeDefault */
      let str = response.settings.localeData;
      let localeDefault = response.settings.localeDefault;
      let words = str.split(";");
      for(let i = 0; i < words.length; i++) {
        words[i].toUpperCase();
      }

      let el = "";
      words.map((lang) => {
        if (lang === localeDefault) {
          el += `
            <li data-lang="${lang}" class="track">
              <a>
                <span>${lang}</span>
              </a>
            </li>
          `;
        } else {
          el += `
            <li data-lang="${lang}" class="track">
              <a>
                <span>${lang}</span>
              </a>
            </li>
          `;
        }
      });
      let selectElem2 = (url) => {
        return (
          `
          <div class="popover-container">
            <button class="popover-button f16">
              <i class="flag ${url == 'en' ? 'us' : localeDefault }"></i>
              <svg>
                <use xlink:href="#select-arrow-down"></use>
              </svg>
            </button>
            <ul class="popover-content" style="text-transform: uppercase;">
              <li data-lang="ru" class="track">
                <a>
                  <span>RU</span>
                </a>
              </li>
              ` +
          el +
          `
            </ul>
          </div>
          <!-- SVG Sprites-->
          <svg class="sprites">
            <symbol id="select-arrow-down" viewbox="0 0 10 6">
              <polyline points="1 1 5 5 9 1"></polyline>
            </symbol>
          </svg>
        `
        )
      }

      if (response.settings.locale && str) {
        lang2.innerHTML = selectElem2(localeDefault);
        var btn = document.querySelector(".popover-button");
        btn.onclick = function () {
          list.classList.toggle("show-menu");
          for (let i = 0; i < item.length; i++) {
            item[i].onclick = function () {
              lod(this.innerText);
              if (this.innerText == "RU") {
                flag.removeAttribute("class");
                flag.classList.add("flag", "ru");
                companyName.innerHTML = response.surveyName;
              } else if (this.innerText == "KZ") {
                flag.removeAttribute("class");
                flag.classList.add("flag", "kz");
                companyName.innerHTML = response.surveyName2;
              } else if (this.innerText == "EN") {
                flag.removeAttribute("class");
                flag.classList.add("flag", "us");
                companyName.innerHTML = response.surveyName3;
              }
              currentLang = this.innerText;
              list.classList.toggle("show-menu");
            };
          }
        };
      } else {
      }

      /*** New Lang Elems ***/
      var list = document.querySelector(".popover-content");
      var item = document.querySelectorAll(".track");
      var flag = document.querySelector(".flag");
      var currentLang = localeDefault;

      lod(localeDefault);
      function lod(value) {
        companyName.innerHTML = value == 'ru' ? response.surveyName : value == 'kz' ? response.surveyName2 : response.surveyName3
        parent.innerHTML = "";
        for (var i = 0; i < response.widgets.length; i++) {
          parent.innerHTML += widget(i, value.toUpperCase());
        }
      }

      /*** Widgets ***/

      function widget(id, value) {

        if (response.widgets[id].type == "one" && sd != '227d56c5'
            || response.widgets[id].type == "one" && sd != '22ddd1a6'
            || response.widgets[id].type == "one" && sd != 'be7815f6') {
          response.widgets[id].picture = "../images/giftbox.svg"
        }

        /*** Скрыть второй блок */
        if (response.widgets[id].type == "two") {
          return '';
        }

        if (x.length <= 4) {
          var id2 = x[x.length - 1] + "/0001";
        } else {
          var id2 = x[x.length - 2] + "/" + x[x.length - 1];
        }
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
          } else {
            link = "";
            getHttp = "";
          }

          if (response.widgets[id].type == "one") {
            return (
              "https://mvoter.com/interview/" + id2 + `?locale=${value.toLowerCase()}`
            );
          } else if (response.widgets[id].type == "two") {
            return id1 + `/${value.toLowerCase()}`;
          } else if (response.widgets[id].type == "eight") {
            let lin = response.widgets[id].link.split('/');
            if (lin.includes('my.dzmenu.com'))
              return response.widgets[id].link + '/' + x[x.length - 1]
            else
              return response.widgets[id].link
          } else {
            let getNum = link
              .split("//")
              .pop()
              .replace(/[^a-z^0-9]/gi, "");
            let toNumber = Number(getNum);
            if (getHttp == "http") {
              return link;
            } else if (!isNaN(toNumber)) {
              link = `tel:${toNumber}`;
              return link;
            } else {
              if (link == "") {
                return link;
              } else {
                return "http://" + link;
              }
            }
          }
        }

        function title() {
          return (
            // value == "RU" ? response.widgets[id].title
            // : value == "KZ"
            // ? response.widgets[id].title2
            // : response.widgets[id].title3

            response.widgets[id].type == "one" && value == "RU"
              ? "Оставьте отзыв"
              : response.widgets[id].type == "one" && value == "KZ"
              ? "Қысқа пікір қалдырыңыз"
              : response.widgets[id].type == "one" && value == "EN"
              ? "Leave a short review":
              value == "RU"
                ? response.widgets[id].title
                : value == "KZ"
                ? response.widgets[id].title2
                : response.widgets[id].title3
          )
        }

        function subTitle() {
          return (
            response.widgets[id].type == "one" && value == "RU"
              ? "и участвуйте в розыгрыше призов"
              : response.widgets[id].type == "one" && value == "KZ"
              ? "және жүлделер ұтысына қатысыңыз"
              : response.widgets[id].type == "one" && value == "EN"
              ? "and participate in the prize lottery":
              ''
          )
        }

        function hint() {
          if (value == "RU") {
            if (id == 0) {
              let h = `
                <p>не более 1 минуты на ответ</p>
                `
                /*<p>или с установкой
                  <a class="a-text" href="${id1 + `/${currentLang}`}">приложения</a>
                </p>*/
              return (response.widgets[id].hint = h);
            } else if (id == 1) {
              return (response.widgets[1].hint = "<p>не более 1 минуты на ответ</p>");
            } else {
              return "";
            }
          } else if (value == "KZ") {
            if (id == 0) {
              return (response.widgets[id].hint = "<p>жауап беру 1 минуттан аспайды</p>");
            } else if (id == 1) {
              return (response.widgets[1].hint = "<p>жауап беру 1 минуттан аспайды</p>");
            } else {
              return "";
            }
          } else {
            if (id == 0) {
              return (response.widgets[id].hint ="<p>no more than 1 minute to respond</p>");
            } else if (id == 1) {
              return (response.widgets[1].hint = "<p>no more than 1 minute to respond</p>");
            } else {
              return "";
            }
          }
        }

        function salePic() {
          return (
            response.widgets[id].type == "one" && value == "RU"
            ? `
              <a href="https://2mv.io/promotion-ru.html" class="sale">
                <img src="https://2mv.io/images/sale1.png" style="width: 100px; height: 52px;" />
              </a>`
            : response.widgets[id].type == "one" && value == "KZ"
            ? `
              <a href="https://2mv.io/promotion-kz.html" class="sale" style="top: -16px">
                <img src="https://2mv.io/images/sale3.png" style="width: 111px; height: 62px;" />
              </a>`
            : response.widgets[id].type == "one" && value == "EN"
            ? `
              <a href="javascript:void(0)" class="sale" style="right: 10px; top: -16px;">
                <img src="https://2mv.io/images/sale2.png" style="width: 105px; height: 52px;" />
              </a>`
            : ''
          )
        }

        if(sd === "227d56c5"
           || sd === "22ddd1a6"
          || sd === "be7815f6") { // Исключение
          return (`
            <div class="card">
              <h3>${value == "RU"
              ? response.widgets[id].title
              : value == "KZ"
              ? response.widgets[id].title2
              : response.widgets[id].title3}</h3>
              <img src="${response.widgets[id].picture}" alt="" draggable="false">
              <a href="${path()}">${value == "RU" ? "Выбрать" : value == "KZ" ? "Таңдау" : "Choose"}</a>
              <!-- ${ response.widgets[id].type == "one" ? hint() : ""}-->
            </div>`
          )
        }
        return `
        <div class="card">
          <h3 class="${response.widgets[id].type == "one" && value == "RU" ? 'big' : ''}">${title()}</h3>
          <!--<h3 class="small" style="display: none">${subTitle()}</h3>-->
          <img src="${response.widgets[id].picture}" alt="" draggable="false">
          <a href="${path()}">${value == "RU" ? "Выбрать" : value == "KZ" ? "Таңдау" : "Choose"}</a>
          <!-- ${ response.widgets[id].type == "one" ? hint() : ""}
          ${salePic()} -->
        </div>`;
      }
    },
    function (err) {
      container.innerHTML = "";
      container.append(errorTextH2);
      container.append(errorTextP);
      footer.remove();
    }
  );
};
