import React, { useContext, useState} from 'react';
import {Form ,Button} from 'semantic-ui-react';
import {gql, useMutation} from '@apollo/client';
import { useHistory } from 'react-router-dom';
import {useForm} from '../util/hooks';
import {AuthContext} from '../context/auth';

 function Login(props) {
     const context = useContext(AuthContext);
     const [errors, setErrors] = useState({});
     
     
 
     const {onChange, onSubmit, values} = useForm(loginUserCallback,{
         username: '',
         password: ''
     });

     const history = useHistory();
     const handleHistory = () => history.push('/');

     const [loginUser, {loading}] = useMutation(LOGIN_USER, {
        update(_, {data: {login: userData}}){
            console.log(userData);
            context.login(userData);
        
            handleHistory();
    },
    onError(err){
          setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
})
function loginUserCallback(){
    loginUser();
}

    return (
        <div className="form-container">
           
           <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
               <h1>Login</h1>
               <Form.Input 
               type="text"
               label="username"
               placeholder="Username.."
               name="username"
               value={values.username}
               error={errors.username ? true : false} 
               onChange={onChange}
               />


            <Form.Input 
               type="password"
               label="Password"
               placeholder="Password.."
               name="password"
               value={values.password} 
               error={errors.password ? true : false} 
               onChange={onChange}
               />

               <Button type="submit" primary>
                   Login
               </Button>
           </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value=>(
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    )
}



const LOGIN_USER = gql`
mutation login(
    $username: String!
    $password: String!

){
    login(
    username: $username
    password: $password
    ){
        id email username createdAt token
    }
}
`;

export default Login;