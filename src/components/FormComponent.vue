<script setup>
import { ref, onMounted } from "vue";
import { vMaska } from "maska/vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import photoInput from "../../public/svg/photo.svg";
import deleteIcon from "../../public/svg/delete.svg";
import DateComponent from "./DateComponent.vue";
import basicAuth from "../utils/constants";

//Данные инпутов
let organizer = ref("");
let phone = ref("");
let email = ref("");
let city = ref("");
let address = ref("");
let name = ref("");
let selectedRating = ref("");
let description = ref("");
let photoPreview = ref(null);
let date = ref({
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
});
let ratingOptions = ref([]);
let fileInput = ref(null);
//сохраненные даты
let dates = ref([]);

// Validation и правила
const rules = {
  organizer: { required },
  phone: { required },
  email: { required },
  city: { required },
  name: { required },
  photoPreview: { required },
  description: { required },
  dates: { required },
  selectedRating: { required },
  address: { required },
};

const v$ = useVuelidate(rules, {
  organizer,
  phone,
  email,
  city,
  name,
  description,
  photoPreview,
  dates,
  address,
  selectedRating,
});

//Получание данных с сервера при загрузке
onMounted(() => {
  getData();
  fetchRatingOptions().then((options) => {
    ratingOptions.value = options.data;
  });
});

async function fetchRatingOptions() {
  try {
    const response = await fetch("api/", {
      headers: {
        Authorization: basicAuth,
      },
    });
    const options = await response.json();
    return options;
  } catch (error) {
    console.error(error);
  }
}

//Работа с фото
function triggerFileInput() {
  fileInput.value.click();
}
function handlePhotoChange(event) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
      saveData();
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}

function deletePhoto() {
  photoPreview.value = null;
  saveData();
}

// Работа с локал сторадж
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

  const dataKeys = Object.keys(refs);
  dataKeys.forEach((key) => {
    const storedValue = localStorage.getItem(key);
    let defaultValue;

    if (key === "dates") {
      defaultValue = [];
    } else if (key === "photoPreview") {
      defaultValue = null;
    } else {
      defaultValue = "";
    }

    refs[key].value =
      storedValue === "null"
        ? defaultValue
        : key === "dates"
          ? JSON.parse(storedValue)
          : storedValue;
  });
}

function saveData() {
  const dataToSave = {
    organizer: organizer.value,
    phone: phone.value,
    email: email.value,
    city: city.value,
    name: name.value,
    description: description.value,
    photoPreview: photoPreview.value,
    selectedRating: selectedRating.value,
    address: address.value,
    dates: JSON.stringify(dates.value),
  };

  Object.keys(dataToSave).forEach((key) => {
    localStorage.setItem(key, dataToSave[key]);
  });
}

// Работа с датами мероприятий
function addDate() {
  if (
    date.value.startDate &&
    date.value.startTime &&
    date.value.endDate &&
    date.value.endTime
  ) {
    const newIndex = dates.value.length;
    const startDate = new Date(
      date.value.startDate + "T" + date.value.startTime
    );
    const endDate = new Date(date.value.endDate + "T" + date.value.endTime);
    if (startDate < endDate) {
      dates.value.push({
        startDate: date.value.startDate,
        startTime: date.value.startTime,
        endDate: date.value.endDate,
        endTime: date.value.endTime,
        index: newIndex,
      });
      date.value = {
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
      };
      saveData();
    } else {
      alert("Дата начала должна быть раньше даты окончания");
    }
  } else {
    alert("Пожалуйста, заполните все поля даты");
  }
}

function removeDate(index) {
  dates.value.splice(index, 1);
  saveData();
}

//Controls формы
function cancel() {
  organizer.value = "";
  phone.value = "";
  email.value = "";
  city.value = "";
  name.value = "";
  description.value = null;
  photoPreview.value = null;
  address.value = "";
  dates.value = [];
  date.value = {
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  };
  selectedRating.value = "";
  saveData();
}

