import { elements, routes } from 'cypress/support/constants';

describe('demo spec', () => {
  // To avoid test flakiness the data should be deterministic,
  // hoping these tag macs are always in the system.
  
  // In best case scenario test setup would generate controlled data set
  
  [
    // Update as needed
    '0x00205F150CC1',
    '0x00205EFE1086',
    '0x00205EFE1087',
  ].forEach((mac) => {
    it(`Tag ${mac} exists, is available on plan and provides its position`, () => {
      cy.getFeed(mac).then(({ status, data }) => {

        // ### 1. Check if tag is in the system
        expect(status).to.equal(200, 'Tag exists');
        expect(data.title).to.equal(mac, 'Tag');
        expect(data.type).to.equal('tag', 'Tag');
            
        // ### 2. Check tag is visible on map
        // I would love to check the canvas,
        // but do not know ideal, stable way how to do it quickly - would probably try img diff
        // Checking current-building and current-plan on navbar instead
        cy.visit(routes.ui.sensmap())
          .login();
        cy.get(elements.general.loadingCircle)
          .should('not.be.visible');
        
        // Search for tag mac
        cy.get(elements.sensmap.search)
          .should('be.visible')
          .click()
          .type(`${mac}`, { delay: 50 });
        // Prediction should be visible, 
        // it's also stabilization "hack" for the navbar check as 
        // there might be a tag that is not searchable, 
        // but gives off the same location
        cy.get(elements.sensmap.searchPredictionItem(mac))
          .should('be.visible')
          .click();
        
        // Check that current-building and current-plan changed
        // to locations returned from /feed request
        //
        // This might be flaky based on how quick the location changes.
        // Again, avoidable with controlled data set
        cy.get(elements.sensmap.currentBuilding)
          .should('have.text', data.location.name);
        cy.get(elements.sensmap.currentPlan)
          .should('have.text', data.location.ele);
        
        // ### 3. Check tag position is available via websocket
        cy.subscribeToFeeds(data.id, 1000).then((messages) => {
          expect(messages.length).to.be.greaterThan(0, 'Message count');
          expect(messages[0].body.datastreams.length).to.be.greaterThan(0, 'Datastreams');
          
          const posX = messages[0].body.datastreams.find((ds) => ds.id === 'posX');
          expect(posX.current_value, 'posX').not.be.empty;
          expect(posX.at, 'timestamp').not.be.empty;

          const posY = messages[0].body.datastreams.find((ds) => ds.id === 'posY');
          expect(posY.current_value, 'posY').not.be.empty;
          expect(posY.at, 'timestamp').not.be.empty;

          // Possibly flaky, some tags did not have posZ when checked - assuming bug or deliberate.
          //
          // As per GET /feeds model doc
          // "Tag and anchor have automatically generated three datastreams:
          // posX, posY and posZ which store the anchor’s/tag’s current position."
          //
          // Although not specified for websocket I would expect it to be available if critical.
          const posZ = messages[0].body.datastreams.find((ds) => ds.id === 'posZ');
          expect(posZ.current_value, 'posZ').not.be.empty;
          expect(posZ.at, 'timestamp').not.be.empty;
        });
      });
    });
  });

  [
    // Update as needed (mac or id)
    '0x00205F150CC1',
    '24'
  ].forEach((mac) => {
    // ### Logging only zone changes and duration.
    it(`Log zone changes for ${mac} in past 30s`, () => {
      cy.getFeed(mac).then(({ status, data }) => {

        expect(status, 'Tag should exist').to.not.equal(404);

        cy.subscribeToZones(30000).then((messages) => {
          const zoneDurationSums = messages.reduce((list, message) => {
            if (message.body.feed_id === data.id) {
              const { zone_id, status, duration } = message.body;
              list[zone_id] ??= 0;

              if (status === 'out') {
                list[zone_id] += duration;
              }
            }
            return list;
          }, {});

          cy.getZones().then((zones) => {
            cy.log(`Tag id: ${data.id}, Title: ${data.title}`);
            Object.keys(zoneDurationSums).forEach((zoneId) => {
              const { id, name } = zones.find((zone) => zone.id === zoneId);
              cy.log(`Id: ${id}, Name: ${name}, Duration: ${zoneDurationSums[zoneId]}`);
            });
          });

        });
      });
    });

  });
});
