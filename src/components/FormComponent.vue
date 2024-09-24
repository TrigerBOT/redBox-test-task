<script setup>
import { ref, onMounted } from "vue";
import { vMaska } from "maska/vue";
import { apiUrl } from "../utils/api";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf  } from "@vuelidate/validators";
import photoInput from "../../public/svg/photo.svg";
import deleteIcon from "../../public/svg/delete.svg";
import DateComponent from "./DateComponent.vue";

let data = ref({});
let organizer = ref("");
let phone = ref("");
let email = ref("");
let city = ref("");

let name = ref("");
let description = ref("");
let photoPreview = ref(null);
let dates = ref([]);
let date = ref({
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
});
let rating = ref("+16");
let ratings = ref([]);
let address = ref("");
const fileInput = ref(null);

const arrayMinLength = (min) => {
  return (value) => {
    if (!Array.isArray(value) || value.length === 0) {
      return false;
    }
    return value.length >= min;
  };
};

const rules = {
  organizer: { required },
  phone: { required },
  email: { required },
  city: { required },
  name: { required },
  dates: {
    required: requiredIf(() => dates.value.length > 0),
    arrayMinLength: arrayMinLength(1),
    $each: {
      startDate: { required },
      startTime: { required },
      endDate: { required },
      endTime: { required },
    },
  },
  description: { required },
  address: { required },
  rating: { required },
};

const v$ = useVuelidate(rules, {
  organizer,
  phone,
  email,
  city,
  name,
  description,
  dates,
  address,
  rating,
});

function getData() {
  data.organizer = localStorage.getItem("organizer");
  data.phone = localStorage.getItem("phone");
  data.email = localStorage.getItem("email");
  data.city = localStorage.getItem("city");
  data.name = localStorage.getItem("name");
  data.description = localStorage.getItem("description");
  data.rating = localStorage.getItem("rating");
  data.address = localStorage.getItem("address");
  data.dates = localStorage.getItem("dates")
    ? JSON.parse(localStorage.getItem("dates"))
    : [];

  if (data.organizer) {
    organizer.value = data.organizer;
  }
  if (data.phone) {
    phone.value = data.phone;
  }
  if (data.email) {
    email.value = data.email;
  }
  if (data.city) {
    city.value = data.city;
  }
  if (data.name) {
    name.value = data.name;
  }
  if (data.description) {
    description.value = data.description;
  }
  if (data.rating) {
    rating.value = data.rating;
  }
  if (data.address) {
    address.value = data.address;
  }
  if (data.dates) {
    dates.value = data.dates;
  }
}
onMounted(() => {
  getData();
});

function triggerFileInput() {
  fileInput.value.click();
}
function handlePhotoChange(event) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}

function deletePhoto() {
  photoPreview.value = null;
}

function saveData() {
  localStorage.setItem("organizer", organizer.value);
  localStorage.setItem("phone", phone.value);
  localStorage.setItem("email", email.value);
  localStorage.setItem("city", city.value);
  localStorage.setItem("name", name.value);
  localStorage.setItem("description", description.value);
  localStorage.setItem("rating", rating.value);
  localStorage.setItem("address", address.value);
  localStorage.setItem("dates", JSON.stringify(dates.value));
}

function addDate() {
  if (
    date.value.startDate &&
    date.value.startTime &&
    date.value.endDate &&
    date.value.endTime
  ) {
    const newIndex = dates.value.length;
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
    alert("Пожалуйста, заполните все поля даты");
  }
}

function removeDate(index) {
  dates.value.splice(index, 1);
  saveData();
}

function cancel() {
  organizer.value = "";
  phone.value = "";
  email.value = "";
  city.value = "";
  name.value = "";
  description.value = "";
  photoPreview.value = null;
  date.value = [
    {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  ];
  rating.value = "16+";
  address.value = "";
  fileInput.value = null;
  saveData();
}

function submit() {
  const isFormValid = v$.value.$validate();
  if (!isFormValid) {
    alert("Пожалуйста, заполните все поля формы");
    return;
  }
  console.log(data);

  saveData();
}
</script>
<template>
  <div class="container">
    <h1 class="page__title">Шаг 1</h1>

    <form class="organizer-form">
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
            :class="{ 'is-invalid': v$.organizer.$error }"
          />
          <div v-if="v$.organizer.$error" class="invalid-feedback">
            Пожалуйста, введите корректное название компании
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
            :class="{ 'is-invalid': v$.phone.$error }"
          />
          <div v-if="v$.phone.$error" class="invalid-feedback">
            Пожалуйста, введите корректный номер телефона
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
            :class="{ 'is-invalid': v$.email.$error }"
          />
          <div v-if="v$.email.$error" class="invalid-feedback">
            Пожалуйста, введите корректный адрес электронной почты
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
            :class="{ 'is-invalid': v$.city.$error }"
          />
          <div v-if="v$.city.$error" class="invalid-feedback">
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
            :class="{ 'is-invalid': v$.name.$error }"
          />
          <div v-if="v$.name.$error" class="invalid-feedback">
            Пожалуйста, введите корректное название
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
            :class="{ 'is-invalid': v$.description.$error }"
          ></textarea>
          <div v-if="v$.description.$error" class="invalid-feedback">
            Пожалуйста, введите корректное описание
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
            />
          </div>

          <div class="form__container">
            <label class="form__label" for="startTime">Время начала:</label>
            <input
              class="form__input"
              type="time"
              id="startTime"
              v-model="date.startTime"
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
            />
          </div>
          <div class="form__container">
            <label class="form__label" for="endTime">Время окончания:</label>
            <input
              class="form__input"
              type="time"
              id="endTime"
              v-model="date.endTime"
            />
          </div>
        </div>
      </div>
      <button @click.prevent="addDate" class="btn">+ Добавить дату</button>

      <div class="form__group">
        <div class="form__container">
          <label for="rating" class="form__label">Рейтинг мероприятия</label>
          <select
            class="form__input"
            id="rating"
            v-model="rating"
            :class="{ 'is-invalid': v$.rating.$error }"
          >
            <option value="+16">+16</option>
            <option value="+18">+18</option>
          </select>
          <div v-if="v$.rating.$error" class="invalid-feedback">
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
            Пожалуйста, введите корректный адрес
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
}
.btn_delete {
  position: absolute;
  width: 30px;
  height: 30px;
  top: -15px;
  right: -15px;
  cursor: pointer;
}
.organizer-form {
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
.form {
  &__controls {
    display: flex;
    gap: 20px;
  }
  &__button {
    font-weight: 600;
    font-size: $fs-m;
    background-color: transparent;
    min-width: 285px;
    padding: 19px;
    border: 1px solid $secondary;
    border-radius: $border-radius;
    line-height: 19.5px;

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
