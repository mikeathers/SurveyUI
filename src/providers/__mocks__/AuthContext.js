import context from '../TestAuthContext';
export const AuthContext = ({
  Consumer(props) {
    return props.children(context)
  } 
})