(function () {
	const form = document.querySelector('#search-form');
	const searchField = document.querySelector('#search-keyword');
	let searchedForText;
	const responseContainer = document.querySelector('#response-container');

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		
		searchedForText = searchField.value;
		responseContainer.innerHTML = '';
	});

	function addImage(data) {
		let htmlContent = '';
		const firstImage = data.results[0];

		if (firstImage) {
			htmlContent = `<figure>
            <img src="${firstImage.urls.small}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
		} else {
			htmlContent = 'Unfortunately, no image was returned for your search.'
		}

		responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
	}

	function addArticles(data) {
		let htmlContent = '';
		if (data.response && data.response.docs && data.response.docs.length > 1) {
			const articles = data.response.docs;
			htmlContent = '<ul>' + articles.map(article => `<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>`).join('') + '</ul>';
		} else {
			htmlContent = 'div class="error-no-articles">No articles available</div>';
		}
		responseContainer.insertAdjacentHTML('beforeend', htmlContent);
	}
	var testingurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
	fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
			headers: {
				Authorization: 'Client-ID fcfd5ec3ab7905eeae1a6268ff3d53ebfaedaa59e9380aac5d4bf392cad28852'
			}
		}).then(response => response.json())
		.then(addImage)
		.catch(e => requestError(e, 'image'));
	fetch(testingurl += '?' + $.param({
			'api-key': "83fef4dc7c3d4bff9791e5f44f4426b9",
			'q': searchedForText
		})).then(response => response.json())
		.then(addArticles)
		.catch(e => requestError(e, 'articles'));

	function requestError(e, part) {
		console.log(e);
		responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
	}

})();
//status