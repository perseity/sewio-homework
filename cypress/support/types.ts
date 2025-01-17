export type Result<T> = {
  status: number,
  data: T
}

export type FeedData = {
  id: string,
  title: string,
  type: string,
  location: {
    name: string,
    ele: string
  }
}

export type PositionEvent = {
  body: {
    id: string,
    uuid: string,
    datastreams: Array<{
      id: string,
      current_value: string,
      at: Date
    }>,
  },
  resource: string
}

export type ZoneEvent = {
  body: {
    feed_id: string;
    zone_id: string;
    status: string;
    at: Date;
    duration: number;
  },
  resource: string;
}

export type ZoneData = {
  id: string,
  name: string,
  plan_name: string,
}
