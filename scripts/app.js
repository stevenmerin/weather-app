// for DOM manipulations and event handling
const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');
const contentForecast = document.querySelector('.contentForecast');
const errorMsg = document.querySelector('#errorMsg');
// Create a new instance of the Forecast class
const forecastObj = new Forecast();

const updateUI = data => {
  // destructure properties
  const { cityDetails, weather, forecast } = data;

  // update details template
  details.innerHTML = `
    <div class="my-2">Today</div>
    <h5 class="my-3">${cityDetails.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weather.Temperature.Metric.Value}&deg;C</span>
    </div>
  `;

  // update the night/day & icon images
  const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
  icon.setAttribute('src', iconSrc);

  // ternary operator
  let timeSrc = weather.IsDayTime ? 'img/day.svg' : 'img/night.svg';

  time.setAttribute('src', timeSrc);

  // remove the d-none class if present
  if (card.classList.contains('d-none')) {
    card.classList.remove('d-none');
  }

  // ------ Weather forecast
  for (i = 1; i <= 4; i++) {
    // dates
    let forecastDate = new Date(forecast.DailyForecasts[i].Date);
    // weather
    let forecastWeather = forecast.DailyForecasts[i].Day.IconPhrase;
    // temp
    let forecastTemp = forecast.DailyForecasts[i].Temperature.Maximum.Value;
    // icons
    let forecastIcon = `img/icons/${forecast.DailyForecasts[i].Day.Icon}.svg`;

    contentForecast.innerHTML += `
    <div class="row">
      <div class="col">
        <h4 class="text-left my-3">${dateFns.format(forecastDate, "MMM D | ddd")}</h4>
      </div>
      <div class="col">
        <h4 class="text-center my-3">${forecastWeather}</h4>
      </div>
      <div class="col">
          <h4 class="text-center my-3">${forecastTemp}&deg;C</h4>
      </div>
      <div class="col-lg-3 col-sm-12" id="iconSection">
        <div class="iconForecast bg-transparent mx-auto text-center">
          <img src="${forecastIcon}"/ alt="weather icon">
        </div>
      </div>
    </div>
    `;
  }
  contentForecast.innerHTML += `
    <div class="row">
      <div class="col">
        <h4 class="text-center my-3">${forecast.Headline.Text}</h4>
      </div>
    </div>
  `;
};

cityForm.addEventListener('submit', e => {
  // prevent default action (it does not refreshes the page)
  e.preventDefault();
  // gets city value
  const city = cityForm.city.value.trim();
  // resets the form fields after submitting
  cityForm.reset();
  contentForecast.innerHTML = ``;
  errorMsg.innerText = "";
  card.classList.add('d-none');

  // update the UI with the new city
  forecastObj.updateCity(city)
    .then(data => {
      updateUI(data);
    })
    .catch(err => {
      // console.log(err.message);
      if(err.message == "Failed to fetch") {
        errorMsg.innerText = 'The allowed number of requests has been exceeded, we will resolve the issue as soon as possible. Sorry for the inconvenience';
      } else {
        errorMsg.innerText = 'Invalid Location!';
      }
    });
    // set local storage
    localStorage.setItem('city', city);
});

// local storage
if(localStorage.getItem('city')) {
  forecastObj.updateCity(localStorage.getItem('city'))
    .then(data => updateUI(data))
    .catch(err => console.log(err));
}

