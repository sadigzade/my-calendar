import axios from "axios";
import { createStore } from "vuex";
import { convert } from "../utils/convert";

const store = createStore({
  state: {
    events: [],
  },
  mutations: {
    SET_EVENTS_TO_STATE: (state, events) => {
      state.events = events;
    },
    ADD_EVENT: (state, event) => {
      state.events.push(event);
    },
  },
  actions: {
    async GET_EVENTS_FROM_API({ commit }) {
      try {
        const events = await axios("http://localhost:3001/events", {
          method: "GET",
        });
        const data = events.data.map((event) => {
          return {
            ...event,
            start: convert(event.start),
            end: convert(event.end),
          };
        });
        commit("SET_EVENTS_TO_STATE", data);
        return events;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  getters: {
    EVENTS: (state) => state.events,
  },
});

export default store;
