import React, { useContext , useState} from 'react';
import {Form ,Button} from 'semantic-ui-react';
import {gql, useMutation} from '@apollo/client';
import { useHistory } from 'react-router-dom';

import {useForm} from '../util/hooks';
import {AuthContext} from '../context/auth';


 function Register(props) {
    const context  = useContext(AuthContext);

    const [errors, setErrors] = useState({});

     const {onChange , onSubmit , values} = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''  
     });

const history = useHistory();
const handleHistory = () => history.push('/');

const [addUser, {loading}] = useMutation(REGISTER_USER, {
    update(_, {data: {register : userData}}){
        context.login(userData);
        handleHistory();
    },
    onError(err){
          setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
});

function registerUser(){
    addUser()
}

    return (
        <div className="form-container">
           
           <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
               <h1>Register</h1>
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
               label="Email"
               type="email"
               plaveholder="Email.."
               name="email"
               value={values.email} 
               error={errors.email ? true : false} 
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

            <Form.Input 
               type="password"
               label="Confirm Password"
               placeholder="Confirm Password.."
               name="confirmPassword"
               value={values.confirmPassword} 
               error={errors.confirmPassword ? true : false} 
               onChange={onChange}
               />
               <Button type="submit" primary>
                   Register
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



const REGISTER_USER = gql`
mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!

){
    register(
        registerInput: {
    username: $username
    email: $email
    password: $password
    confirmPassword: $confirmPassword
        }
    ){
        id email username createdAt token
    }
}
`;
export default Register;