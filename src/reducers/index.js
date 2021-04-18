// Reducers in Redux is a Pure function. And in functional programming a function is a pure function if it satisfied 3 conditions, i.e 1-- For the same input Output should be the same everyTime means that no matters how many times i call pure function with a different input but same type(same parameter, and type) Output should be same. 2-- And the second condition is that  function shouuld not use value of another variable that are not define in their local scope and should use argument that are provided to the function

//  reducers function takes two parameter one is current state(and this is not going to be  undefined that's why i've initialise with an empty array) and the 2nd parameter would be action(type of action)

// reducers has to return something whether it could be a new state or something else

// there are some abilities 'store' give us and i.e 
// setState, Read the state, Update the state, listen to the state changes(subscribe)


import {combineReducers} from 'redux'; 

//  we can't have multiple default export in single file 
import { ADD_MOVIES,
        ADD_FAVOURITE,
        UN_FAVOURITE,
        SHOW_FAVOURITE,
        ADD_MOVIE_TO_LIST,
        ADD_SEARCH_RESULT
    }
    from '../actions';

const initialMovieState = {
    list: [],
    favourites: [],
    showFavourite: false
}


export function movies(state = initialMovieState, action){
    // if(action.type === ADD_MOVIES){
    //     return {
    //         ...state,
    //         list: action.movies
    //     }
    // }
    // return state;

    //  In React community we don't rely on if else case idealy, we prefer switch case instead, although we can use if else as well but we prefer switch case

    switch (action.type) {
        case ADD_MOVIES:
            return {
                ...state,
                list: action.movies
            }
        case ADD_FAVOURITE:
            return {
                ...state,
                favourites:[action.movie, ...state.favourites]
            }
        case UN_FAVOURITE:
            const filteredArray = state.favourites.filter(
                movie => movie.Title !== action.movie.Title
            );
            return{
                ...state,
                favourites: filteredArray
            }
        case SHOW_FAVOURITE:
            return{
                ...state,
                showFavourite: action.val
            }
        case ADD_MOVIE_TO_LIST:
            return{
                ...state,
                list: [action.movie, ...state.list]
            };
        default:
            return state
    }
}

const initialSearchState = {
    result: {},
    showSearchResults: false
};

export function search (state = initialSearchState, action){
    // console.log("SEARCH REDUCER");
    switch (action.type) {
        case ADD_SEARCH_RESULT:
            console.log(action.movie);
            return{ 
            ...state,
            result : action.movie,
            showSearchResults: true
            }
        case ADD_MOVIE_TO_LIST:
            return{
                ...state,
                showSearchResults: false
            };
        default:
            return state
    }
}

// const initialRootReducer = {
//     movies: initialMovieState,
//     search: initialSearchState
// }


// when the dispatch() called then rootReducer will be called automatically and both reducer(movie and search) reducer will be called.
// you can do console.log inside these reducer and check yourself.


// export default function rootReducer (state = initialRootReducer, action){
//     return{
//         movies: movies(state.movies, action),
//         search: search(state.search, action)
//     }
// }

//  going to use inbuilt combine reducer and we just need to pass the reducer.

 export default combineReducers({
    //  combineReducer is smart enough i mean we don't need to write state.movies like we hardcoded this 
    movies: movies,
    search: search
    //  we can use shorthand of this means that if reducers name is same as property name's  then we can do somthing like this
    // movies, search that's it, we can avoid writing like this movies: movies, search: search
});



//  Middleware is piece of code that will run after we've dispatched the action and before that action reaches to reducers

//  So this middleware get this action as the argument and now this middleware can do pretty much anything , like it can modify the action, remove something from the action object, add something to the action object or anything like that