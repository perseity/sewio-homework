/// <reference types="cypress" />
import { FeedData, PositionEvent, Result, ZoneData, ZoneEvent } from './types';

export { };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // API commands
      /**
       * Retrieves feed data for given feed id or mac
       * @param mac accepts mac or feed id
       */
      getFeed(mac: string): Chainable<Result<FeedData>>;
      /**
       * Retrieves all zones data
       */
      getZones(): Chainable<Array<ZoneData>>;
      /**
       * Opens websocket connection and returns its object 
       */
      openWebsocket(): Chainable<WebSocket>;
      /**
       * Uses websocket connection object to subscribe to given {resource} uri
       * and collects messages for given {duration}, after given time unsubscribes 
       * and closes websocket connection.
       * @param resource resource uri to subscribe to
       * @param duration duration to collect messages for 
       */
      subscribeTo<T>(resource: string, duration: number): Chainable<Array<T>>;
      /**
       * Subscribes and collects websocket messages from /feeds/{id}
       * @param id to collect feed messages for
       * @param duration duration to collect messages for 
       */
      subscribeToFeeds(id: string, duration: number): Chainable<Array<PositionEvent>>;
      /**
       * Subscribes and collects websocket messages from /zones/
       * @param duration duration to collect messages for 
       */
      subscribeToZones(duration: number): Chainable<Array<ZoneEvent>>
      // UI commands
      /**
       * Logs in to UI
       * (Currently only clicks on Login button on login form)
       */
      login(): Chainable<void>;
    }
  }
}