function submit() {

  v$.value.$reset();
  v$.value.$validate().then((isFormValid) => {
    if (!isFormValid) {
      alert("Пожалуйста, заполните все поля формы");
      return;
    }
    saveData();
    window.location.href = '/preview';
  });
}
</script>
<template>
  <div class="container">
    <h1 class="page__title">Шаг 1</h1>

    <form class="inner__container organizer-form">
      <h2 class="form__title">Информация об организаторе</h2>
      <div class="form__group">
        <div class="form__container">
          <label class="form__label" for="organizer">Организатор</label>
          <input
            class="form__input"
            type="text"
            id="organizer"
            v-model="organizer"
            placeholder="Название компании"
            :class="{
              'is-invalid': v$.organizer.$error && !organizer,
            }"
          />
          <div
            v-if="v$.organizer.$error && !organizer"
            class="invalid-feedback"
          >
            Пожалуйста, введите название компании
          </div>
        </div>
      </div>

      <h2 class="form__title">Контактные данные</h2>
      <div class="form__group">
        <div class="form__container">
          <label class="form__label" for="phone">Телефон</label>
          <input
            class="form__input"
            type="text"
            id="phone"
            v-model="phone"
            ref="phoneInput"
            v-maska="'+# (###) ###-##-##'"
            placeholder="+7 (999) 999-99-99"
            :class="{ 'is-invalid': v$.phone.$error && !phone }"
          />
          <div v-if="v$.phone.$error && !phone" class="invalid-feedback">
            Пожалуйста, введите номер телефона
          </div>
        </div>
        <div class="form__container">
          <label class="form__label" for="email">E-mail</label>
          <input
            class="form__input"
            type="email"
            id="email"
            v-model="email"
            placeholder="example@mail.com"
            :class="{ 'is-invalid': v$.email.$error && !email }"
          />
          <div v-if="v$.email.$error && !email" class="invalid-feedback">
            Пожалуйста, введите адрес электронной почты
          </div>
        </div>
        <div class="form__container">
          <label class="form__label" for="city">Город организатора</label>
          <input
            class="form__input"
            type="text"
            id="city"
            v-model="city"
            placeholder="Казань"
            :class="{ 'is-invalid': v$.city.$error && !city }"
          />
          <div v-if="v$.city.$error && !city" class="invalid-feedback">
            Пожалуйста, введите корректный город
          </div>
        </div>
      </div>

      <h2 class="form__title">Общая информация</h2>
      <div class="form__group">
        <div class="form__container">
          <label class="form__label" for="name">Название</label>
          <input
            class="form__input"
            placeholder="Название мероприятия"
            type="text"
            id="name"
            v-model="name"
            :class="{ 'is-invalid': v$.name.$error && !name }"
          />
          <div v-if="v$.name.$error && !name" class="invalid-feedback">
            Пожалуйста, введите название мероприятия
          </div>
        </div>
      </div>
      <div class="form__group form__group_photo">
        <div class="form__container form__container_photo">
          <label class="form__label" for="photo">Фотография</label>
          <img
            :src="photoInput"
            class="form__photo form__photo_select"
            alt="Выбрать изображение"
            @click="triggerFileInput"
          />
          <input
            accept="image/*"
            class="hidden"
            ref="fileInput"
            type="file"
            @change="handlePhotoChange"
          />
          <p class="form__info">Главная фотография (обложка мероприятия)</p>
          <div
            v-if="v$.photoPreview.$error && !photoPreview"
            class="invalid-feedback"
          >
            Пожалуйста, загрузите обложку мероприятия
          </div>
        </div>
        <div v-if="photoPreview" class="form__container form__container_photo">
          <img
            :src="deleteIcon"
            alt="Удалить изображение"
            @click="deletePhoto"
            class="btn_delete"
          />
          <img
            :src="photoPreview"
            class="form__photo"
            alt="Выбранное изображение"
          />
          <p class="form__info">Главная фотография (обложка мероприятия)</p>
        </div>
      </div>
      <div class="form__group">
        <div class="form__container">
          <label class="form__label">Подробное описание</label>
          <textarea
            v-model="description"
            placeholder="Подробное описание"
            class="form__input form__input_textarea"
            :class="{
              'is-invalid': v$.description.$error && !description,
            }"
          ></textarea>
          <div
            v-if="v$.description.$error && !description"
            class="invalid-feedback"
          >
            Пожалуйста, введите описание
          </div>
        </div>
      </div>

      <DateComponent
        v-for="(date, index) in dates"
        :key="index"
        :date="date"
        @deleteDate="removeDate"
      />
      <div class="form__date">
        <div class="form__group">
          <div class="form__container">
            <label class="form__label" for="startDate">Дата начала:</label>
            <input
              class="form__input form__input_date"
              type="date"
              id="startDate"
              v-model="date.startDate"
              :class="{
                'is-invalid': v$.dates.$error && !dates.length,
              }"
            />
          </div>

          <div class="form__container">
            <label class="form__label" for="startTime">Время начала:</label>
            <input
              class="form__input"
              type="time"
              id="startTime"
              v-model="date.startTime"
              :class="{
                'is-invalid': v$.dates.$error && !dates.length,
              }"
            />
          </div>
          <span class="form__separator"></span>
          <div class="form__container">
            <label class="form__label" for="endDate">Дата окончания:</label>
            <input
              class="form__input form__input_date"
              type="date"
              id="endDate"
              v-model="date.endDate"
              :class="{
                'is-invalid': v$.dates.$error && !dates.length,
              }"
            />
          </div>
          <div class="form__container">
            <label class="form__label" for="endTime">Время окончания:</label>
            <input
              class="form__input"
              type="time"
              id="endTime"
              v-model="date.endTime"
              :class="{
                'is-invalid': v$.dates.$error && !dates.length,
              }"
            />
          </div>
        </div>
      </div>

      <button @click.prevent="addDate" class="btn">+ Добавить дату</button>

      <div class="form__group">
        <div class="form__container">
          <label for="ratings" class="form__label">Рейтинг мероприятия</label>
          <select
            v-model="selectedRating"
            class="form__input"
            id="ratings"
            :class="{ 'is-invalid': v$.selectedRating.$error }"
          >
            <option
              v-for="option in ratingOptions"
              :key="option.id"
              :value="option.title"
            >
              {{ option.title }}
            </option>
          </select>
          <div v-if="v$.selectedRating.$error" class="invalid-feedback">
            Пожалуйста, выберите возрастное ограничение
          </div>
        </div>
        <div class="form__container">
          <label class="form__label">Адрес мероприятия</label>
          <input
            class="form__input"
            type="text"
            v-model="address"
            id="address"
            :class="{ 'is-invalid': v$.address.$error }"
          />
          <div v-if="v$.address.$error" class="invalid-feedback">
            Пожалуйста, введите адрес
          </div>
        </div>
      </div>
      <div class="form__controls">
        <button class="form__button" @click.prevent="cancel">Отменить</button>
        <button
          class="form__button form__button_submit"
          @click.prevent="submit"
        >
          Далее
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: "Montserrat";
  src: url("..../public/fonts/Montserrat-Regular.ttf");
}
@import "../style/variables.scss";

