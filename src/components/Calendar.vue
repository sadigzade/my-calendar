<script>
import "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Calendar",

  components: {
    FullCalendar,
  },

  computed: { ...mapGetters(["EVENTS"]) },

  data() {
    return {
      options: {
        locale: "ru",
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        buttonText: {
          today: "Сегодня",
          month: "Месяц",
          week: "Неделя",
          day: "День",
        },
        select: this.handleDateSelect,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        events: [],
      },
    };
  },

  methods: {
    ...mapActions(["GET_EVENTS_FROM_API"]),
    handleDateSelect(selectInfo) {
      const title = prompt("Пожалуйста, введите новое название для вашего события!");
      // const calendarApi = selectInfo.view.calendar;
      // calendarApi.unselect();
      if (title) {
        this.$store.commit("ADD_EVENT", {
          title,
          start: selectInfo.start,
          end: selectInfo.end,
          allDay: selectInfo.allDay,
        });
      }
    },
    handleEvents() {
      this.options.events = this.EVENTS;
    },
  },

  async created() {
    await this.GET_EVENTS_FROM_API();
  },

  mounted() {
    this.GET_EVENTS_FROM_API().then(this.handleEvents);
  },
};
</script>

<template>
  <div>
    <FullCalendar :options="options" />
  </div>
</template>

<style scoped>
@media screen and (max-width: 960px) {
  ::v-deep(.fc-header-toolbar) {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
