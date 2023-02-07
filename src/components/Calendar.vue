<script>
import "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ref } from "vue";
import { useStore } from "vuex";
import { computed, onMounted } from "@vue/runtime-core";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { convert } from "../utils/convert";

export default {
  name: "Calendar",
  components: {
    FullCalendar,
  },
  setup() {
    const store = useStore();
    const events = computed(() => store.getters.getEvents);
    const display = ref(false);
    const modalEvent = ref({
      id: null,
      title: "",
      start: "",
      end: "",
      allDay: null,
    });
    const submitted = ref(false);
    const showMessage = ref(false);
    const rules = {
      title: { required },
      start: { required },
      end: { required },
    };
    const v$ = useVuelidate(rules, modalEvent);
    const handleSubmit = (isFormValid) => {
      submitted.value = true;

      if (!isFormValid) {
        return;
      }

      toggleDialog();
    };
    const toggleDialog = () => {
      display.value = !display.value;

      if (modalEvent.value.id) {
        store.commit("saveEvent", modalEvent.value);
      } else {
        store.commit("addEvent", {
          ...modalEvent.value,
          id: new Date().getTime(),
        });
      }

      if (!display.value) {
        submitted.value = false;
      }
    };

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
      eventClick: handleEventClick,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: [],
    });

    function handleEventClick(info) {
      modalEvent.value = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.startStr,
        end: info.event.endStr,
        allDay: info.event.allDay,
      };
      console.log(modalEvent.value);
    }

    function handleDateSelect(selectInfo) {
      if (!display.value) {
        display.value = true;
        modalEvent.value = {
          start: convert(selectInfo.start),
          end: convert(selectInfo.end),
        };
      }
    }

    function handleEvents() {
      options.value.events = events;
    }

    function handleClick() {
      display.value = !display.value;
    }

    function deleteEvent() {
      display.value = false;
      store.commit("deleteEvent", modalEvent.value.id);
    }

    function editTitleEvent(event) {
      modalEvent.value = {
        ...modalEvent.value,
        title: event.target.value,
      };
    }

    function editStartEvent(event) {
      modalEvent.value = {
        ...modalEvent.value,
        start: event.target.value,
      };
    }

    function editEndEvent(event) {
      modalEvent.value = {
        ...modalEvent.value,
        end: event.target.value,
      };
    }

    function saveEvent() {
      if (modalEvent.value.id) {
        store.commit("saveEvent", modalEvent.value);
      } else {
        store.commit("addEvent", {
          ...modalEvent.value,
          id: new Date().getTime(),
        });
      }
      display.value = false;
    }

    onMounted(() => {
      store.dispatch("getEventsFromApi").then(handleEvents);
    });

    return {
      options,
      display,
      handleClick,
      modalEvent,
      deleteEvent,
      editTitleEvent,
      editStartEvent,
      editEndEvent,
      saveEvent,
      v$,
      handleSubmit,
      toggleDialog,
      submitted,
      showMessage,
    };
  },
};
</script>

<template>
  <div>
    <FullCalendar :options="options">
      <template v-slot:eventContent="arg">
        <div @click="handleClick">
          <b>{{ arg.event.title }}</b>
        </div>
      </template>
    </FullCalendar>

    <Dialog
      header="Настройки события"
      v-model:visible="display"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
    >
      <form @submit.prevent="handleSubmit(!v$.$invalid)" class="form p-fluid">
        <div class="formContent">
          <div class="field">
            <div class="eventBlockItem">
              <h5>Название</h5>
              <InputText type="text" v-model="modalEvent.title" @input="editTitleEvent" />
            </div>
            <small
              v-if="(v$.title.$invalid && submitted) || v$.title.$pending.$response"
              class="p-error"
              >{{ v$.title.required.$message.replace("Value", "Title") }}</small
            >
          </div>
          <div class="eventBlockItem">
            <h5>Начало</h5>
            <InputText type="date" v-model="modalEvent.start" @input="editStartEvent" />
          </div>
          <div class="eventBlockItem">
            <h5>Конец</h5>
            <InputText type="date" v-model="modalEvent.end" @input="editEndEvent" />
          </div>
        </div>
        <div class="formFooter">
          <Button label="Удалить" icon="pi pi-times" @click="deleteEvent" class="p-button-text" />
          <Button type="submit" label="Сохранить" class="mt-2" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<style scoped>
.eventBlockItem {
  margin-bottom: 20px;
}
.formFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.formFooter button {
  width: auto;
}
</style>
