export const routes = {
  api: {
    base: () => `${Cypress.env('baseUrl')}/sensmapserver/api`,

    feeds: () => `${routes.api.base()}/feeds`,
    feed: (mac: string) => `${routes.api.feeds()}/${mac}`,

    zones: () => `${routes.api.base()}/zones`,
  },
  wss: {
    base: () => Cypress.env('wssUrl'),
  },
  ui: {
    base: () => Cypress.env('baseUrl'),

    sensmap: () => `${routes.ui.base()}/sensmap`
  }
};

export const wsResources = {
  feeds: '/feeds',
  feed: (id: string) => `${wsResources.feeds}/${id}`,

  zones: '/zones/'
};

export const elements = {
  login: {
    button: 'button[type=submit]'
  },
  general: {
    loadingCircle: 'div[class=sewio-loading-circle]',
  },
  sensmap: {
    currentBuilding: 'a[id=current-building]',
    currentPlan: 'a[id=current-plan]',
    search: 'input[id=feed-quick-search-input]',
    searchPredictionItem: (value: string) => `ul[id=feedQuickSearchMatchList] li[data-value=f${value}]`
  }
};
