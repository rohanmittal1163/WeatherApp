const city = document.querySelector('input[type="text"]'),
	searchBox = document.querySelector('.search_box'),
	details = document.querySelector('.container'),
	status = document.querySelector('.status'),
	previous = document.querySelector('.back'),
	API_KEY = `6ef0f708f4aafe71cb470585f1ca114b`,
	btn = document.querySelector('.btn'),
	img = document.querySelector('.body img');

previous.onclick = getSearchBox;
city.onkeypress = (e) => {
	if (e.keyCode == 13) {
		fetchingDetails(
			`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${API_KEY}`
		);
	}
};
btn.onclick = getLocation;

function getSearchBox() {
	details.style.display = 'none';
	searchBox.style.display = 'flex';
	status.style.display = 'none';
	city.value = '';
}

function fetchingDetails(api) {
	fetch(api)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.cod == 404 || data.cod == 400) {
				status.style.display = 'block';
				status.style.color = 'brown';
				status.style.backgroundColor = ' #f8d7db';
				status.innerText = data.message;
			} else {
				status.style.display = 'block';
				status.style.color = '#43aff7';
				status.style.backgroundColor = ' #d2ecf0';
				status.innerText = 'generating weather details...';

				setTimeout(() => {
					details.style.display = 'flex';
					searchBox.style.display = 'none';
					city.value = '';
				}, 1000);
			}
			const { feels_like, humidity, temp } = data.main;
			const country_code = data.sys.country;
			const { description, icon } = data.weather[0];

			document.querySelector('.temperature').innerHTML = `${Math.floor(
				temp
			)}&deg;C`;
			document.querySelector('.feelsLike').innerHTML = `${feels_like}&deg;C`;
			document.querySelector('.humidity').innerHTML = `${humidity}%`;
			document.querySelector(
				'.location'
			).innerHTML = `<span class="material-icons"> location_on </span>${
				city.value == '' ? data.name : city.value
			}, ${country_code}`;
			document.querySelector('.update').innerHTML = `${description}`;
			img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
		})
		.catch((err) => {
			console.log(err);
		});
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((e) => {
			fetchingDetails(
				`https://api.openweathermap.org/data/2.5/weather?lat=${e.coords.latitude}&lon=${e.coords.longitude}&appid=${API_KEY}`
			);
		});
	}
}
