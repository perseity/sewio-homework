/// <reference types="cypress" />

import { elements, routes, wsResources } from './constants';
import { FeedData, PositionEvent, Result, ZoneData, ZoneEvent } from './types';

const prepareRestHeaders = () => ({
  accept: 'application/json',
  'X-ApiKey': Cypress.env('apiKey'),
});

const prepareWSHeaders = (method: string, resource: string) => JSON.stringify({
  headers:
  {
    'X-ApiKey': Cypress.env('apiKey')
  },
  method: method,
  resource: resource
});

enum WSMethod {
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe'
}


// API commands
Cypress.Commands.addAll({
  // using /feed/<mac> instead of /feeds to keep it simple
  // otherwise I would filter "results" by title
  getFeed(mac: string): Cypress.Chainable<Result<FeedData>> {
    return cy.request({
      method: 'GET',
      url: routes.api.feed(mac),
      headers: prepareRestHeaders(),
      failOnStatusCode: false
    }).then(((response) => ({
      status: response.status,
      data: response.body
    })));
  },

  getZones(): Cypress.Chainable<Array<ZoneData>> {
    return cy.request<Array<ZoneData>>({
      method: 'GET',
      url: routes.api.zones(),
      headers: prepareRestHeaders(),
      failOnStatusCode: false
    }).its('body');
  },

  openWebsocket(): Cypress.Chainable<WebSocket> {
    const connectionOpen = new Promise<WebSocket>((resolve) => {
      const wss = new WebSocket(routes.wss.base());
      wss.onopen = () => resolve(wss);
    });

    return cy.wrap(connectionOpen);
  },

  subscribeTo<T>(resource: string, duration: number): Cypress.Chainable<Array<T>> {
    const messages: Array<T> = [];

    cy.openWebsocket()
      .then((wss) => {
        wss.onmessage = function (e) {
          messages.push(JSON.parse(e.data));
        };

        wss.send(prepareWSHeaders(WSMethod.Subscribe, resource));
        
        cy.wait(duration)
          .then(() => {
            wss.send(prepareWSHeaders(WSMethod.Unsubscribe, resource));
            wss.close();
          });
      });
    
    return cy.wrap(messages);
  },

  subscribeToFeeds(id: string, duration: number): Cypress.Chainable<Array<PositionEvent>> {
    return cy.subscribeTo(wsResources.feed(id), duration);
  },
  
  subscribeToZones(duration: number): Cypress.Chainable<Array<ZoneEvent>> {
    return cy.subscribeTo(wsResources.zones, duration);
  }
});

// UI Commands
Cypress.Commands.addAll({
  login(): void {   
    cy.get(elements.login.button)
      .click();
  },
});
