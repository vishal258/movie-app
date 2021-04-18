 import React from 'react';
import {data} from '../data';
import Navbar from './Navbar';
import MovieCard from './MovieCard';
import {addMovies, showFavourite} from '../actions';
import {connect} from '../index';


class App extends React.Component{
  componentDidMount(){
    //  Note When the dispatch() called immedietly subscribe() gets called and update the component
    // make api call
    //  const {store} = this.props;

    //  subsvribe
    // store.subscribe(() =>{
    //   console.log('Updated');
    //   // we shouldn't use forceUpdate() in our application, just for the understanding purpose we did this 
    //   this.forceUpdate();
    // })
    // dispatch action
    this.props.dispatch(addMovies(data));
    console.log('state', this.props);
  }

  isMovieFavourite = (movie) =>{
    const { movies } = this.props;

    const index = movies.favourites.indexOf(movie);

    if(index !== -1){
      // found the movie
      return true;
    }
    return false;
  }

  onChangeTab = (val) =>{
    this.props.dispatch(showFavourite(val));
  }
  render(){
    const {movies, search} = this.props // {movies: movies(), search: search()}
    const {list, favourites, showFavourite} = movies;
    console.log('RENDER', this.props);
    const showMovie = showFavourite ? favourites : list ;
    
    return (
      <div className= 'App'>
        <Navbar search={search} />
        <div className="main">
          <div className="tabs">
            <div className= {`tab ${showFavourite ? '' : 'active-tabs'}`} onClick = {() => this.onChangeTab(false)}>Movies</div>
            <div className={`tab ${showFavourite ? 'active-tabs' : ''}`} onClick = {() => this.onChangeTab(true)}>Favourites</div>
          </div>
          <div className="list">
            {showMovie.map((movie, index) => (
              <MovieCard
                 movie ={movie}
                 key= {`movies-${index}`}
                 dispatch = {this.props.dispatch}
                 isFavourite = {this.isMovieFavourite(movie)} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}


// class AppWrapper extends React.Component{
//   render(){
//     return (
//       <storeContext.Consumer>
//         {(store) => <App store ={store} />}
//       </storeContext.Consumer>
//     )
//   }
  
// }

function mapStateToProps(state){
  // 'state' argument in callback function is 'the root state of redux which redux is holding'. 
  // whatever data we want from redux store  and to have access to 'passed' component we'll pass here.
  return {
    movies: state.movies,
    search: state.search
  }
}

// the second argument of connect() method tells that 'this particular component wants to connect to the redux store basically we pass that component that we want to be connected to redux store'. 
// bydefault dispatch() pass to component internally to the component that are passed to the connect() method to be connected to the store. So here  dispatch() is being passed to App component interally by default. 
const connectedAppComponent = connect(mapStateToProps)(App);

//  One more thing i want to tell here is earlier we were using storeContext.Provider to provide access to the store and by doing this all the desendant of Component will get the access of store(by using storeContext.Consumer) the problem with this approach is this, when our store gets updated then all the desendant component will rerender() and ye fark nhi padta ki unn component ka data change hua h ya nhi agr store update hota h to saare desendant component rerender honge.

// But with this apporach where we are connecting each component to the store via connect() method, and agr inke state change hote h tb ye component rerender honge warna nhi honge.




export default connectedAppComponent;