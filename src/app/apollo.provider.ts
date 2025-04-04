import { Provider } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloLink, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export function provideApollo(): Provider {
  return {
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      const http = httpLink.create({
        uri: 'http://localhost:1024/graphql'
      });

      const authLink = setContext((_, { headers }) => {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        return {
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
          }
        };
      });

      return {
        cache: new InMemoryCache(),
        link: from([authLink, http])
      };
    },
    deps: [HttpLink]
  };
}