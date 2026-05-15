import { create } from 'zustand'

const initialDummyEvents = [
  { id: 1, lat: 34.05, lng: -118.24, magnitude: 7.2, type: "Earthquake", title: "M 7.2 - Los Angeles", location: "California, USA" },
  { id: 2, lat: 35.68, lng: 139.69, magnitude: 6.8, type: "Earthquake", title: "M 6.8 - Tokyo", location: "Japan" },
  { id: 3, lat: -33.86, lng: 151.20, magnitude: 5.5, type: "Wildfire", title: "Severe Wildfire - Sydney", location: "Australia" },
  { id: 4, lat: 22.31, lng: 114.16, magnitude: 4.0, type: "Cyclone", title: "Category 4 Cyclone", location: "Hong Kong" },
  { id: 5, lat: 51.50, lng: -0.12, magnitude: 3.5, type: "Flood", title: "Thames Overflow", location: "London, UK" },
  { id: 6, lat: -23.55, lng: -46.63, magnitude: 4.8, type: "Flood", title: "Flash Floods - São Paulo", location: "Brazil" },
  { id: 7, lat: 55.75, lng: 37.61, magnitude: 3.2, type: "Earthquake", title: "M 3.2 Tremor - Moscow", location: "Russia" },
  { id: 8, lat: -1.29, lng: 36.82, magnitude: 4.5, type: "Wildfire", title: "Savannah Fire - Nairobi", location: "Kenya" },
  { id: 9, lat: 48.85, lng: 2.35, magnitude: 2.1, type: "Flood", title: "Seine Overflow - Paris", location: "France" },
  { id: 10, lat: 28.61, lng: 77.20, magnitude: 6.1, type: "Earthquake", title: "M 6.1 - New Delhi", location: "India" },
  { id: 11, lat: 39.07, lng: 21.82, magnitude: 4.2, type: "Wildfire", title: "Forest Fire - Athens", location: "Greece" },
  { id: 12, lat: -3.46, lng: -62.21, magnitude: 5.0, type: "Wildfire", title: "Amazon Rainforest Fire", location: "Brazil" },
  { id: 13, lat: 53.93, lng: -116.57, magnitude: 3.8, type: "Wildfire", title: "Alberta Forest Fire", location: "Canada" },
  { id: 14, lat: 30.06, lng: 79.01, magnitude: 3.0, type: "Wildfire", title: "Uttarakhand Forest Fire", location: "India" }
];

export const useDisasterStore = create(
  (set) => ({
    events: initialDummyEvents,

    activities: [],

    setEvents: (eventsOrUpdater) =>
      set((state) => {
        const newEvents = typeof eventsOrUpdater === 'function' ? eventsOrUpdater(state.events) : eventsOrUpdater;
        // Merge dummy data with real data to ensure we always have something to show
        return { events: newEvents.length > 0 ? newEvents : initialDummyEvents };
      }),

    addActivity: (activity) =>
      set((state) => ({
        activities: [
          activity,
          ...state.activities,
        ],
      })),
  })
)
