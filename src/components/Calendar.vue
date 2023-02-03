<script>
import "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ref } from "vue";
import { useStore } from "vuex";
import { computed, onMounted } from "@vue/runtime-core";

export default {
  components: {
    FullCalendar,
  },

  setup() {
    const store = useStore();
    const events = computed(() => store.getters.getEvents);
    const options = ref({
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
      select: handleDateSelect,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: [],
    });

    function handleDateSelect(selectInfo) {
      const title = prompt("Пожалуйста, введите новое название для вашего события!");

      if (title) {
        store.commit("addEvent", {
          title,
          start: selectInfo.start,
          end: selectInfo.end,
          allDay: selectInfo.allDay,
        });
      }
    }

    function handleEvents() {
      options.value.events = events;
    }

    onMounted(() => {
      store.dispatch("getEventsFromApi").then(handleEvents);
    });

    return {
      options,
    };
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
