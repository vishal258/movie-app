import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// then import File import
import './index.css';
import App from './components/App';
import rootReducer from './reducers';
// import combineReducer from './reducers/index';

//  this obj will have access of two properties one is dispatch() and
//other is getState() and both of these are the funcion of store,
//(actually redux pass these function to logger)
// const logger = function(obj){

// }

//                OR

//  or we can destructure them
// const logger = function({dispatch, getState}){
//   //  this logger function is curried form of function with obj, next, action as a argument (function logger(obj, next, action))
//   //  Internally redux call logger function like this logger(obj)(next)(action)
//   return function(next) {
//     return function(action){
//       //  here i can write middleware code
//       console.log('ACTION_TYPE =', action.type, );
//       next(action);

//     }
//   }
// }

// arrow function and currying concept
// var f = () => 1, when we have one statement in a function we can write something like this and this function will return 1 when it gets ccalled.
//  var f = () => () => 1 f()(), used currying concept with arrow function

// middleware
const logger = ({ dispatch, getState }) => next => action => {
  if (typeof action !== 'function') {
    console.log('ACTION_TYPE =', action.type);
  }

  next(action);
};

// middleware

// { READ ALL COMMENTS}

//  We don't need to create thunk middleware redux give us the thunk middleware we just need to install it and use it

// const thunk = ({dispatch, getState}) => (next) => (action) =>{
//   if(typeof action === 'function'){
//     //  first go to action - index.js and read all comments of handleMovieSearch()
//     // now this middleware is helping us to pass dispatch as an agrument to the action whose type(returned function) is function so that we can again dispatch the action in to the reducers.

//     action(dispatch);
//     return;
//   }
//   next(action);
// }

// createStore krne k baad redux internally rootReducer ko call krta h.
const store = createStore(rootReducer, applyMiddleware(logger, thunk));
console.log('store', store);

export const storeContext = createContext();

class Provider extends React.Component {
  render() {
    const { store } = this.props;
    return (
      <storeContext.Provider value={store}>
        {/* I want to render everything b/w Provider or you can say all the children of Provider i'll call them here */}
        {this.props.children}
      </storeContext.Provider>
    );
  }
}

// START START START START START STARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTART

// Before implementing connect() function some key point i should keep in mind this connect() will return a brand new component which have access to some properties they need from store. 2nd thing is whenever something changes to the state or properties this particular component should get to know that some change happens and get rerender means that we have to call subscribe method inside componentDidMount and we should also unsubscribe this event in componentWillUnMount so that our app will not get heavy.

// const connectedAppComponent = connect(callback)(App);

// export function connect(callback){
//   return function (Component){
//     // because this connect() will return new component so we're gonna make new component here.
//     return class connectedComponent extends React.Component{
//       // when some change happens then it should rerender our component for that i should subscribe to the store
//       constructor (props){
//         super(props);
//         this.props.store.subscribe(() => this.forceUpdate());
//       //  before reading constructor comment first go through all comments.
//       // Again there is problem here we don't have access of store over here, in constructor we've access inside 'storeContext.Consumer' bcos of 'storeContext.Consumer'.
//       // so the solution is to wrap this 'connectedComponent'

//       }

//       render(){
//         return(
//           // this should return our 'Component' which are passed to connect() so we can write like this <Component />.
//           // but returned component should have access of store properties which it need so we've to pass those properties as props to the Component.
//           <storeContext.Consumer>
//             {(store) => {
//               const state = store.getState();
//               const dataToBePassedAsProps = callback(state);
//               return (
//                 <Component
//                   {...dataToBePassedAsProps}
//                   dispatch = {store.dispatch}
//                 />
//                 // dispatch by default pass hota hai
//               );
//             }}
//           </storeContext.Consumer>
//         )
//       }
//     }
//   }
// }

// END END END END ENDEND END ENDEND END ENDENDENDENDENDENDENDENDENDEND

//  Before heading to this first read all the codes and comments from START to END .

// const connectedComponent = connect(callback)(App);
export function connect(callback) {
  return function (Component) {
    // because this connect() will return new component so we're gonna make new component here.
    class ConnectedComponent extends React.Component {
      // when some change happens then it should rerender our component for that i should subscribe to the store.
      constructor(props) {
        super(props);
        this.unsubscribe = this.props.store.subscribe(() => {
          this.forceUpdate();
        });
        //  before reading constructor comment first go through all comments.
        // Again there is problem here we don't have access of store over here, in constructor we've access inside 'storeContext.Consumer' bcos of 'storeContext.Consumer'.
        // so the solution is to wrap this 'connectedComponent'
      }

      componentWillUnmount() {
        //  when this particular component destroyed then this unsubscribe() function will be called so that memory gets free
        this.unsubscribe();
      }
      render() {
        const { store } = this.props;
        const state = store.getState();
        const dataToBeSentAsProps = callback(state);

        return <Component dispatch={store.dispatch} {...dataToBeSentAsProps} />;
        // dispatch by default pass hota hai
      }
    }

    class ConnectedComponentWrapper extends React.Component {
      render() {
        return (
          <storeContext.Consumer>
            {store => {
              return <ConnectedComponent store={store} />;
            }}
          </storeContext.Consumer>
        );
      }
    }
    return ConnectedComponentWrapper;
  };
}

// Finally we don't need to write these things(provide, consumer  and connect() ) in any react application, there is a package react-redux that do all these things for us just install it and use it(don't need to make any changes in app.js , navbar, except import connect from react-redux rather than index)

ReactDOM.render(
  <Provider store={store}>
    {/* Why i did like this ? so that App and all it desendant get the access of store */}
    <App />
    {/* Now anything b/w Provider is the children of Provider class and 'store' will be available to all the desendant */}
  </Provider>,

  document.getElementById('root')
);
