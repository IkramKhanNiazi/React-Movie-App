import React, {Component} from 'react';
import {API_URL, API_KEY, POSTER_SIZE, IMAGE_BASE_URL, BACKDROP_SIZE} from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import './Home.css'

class Home extends Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: '', 
    }

    componentDidMount() {
        if (localStorage.getItem("HomeState")){
            const state = JSON.parse(localStorage.getItem("HomeState"))
            this.setState({...state});

        }else{
            this.setState({loading: true});
            const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
            this.fetchMovies(endpoint);
        }
    }

    searchMovies = (searchTerm) => {
        let endPoint = '';
        this.setState({
            movies: [],
            loading: true,
            searchTerm,
        });

        if (searchTerm === ''){
            endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        }else{
            endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
        }
        this.fetchMovies(endPoint);
    }

    loadMoreMovies = () => {
        let endPoint = '';
        this.setState({loading: true});

        if (this.state.searchTerm === ''){
            endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
        }else{
            endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
        }
        this.fetchMovies(endPoint);
    }

    fetchMovies = (endpoint) => {
        fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            this.setState({
                movies: [...this.state.movies, ...data.results ],
                heroImage: data.results[0],
                currentPage: data.page,
                totalPages: data.total_pages,
                loading: false,

            }, () => {
                localStorage.setItem("HomeState", JSON.stringify(this.state));
            })
        });
    }
    

    render(){
        return(
            <div className="rmdb-home">
            {this.state.heroImage ?
               <div>
                    <HeroImage 
                    image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
                    title={this.state.heroImage.original_title}
                    text={this.state.heroImage.overview}
                    />
                    <SearchBar
                    callback={this.searchMovies}
                    />
                </div>
            :null}
             <div className="rmdb-home-grid">
                <FourColGrid
                header={this.state.searchTerm ? 'Search Result' : 'Popular Movies'}
                loading={this.state.loading}
                >
                {this.state.movies.map ( (element, i) => { 
                    return <MovieThumb
                            key={i}
                            clickable={true}
                            image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                            movieId={element.id}
                            movieName={element.original_title}
                        />
                })}  
                </FourColGrid>
             </div>
             {this.state.loading ? <Spinner/> : null}    
             {(this.state.currentPage <= this.state.totalPages && !this.state.loading) ?
                <LoadMoreBtn text="Load More" onClick={this.loadMoreMovies} />
            : null }
            </div>
        )
    }
}

export default Home;