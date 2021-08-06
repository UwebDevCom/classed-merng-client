import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, createHttpLink, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';


const link = createHttpLink({
    uri: 'https://tut-gql-react.herokuapp.com/',
});


const authLink = setContext(()=>{
    const token = localStorage.getItem('jwtToken');
    return {
        headers:{
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link : authLink.concat(link),
    cache: new InMemoryCache()
});


export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)