.hidden {
  display: none;
}
.btn {
  background-color: transparent;
  border: 1px solid $secondary;
  border-radius: $border-radius;
  font-weight: 600;
  font-size: $fs-m;
  padding: 19px 21px;
  margin-bottom: 50px;
  text-decoration: none;
}
.btn_delete {
  position: absolute;
  width: 30px;
  height: 30px;
  top: -15px;
  right: -15px;
  cursor: pointer;
}
.inner__container {
  background-color: #fff;
  padding: 40px 30px;
  color: $dark-purple;
}
.page__title {
  font-size: $fs-xxl;
  color: $primary;
  font-weight: 800;
  padding-top: 100px;
  margin-bottom: 50px;
}

.invalid-feedback {
  margin-top: 4px;
  font-size: $fs-xs;
  color: red;
}
.is-invalid {
  border-color: red !important;
}
.form {
  &__controls {
    display: flex;
    gap: 20px;
  }
  &__button {
    display: inline-block;
    text-align: center;
    text-decoration: none;
    font-weight: 600;
    font-size: $fs-m;
    background-color: transparent;
    min-width: 285px;
    padding: 19px;
    border: 1px solid $secondary;
    border-radius: $border-radius;
    line-height: 19.5px;
    cursor: pointer;

    &_submit {
      background-color: #9b63f8;
      color: #fff;
    }
  }

  &__group {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 40px;
    gap: 20px;
    align-items: center;

    &_photo {
      justify-content: flex-start;
      align-items: end;
      gap: 10px;
    }
  }

  &__date {
    display: flex;
  }
  &__info {
    font-size: $fs-xs;
    font-weight: 400;
    line-height: 14px;
  }

  &__photo {
    max-width: 126px;
    max-height: 126px;

    margin-bottom: 10px;

    &_select {
      cursor: pointer;
    }
  }
  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;

    &_photo {
      position: relative;
      max-width: 126px;
      text-align: left;
    }
  }

  &__title:first-child {
    margin-bottom: 40px;
  }

  &__title {
    font-size: $fs-l;
    color: $dark-purple;
    font-weight: 600;
    line-height: 21.94px;
    margin-bottom: 30px;
  }

  &__label {
    font-size: $fs-m;
    font-weight: 600;
    line-height: 19.5px;
    text-align: left;
    margin-bottom: 10px;
  }

  &__separator {
    border-top: 1px solid $secondary;
    min-width: 55px;
    margin: 19.95px -5px 0;
  }

  &__input {
    border-radius: $border-radius;
    border: 1px solid $secondary;
    padding: 17.95px 25px 19.95px;
    font-size: $fs-m;
    font-weight: 400;
    line-height: 19.5px;
    text-align: left;

    &:focus,
    &:focus-visible {
      border: 1px solid $primary;
      outline: none;
    }

    &_textarea {
      width: 100%;
      height: 193px;
      resize: none;
    }

    &_date {
      padding: 19px;
      &::-webkit-inner-spin-button {
        display: none;
      }
      &::-webkit-calendar-picker-indicator {
        opacity: 0;
      }
      &[type="date"] {
        background: #fff url(../../public/svg/calendar.svg) 95% 50% no-repeat !important;
      }
    }
  }
}
</style>
