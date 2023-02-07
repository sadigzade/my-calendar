import axios from "axios";
import { createStore } from "vuex";
import { convert } from "../utils/convert";

const store = createStore({
  state: {
    events: [],
  },
  mutations: {
    setEventsToState: (state, events) => {
      state.events = events;
    },
    addEvent: (state, event) => {
      state.events.push(event);
    },
    deleteEvent: (state, id) => {
      state.events = state.events.filter((ev) => +ev.id !== +id);
    },
    saveEvent: (state, event) => {
      state.events = state.events.map((ev) => {
        if (+ev.id === +event.id) {
          return event;
        }
        return ev;
      });
    },
  },
  actions: {
    async getEventsFromApi({ commit }) {
      try {
        const events = await axios("http://localhost:3001/data", {
          method: "GET",
        });
        const data = events.data.map((event) => {
          return {
            ...event,
            start: convert(event.start),
            end: convert(event.end),
          };
        });
        commit("setEventsToState", data);
        return events;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  getters: {
    getEvents: (state) => state.events,
  },
});

export default store;
