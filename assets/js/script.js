const fetchUrl = 'https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&range=1-100';
const titleFetchUrl = 'https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas/';
findPage();

function findPage() {
    const url = window.location.href;
    fetch(fetchUrl) //specifies the url to fetch() method
        .then(response => response.json()) //converts response to JSON object
        .then(response => { //passing data through arrow function
            let data = response.entries;
            // checking the URL to see which page the user is on
            if (url.indexOf('Action') > -1) {
                genrePage(data, 'Action');
            } else if (url.indexOf('Adventure') > -1) {
                genrePage(data, 'Adventure');
            } else if (url.indexOf('Animation') > -1) {
                genrePage(data, 'Animation');
            } else if (url.indexOf('Comedy') > -1) {
                genrePage(data, 'Comedy');
            } else if (url.indexOf('Crime') > -1) {
                genrePage(data, 'Crime');
            } else if (url.indexOf('Documentary') > -1) {
                genrePage(data, 'Documentary');
            } else if (url.indexOf('Drama') > -1) {
                genrePage(data, 'Drama');
            } else if (url.indexOf('Horror') > -1) {
                genrePage(data, 'Horror');
            } else if (url.indexOf('Kids%20movies') > -1) {
                genrePage(data, 'Kids movies');
            } else if (url.indexOf('Science%20Fiction') > -1) {
                genrePage(data, 'Science Fiction');
            } else if (url.indexOf('Thriller') > -1) {
                genrePage(data, 'Thriller');
            } else if (url.indexOf('War') > -1) {
                genrePage(data, 'War');
            } else if (url.indexOf('title') > -1) {
                title(data, url);
            } else if (url.indexOf('wishlist') > -1) {
                wishlist(data);
            } else {
                frontpage(data);
            }
        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function frontpage(data) { //making the frontpage
    document.querySelector('h1').innerHTML = 'Movies and series'; //setting h1
    let text = ''; 
    let genres = [];
    console.log(data);
    data.forEach(entry => { //looping through all entries in data
        entry.plprogram$tags.forEach(element => { //looping through all tags to find genres
            if (element.plprogram$scheme == 'genre') {
                genres.push(element.plprogram$title); //pushing all genres into array
            }
        });
    });
    genres.sort(); //sorts the genres by alphabet
    let uniqueGenres = [new Set(genres)]; //making array with unique genres 

    uniqueGenres[0].forEach(genre => { // looping through all genres in uniqueGenres
        let genreCount = countTitlesInGenres(data, genre); //counting titles in genres
        let titles = firstTitles(data, genre); //finding the first movies in specific genre

        text += `
            <h2 class="genreHeader">${genre}</h2>
            <section class="genreFlex">
                <p>Movies and series in this genre: ${genreCount}</p>
                <a href="index.html?${genre}">Show all ${genre.toLowerCase()} movies and series</a>
            </section>
            <section class="frontpageGrid">
        `;

        titles.forEach(title => { // looping through titles found in firstTitles() function
            let coverUrl = findCoverForTitle(data, title, 1); // finding cover for title, 1 tells the function that the function is called from the frontpage
            let id = findId(data, title); // finding ID for specific title
            // setting URL as index.html?title?id so the user can click and read more
            text += `
                    <a href="index.html?title?${id}">
                        <img src="${coverUrl}" alt="${title}">
                        <h3>${title}</h3>
                    </a>
            `;
        })

        text += `
            </section>
        `;
    });

    document.querySelector('#output').innerHTML = text; //putting text variable into div with id=output
}

function countTitlesInGenres(data, genre) { //function for counting number of titles in specific genre
    let movieCount = 0;
    data.forEach(entry => {
        entry.plprogram$tags.forEach(element => {
            if (element.plprogram$scheme == 'genre') {
                if (element.plprogram$title == genre) {
                    movieCount++;
                }
            }
        })
    })
    return movieCount;
}

function firstTitles(data, genre) { // finding titles for the first 5 movies/series in specific genre
    let titles = [];
    data.forEach(entry => {
        entry.plprogram$tags.forEach(element => {
            if (element.plprogram$title == genre & titles.length != 5) {
                titles.push(entry.title);
            }
        })

    })
    return titles;
}

function findCoverForTitle(data, title, frontpage) { // finding cover for title, frontpage variable tells the function if the cover needs to be on frontpage
    let coverUrl;
    data.forEach(entry => {
        if (entry.title == title) {
            if (entry.plprogram$thumbnails['orig-720x1280'] && entry.plprogram$thumbnails['orig-720x1280'].plprogram$url != '') {
                coverUrl = entry.plprogram$thumbnails['orig-720x1280'].plprogram$url;
            } else {
                if (frontpage == 1) {
                    coverUrl = 'assets/images/coverNotFound.jpg'; //finding image from assets when movie/series don't have an image FOR FRONTPAGE
                } else {
                    coverUrl = 'assets/images/coverNotFound2.jpg'; //finding image from assets when movie/series don't have an image
                }
            }
        }
    });
    return coverUrl;
}

function genrePage(data, genre) { //function that makes page for specific genre
    console.log(genre);
    console.log(data);
    document.querySelector('h1').innerHTML = `All ${genre.toLowerCase()} movies`; // h1 for specific genre
    let genreCount = countTitlesInGenres(data, genre); // counting genres in specific genre
    document.getElementById('count').innerHTML += `
        <p>Number of titles: ${genreCount}</p>
    `;
    let text = '';
    let titles = [];
    data.forEach(entry => { //looping through data to find all the titles with specific genre
        entry.plprogram$tags.forEach(element => {
            if (element.plprogram$title == genre) {
                titles.push(entry.title);
            }
        })
    })
    text += `
        <section class="genreGrid">
    `;
    titles.forEach(title => { 
        let coverUrl = findCoverForTitle(data, title, 0); // finding cover for title, 0 tells the function that the function is NOT called from the frontpage
        let id = findId(data, title); // finding ID for specific title to create URL for specific title
        text += `
                <section>
                    <a href="index.html?title?${id}">
                        <img src="${coverUrl}" alt="${title}">
                        <h3>${title}</h3>
                    </a>
                </section>
            `;
    })
    text += `
            </section>
            <hr>
        `;
    document.querySelector('#output').innerHTML = text;
}

function findId(data, title) { // function for finding ID for title
    let id = [];
    data.forEach(entry => {
        if (entry.title == title) {
            id = entry.id.split('/');
        }
    });
    return id[6]; //returning id[6] because this contains the ID for the title
}

function title(data, url) { //function for creating page for specific title
    const urlSplit = url.split('?'); //splitting the url by '?'
    let id = urlSplit[2]; //initialising id as urlSplit[2] because this contains ID for specific title
    let text = '';
    fetch(titleFetchUrl + id + '?form=json') //specifies the url with ID to fetch() method
        .then(response => response.json()) //converts response to JSON object
        .then(response => { //passing data through arrow function
            let title = response;
            console.log(title);
            findBackdrop(title.plprogram$tags[0].plprogram$title); //finding backdrop

             //finding backdrop
            document.querySelector('h1').innerHTML = `${title.title}`; // h1 for specific title
            document.querySelector('h1').classList.add('title'); // adding style
            let titleCover = findCoverForTitle(data, title.title, 0); //finding cover for title, 0 tells the function that the cover is not for the frontpage
            text += `
                <section class="informationGrid">
                    <img class="informationPic" src="${titleCover}" alt="${title.title}">
                    <article>
                        <h2>Description</h2>
            `;

            if (title.description == '') { // checks if title is empty string
                text += `
                    <p class="description">${title.plprogram$longDescriptionLocalized.en}</p>
                `;
            } else if (title.description != null) { // checks if title is not null
                text += `
                    <p class="description">${title.description}</p>
                `;
            } else { // if title.description is not an empty string and null
                text += `
                    <p class="description">${title.plprogram$longDescriptionLocalized.en}</p>
                `;
            }

            if (title.plprogram$programType == 'movie') { //checking if programType is movie or episode
                text += `<a target="_blank" href="https://www.imdb.com/title/${title.tdc$imdbId}">Read more about the movie here</a>`
            } else {
                text += `<a target="_blank" href="https://www.imdb.com/title/${title.tdc$imdbId}">Read more about the episode here</a>`
            }

            if (title.tdc$youtubeTrailer && title.tdc$youtubeTrailer != '') { //checking if there is a link to youtube trailer
                text += `
                    <iframe width="420" height="315 class="youtube"
                        src="https://www.youtube.com/embed/${title.tdc$youtubeTrailer}">
                    </iframe>
                        `;
            }

            text += `
                    </article>
                    <article class="informationBox">
                        <h2>Release year, genres, director & actors:</h2>
                        <ul>
                            <li>Release year: ${title.plprogram$year}</li>
                            <li>Genres:
                            <ul>
            `;

            title.plprogram$tags.forEach(tag => { //finding all genres for specific title
                if (tag.plprogram$scheme == 'genre') {
                    text += `<li>${tag.plprogram$title}</li>`;
                }
            })

            text += `
                            </ul>
                        </li>
                        <li>Director</li>
                        <ul>
            `;

            let directorArray = [];
            title.plprogram$credits.forEach(credit => { //finding all directors for movie/series
                if (credit.plprogram$creditType == 'director') {
                    directorArray.push(credit.plprogram$personName);
                }
            })

            let uniqueDirectors = [new Set(directorArray)]; //making sure director is not listed twice
            console.log(uniqueDirectors);
            uniqueDirectors[0].forEach(director => {
                text += `<li>${director}</li>`;
            })

            text += `</ul>
                        <li>Actor</li>
                        <ul>
            `;

            title.plprogram$credits.forEach(credit => { //finding all actors for movie/series
                if (credit.plprogram$creditType == 'actor') {
                    text += `<li>${credit.plprogram$personName}</li>`;
                }
            })

            text += `
                            </ul>
                        </ul>
                    </section>
                </article>`;

            if (window.localStorage.getItem("wishlist") && window.localStorage.getItem("wishlist") != '') { //checking if window.localStorage.wishlist exists and if its not an empty string
                let wishlist = window.localStorage.getItem("wishlist"); //setting wishlist as window.localStorage.wishlist
                wishlistSplit = wishlist.split(','); //splitting the string by ','
                const isTitleOnWishlist = wishlistSplit.find(element => element == id); //checking if there is a ID in wishlist that matches the ID for the specific title
                if (isTitleOnWishlist == undefined) { //if there is NOT an ID on the wishlist that matches the ID for the specific title
                    text += `<button onclick="addToWishlist()">Add this title to your wishlist</button>`;
                } else { //if theres IS an ID on the wishlist that matches the ID for the specific title
                    text += `<button onclick="removeFromWishlist()">Remove this title from your wishlist</button>`;
                }
            } else { // if window.localStorage.wishlist does not exist
                text += `<button onclick="addToWishlist()">Add this title to your wishlist</button>`;
            }

            document.querySelector('#output').innerHTML = text;
        })
        .catch(error => {
            console.log(error); // logs any errors
        })
}

function addToWishlist() { //function for adding title to wishlist
    const url = window.location.href; //saving the URL because this contains the title's ID
    const urlSplit = url.split('?'); //splitting the URL by '?';
    if (window.localStorage.getItem("wishlist") && window.localStorage.getItem("wishlist") != '') { //checking if window.localStorage.wishlist exists and if its not an empty string
        let oldWishlist = window.localStorage.getItem("wishlist"); //creating oldWishlist containing wishlist from localStorage
        oldWishlistSplit = oldWishlist.split(','); //splitting the oldWishlist by ','
        console.log(oldWishlistSplit);
        const isTitleOnWishlist = oldWishlistSplit.find(element => element == urlSplit[2]); //checking if the ID is already on wishlist
        if (isTitleOnWishlist != undefined) { //if ID is found on wishlist
            alert('Title is already on your wishlist!');
            window.localStorage.setItem("wishlist", oldWishlist);
        } else { //if ID is not on wishlist
            let newWishlist = urlSplit[2] + "," + oldWishlist; //making newWishlist and adding the new ID for the specific title + the oldWishlist
            window.localStorage.setItem("wishlist", newWishlist); // setting wishlist in localStorage as newWishlist
            let text = `
                <p class="wishlistAdd">The title is now added to your <a href="index.html?wishlist">wishlist</a>!</p>
            `;
            document.querySelector('#output').innerHTML += text;
        }
    } else { // if window.localStorage.wishlist does not exist yet
        let text = `
            <p class="wishlistAdd">The title is now added to your <a href="index.html?wishlist">wishlist</a>!</p>
        `;
        document.querySelector('#output').innerHTML += text; //adding text variable to div with id=output
        window.localStorage.setItem("wishlist", urlSplit[2]); //setting wishlist in localStorage as urlSplit[2] because this contains ID for specific title
    }
}

function wishlist(data) { //function for showing the users wishlist
    let text = '';
    document.querySelector('h1').innerHTML = `Wishlist`;
    if (window.localStorage.getItem("wishlist")) { // checking if wishlist exists in localStorage
        if (window.localStorage.getItem("wishlist") == '') { //checking if the wishlist in localStorage is an empty string
            document.getElementById('count').innerHTML += ` 
                <p>You have no titles on your wishlist.</p>
            `;
        } else if (window.localStorage.getItem("wishlist") != '') { //if wishlist in localStorage is not an empty string the wishlist will be shown
            let titleCount = countTitlesOnWishList();
            //showing the number of titles on wishlist
            document.getElementById('count').innerHTML += ` 
                    <p>Number of titles on your wishlist: ${titleCount}</p>
                `;

            text += `
                    <section class="genreGrid">
                `;
            let wishlist = (window.localStorage.getItem("wishlist")); //getting wishlist from localStorage
            let wishlistSplit = wishlist.split(','); //splitting wishlist by ','
            wishlistSplit.forEach(wishlistId => { //looping through wishlistSplit to display all titles on wishlist
                data.forEach(entry => {
                    let id = findId(data, entry.title); //finding ID for specific movie from data
                    if (wishlistId == id) { //if ID from data matches ID from wishlist
                        let coverUrl = findCoverForTitle(data, entry.title, 0); //finding cover for title, 0 tells the function that the function is NOT called from the frontpage
                        text += `
                                <section>
                                    <a href="index.html?title?${id}">
                                        <img src="${coverUrl}" alt="${entry.title}">
                                        <h3>${entry.title}</h3>
                                    </a>
                                    <p onclick="removeFromWishlist(${id})" class="removeFromWishlist">Remove from wishlist</p>
                                </section>
                            `;
                    }
                })
            })
            text += `
                </section>
                <button onclick="clearWishlist()"class="clearWishlistBtn">Clear wishlist</button>
            `;
        }
    } else {
        document.getElementById('count').innerHTML += `
            <p>You have no titles on your wishlist.</p>
        `;
    }
    document.querySelector('#output').innerHTML = text;


}

function countTitlesOnWishList() { //function for counting how many titles is on users wishlist
    if (window.localStorage.getItem("wishlist") != '') { //checks if the wishlist in localStorage is not an empty string
        let wishlist = window.localStorage.getItem("wishlist");
        let wishlistSplit = wishlist.split(','); //splitting the wishlist by ','
        let count = 0;
        for (let i = 0; i < wishlistSplit.length; i++) {
            count++;
        }
        return count;
    } else {
        return 0;
    }
}

function removeFromWishlist(id) { //function that removes specific title from wishlist
    const url = window.location.href;
    let wishlist = window.localStorage.getItem("wishlist"); //gets wishlist from localStorage
    wishlistSplit = wishlist.split(','); //splitting the wishlist by ','
    if (url.indexOf('title') > -1) { //checks if the URL contains 'title'
        const urlTitle = window.location.href;
        const urlSplit = urlTitle.split('?'); //splitting the URL by '?'
        
        const isTitleOnWishlist = wishlistSplit.find(element => element == urlSplit[2]); //checks if theres an element in the wishlist that matches urlSplit[2] that contains an ID

        if (isTitleOnWishlist != undefined) { //if find() finds and element matching the ID
            for (let i = 0; i < wishlistSplit.length; i++) { //loops through wishlistSplit
                if (wishlistSplit[i] == isTitleOnWishlist) { //checks if the specific element in the array matches the found element with the matching ID
                    wishlistSplit.splice(i, 1); //splice to remove the element in the array
                }
            }

            window.localStorage.setItem("wishlist", wishlistSplit); //sets wishlist in localStorage to wishlistSplit which is the updated wishlist without the removed title

            let text = `<p class="wishlistAdd">The title is now removed from your <a href="index.html?wishlist">wishlist</a>!</p>`;

            document.querySelector('#output').innerHTML += text;
        }
    } else { //if the URL doesn't contain 'title' (the user is on the wishlist page)
        for (let i = 0; i < wishlistSplit.length; i++) { //loops through wishlistSplit
            if (wishlistSplit[i] == id) { //checks if the specific element in the loop matches the ID
                wishlistSplit.splice(i, 1); //splice to remove the element in the array
            }
        }
        window.localStorage.setItem("wishlist", wishlistSplit); //sets wishlist in localStorage to wishlistSplit which is the updated wishlist without the removed title
        location.reload(); //reloads the window so the title is not shown on the wishlist
    }

}

function clearWishlist() { //function that clears entire wishlist
    window.localStorage.setItem("wishlist", ''); // setting wishlist in localStorage to an empty string
    location.reload(); //reloads the window to show that the wishlist is empty
}

function findBackdrop(genre) { // function for finding backdrop
    document.body.style.backgroundImage = `url('./assets/images/${genre}.jpg')`; //putting genre into the .jpg name
    /* ALL IMAGES ARE FROM UNSPLASH, CREDITS:
    Action: William Daigneault
    Adventure: David Marcu
    Animation: Fakurian design
    Comedy: Tim Mossholder
    Crime: Markus Spiske
    Documentary: Alberto Barbarisi
    Drama: Felipe Pelaquim
    Horror: Rosie Sun
    Kids: Greyson Joralemon
    Romance: Freestocks
    Thriller: Make It Special
    War: Tengyart
    */
}

window.onscroll = function() {scroll()};

function scroll() {
    let button = document.getElementById("scrollUp");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

function backToTop() { //function for button that scrolls user to top
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function dropdownMobile() { //function that controls the mobile navigation
    if (document.getElementById("navMobile").style.display === "block") {
        document.getElementById("navMobile").style.display = "none";
        document.querySelector('nav ul li a').style.display = "block";
        document.getElementById("navIkon2").style.display = "none";
        document.getElementById("navIkon").style.display = "block";
        document.querySelector('.emoji').innerHTML = "&#127916;";
    } else {
        document.getElementById("navMobile").style.display = "block";
        document.querySelector('nav ul li a').style.display = "none";
        document.getElementById("navIkon2").style.display = "block";
        document.getElementById("navIkon").style.display = "none";
        document.querySelector('.emoji').innerHTML = "";
    }
}