<script setup>
import { ref, onMounted, computed } from "vue";
import alertIcon from "../../public/svg/alert.svg";
import calendarIcon from "../../public/svg/calendar.svg";
import clockIcon from "../../public/svg/clock.svg";
import geoIcon from "../../public/svg/geo.svg";
import mailIcon from "../../public/svg/mail.svg";
import phoneIcon from "../../public/svg/phone.svg";

let organizer = ref("");
let phone = ref("");
let email = ref("");
let city = ref("");
let address = ref("");
let name = ref("");
let selectedRating = ref("");
let description = ref("");
let photoPreview = ref(null);
let dates = ref([]);

onMounted(() => {
  getData();
});

function getData() {
  const refs = {
    organizer,
    phone,
    email,
    city,
    name,
    description,
    selectedRating,
    photoPreview,
    address,
    dates,
  };

  Object.keys(refs).forEach((key) => {
    const storedValue = localStorage.getItem(key);
    if (key === "dates") {
      refs[key].value = storedValue ? JSON.parse(storedValue) : [];
    } else {
      refs[key].value = storedValue;
    }
  });
}
const formattedStartTime = computed(() => {
  if (Array.isArray(dates.value)) {
    return dates.value
      .map((date) => {
        const startTime = date.startTime;
        const hours = startTime.split(":")[0];
        const minutes = startTime.split(":")[1];

        return `${hours}:${minutes}`;
      })
      .join(", ");
  } else {
    return "";
  }
});
const formattedStartDates = computed(() => {
  return dates.value
    .map((date) => {
      const startDate = new Date(date.startDate);
      const day = startDate.getDate();
      const month = startDate.toLocaleString("ru", { month: "long" });
      const year = startDate.getFullYear();
      const dayOfWeek = startDate.toLocaleString("ru", { weekday: "short" });

      return `${day} ${month} ${year} (${dayOfWeek})`;
    })
    .join(", ");
});
</script>
<template>
  <div class="container">
    <h1 class="page__title">Шаг 2</h1>
    <div class="inner__container">
      <div class="preview__message">
        <img :src="alertIcon" alt="Внимание" class="preview__alert" />
        Проверьте ваше мероприятие на наличие ошибок, если все в порядке -
        отправляйте на модерацию.
      </div>
      <div class="preview__top">
        <div class="preview__rating">{{ selectedRating }}</div>
        <div class="preview__info">
          <h1 class="preview__title">
            {{ name }}
          </h1>
          <div class="preview__block">
            <div class="preview__address">
              <img :src="geoIcon" alt="геопозиция" />
              {{ address }}
            </div>
            <div class="preview__dates">
              <img :src="calendarIcon" alt="date" />
              {{ formattedStartDates }}
            </div>
            <div class="preview__time">
              <img :src="clockIcon" alt="геопозиция" />
              {{ formattedStartTime }}
            </div>
          </div>
          <div class="preview__contacts">
            <h3 class="preview__title-contacts">Контакты</h3>
            <div class="preview__phone">
              <img :src="phoneIcon" alt="геопозиция" />
              {{ phone }}
            </div>
            <div class="preview__email">
              <img :src="mailIcon" alt="геопозиция" />
              {{ email }}
            </div>
          </div>
          <div class="preview__organizer">
            {{ organizer }}
            <span class="preview__organizer_subtitle"
              >Организатор мероприятия</span
            >
          </div>
        </div>
        <div class="preview__photo">
          <img
            class="preview__photo"
            :src="photoPreview"
            alt="Обложка мероприятия"
          />
        </div>
      </div>
      <div class="preview__description">{{ description }}</div>
      <div class="preview__controls">
        <RouterLink to="/" class="form__button"> Назад </RouterLink>
        <button
          class="form__button form__button_submit"
          @click.prevent="submit"
        >
          Отправить на модерацию
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "../style/variables.scss";
.preview {
  &__controls {
    display: flex;
    gap: 20px;
  }

  &__photo {
    img {
      max-width: 630px;
      max-height: 420px;
      width: auto;
      height: auto;
      margin: auto;
    }
  }

  &__description {
    font-size: $fs-m;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
    margin-bottom: 50px;
  }

  &__message {
    display: flex;
    align-items: center;
    box-shadow: 0px 8px 25px 0px rgba(155, 99, 248, 0.15);
    border-radius: $border-radius;
    padding: 20px 25px;
    font-weight: 600;
    font-size: $fs-l;
    margin-bottom: 69px;
  }

  &__block {
    display: flex;
    flex-direction: column;
    gap: 14px;
    color: $primary;
    font-size: $fs-l;
    font-weight: 400;
    margin-bottom: 23px;
  }

  &__title-contacts {
    font-size: $fs-m;
    font-weight: 600;
    margin-bottom: 13px;
  }

  &__info {
    flex: 1;
  }

  &__alert {
    margin-right: 21px;
  }

  &__top {
    display: flex;
    gap: 16px;
  }
  &__contacts {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
    gap: 12px;
  }

  &__organizer {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: $fs-m;
    font-weight: 400;

    &_subtitle {
      color: #8e69cc;
      font-size: $fs-xs;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    width: 48px;
    height: 48px;
    padding: 0 14px;
    font-weight: 600;
    font-size: $fs-l;
    background-color: $primary;
    color: $white;
  }

  &__title {
    margin-bottom: 32px;
    font-size: $fs-xl;
    font-weight: 800;
    color: $primary;
    line-height: 39.01px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
