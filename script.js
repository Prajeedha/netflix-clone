
window.onload=()=>{
    getOriginals();
 getTrendingNow();
 getTopRated();
 getGenres();
 getWishList()
}

let apiUrl="http://localhost:3000";

function getWishList(){
    fetch(`${apiUrl}/wishlist`,{
     headers:{
         Authorization:`${localStorage.getItem('token')}`
     }
    })
    .then((response)=>{
        if(response.ok)
        {
            return response.json();
        }
      else{
          throw new Error("Something went wrong");
      }
    }).then((data)=>{
       showMovies(data,"#wishlist","backdrop_path")
    })
    .catch((error)=>{
        
       console.log(error);
    })
  }
  
async function getMovieTrailer(id){
    var url=`https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213`;
    return await fetch(url)
    .then((response)=>{
        if(response.ok)
        {
            return response.json();
        }
      else{
          throw new Error("Something went wrong");
      }
    })
}

async function getGenres(){
    var url="https://api.themoviedb.org/3/genre/movie/list?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US";
    await fetch(url)
    .then((response)=>{
        if(response.ok)
        {
         return response.json();
        }
      else{
          throw new Error("Something went wrong");
      }
    })
    .then((data)=>{
        showMoviesGenres(data);
    })
    .catch((error)=>{
       console.log(error);
    })
}

 const showMoviesGenres=(genres)=>{
    genres.genres.forEach(function(genre){
       var movies= fetchMoviesBasedOnGenre(genre.id);
       movies.then(function(movies){
           showMoviesBasedOnGenre(genre.name, movies);
       })
    })
}

const fetchMoviesBasedOnGenre=(genreId)=>{
   var url= "https://api.themoviedb.org/3/discover/movie?";
   url += "api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
   url+= `&with_genres=${genreId}`;
   
 return fetch(url)
    .then((response)=>{
        if(response.ok)
        {
            return response.json();
        }
      else{
          throw new Error("Something went wrong");
      }
    }) // returns a promise already
   
}

const showMoviesBasedOnGenre=(genreName,movies)=>{
 var allMovies = document.querySelector('.movies');

   let genreEl= document.createElement('div');
   genreEl.classList.add('movies_header');
   genreEl.innerHTML=`<h2> ${genreName}</h2>`;

   let moviesEl=document.createElement('div');
   moviesEl.classList.add('movies_container');
   moviesEl.setAttribute('id',genreName);
   
    for(var movie of movies.results) {  
        var imageElement=document.createElement('img');
        imageElement.setAttribute('data-id',movie.id);
        imageElement.src= `https://image.tmdb.org/t/p/original${movie["backdrop_path"]} `;
        imageElement.addEventListener('click',(e) =>{
            handleMovieSelection(e);
        });
       moviesEl.appendChild(imageElement);
  }
  allMovies.appendChild(genreEl);
  allMovies.appendChild(moviesEl);
}

const setTrailer=(trailers)=>{
  const iframe=document.getElementById('movieTrailer');
  const movieNotFound= document.querySelector('.movieNotFound');
  if(trailers.length > 0){
      movieNotFound.classList.add('d-none');
      iframe.classList.remove('d-none');
      iframe.src=`https://www.youtube.com/embed/${trailers[0].key}`;
  }else{
    iframe.classList.add('d-none');
   movieNotFound.classList.remove('d-none');
  }
}
    

const handleMovieSelection=(e)=>{
    const id=e.target.getAttribute('data-id');
    getMovieTrailer(id).then((data)=>{
        const results=data.results;
        const youTubeTrailers = results.filter((results)=>{
            if(results.site=="YouTube" && results.type=="Trailer"){
                return true;
            }else {
                return false;
            }
        })
        setTrailer(youTubeTrailers);
    });
    $('#trailerModal').modal('show');
}


const showMovies=(movies, element_selector,path_type)=>{
    var moviesEl=document.querySelector(element_selector);
    for(var movie of movies.results) {  
        var imageElement=document.createElement('img');
        imageElement.setAttribute('data-id',movie.id);
        imageElement.src= `https://image.tmdb.org/t/p/original${movie[path_type]} `;
        imageElement.addEventListener('click',(e) =>{
            handleMovieSelection(e);
        });
       moviesEl.appendChild(imageElement);
}
}

const fetchMovies=(url,element_selector,path_type)=>{
    fetch(url)
    .then((response)=>{
        if(response.ok)
        {
            return response.json();
        }
      else{
          throw new Error("Something went wrong");
      }
    })
    .then((data)=>{
        showMovies(data ,element_selector,path_type);
    })
    .catch((error)=>{
       console.log(error);
    })
}

const getOriginals=()=>{
    var url="https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
  fetchMovies(url,".original_movies","poster_path");
}

const getTrendingNow=()=>{
    var url="https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
    fetchMovies(url, '#trending' , 'backdrop_path');
}

const getTopRated=()=>{
    var url ="https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
    fetchMovies(url,'#top_rated','backdrop_path');
}

// function addMovies(movies){
//     var moviesEl=document.querySelector('.original_movies');
//     for(var movie of movies.results) {
 
//         var image=`<img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt=""></img>`;

//     moviesEl.innerHTML+=image;
// }
// }

// function showTrending(movies){
//     var moviesEl=document.querySelector('#trending');
//     for(var movie of movies.results) {
//        var image='';
//        image=`<img src="https://image.tmdb.org/t/p/original${movie.backdrop_path}" alt=""></img>`;

//     moviesEl.innerHTML+=image;
// }
// }

// function showTopRated(movies){
//     var moviesEl=document.querySelector('#top_rated');
//     for(var movie of movies.results) {
//        var image='';
//        image=`<img src="https://image.tmdb.org/t/p/original${movie.backdrop_path}" alt=""></img>`;

//     moviesEl.innerHTML+=image;
// }
// }