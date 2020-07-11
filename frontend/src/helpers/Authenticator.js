import * as actions from '../actions/actions.js' ;

const Authenticator = (hasUserLoggedIn, dispatch) => {
    fetch('http://localhost:5000/authenticate', {
      method: 'POST',
      credentials: 'include'
    }).then((response) => response.json()).then(
      (responseJSON) => {
        var response = responseJSON;
        if (response['body'] == 'OK'){
          if (!hasUserLoggedIn){
            dispatch(actions.loguserin(true));
            console.log('server logged in, client not, logging in')
          } 
        }
        else{
          if (hasUserLoggedIn){
            alert('Authentication Error: Please log in.');
            dispatch(actions.loguserin(false));
          }
        }
    })
  }

export default Authenticator