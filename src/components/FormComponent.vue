<script setup>
import { ref, onMounted } from "vue";
import { vMaska } from "maska/vue";
import photoInput from "../../public/svg/photo.svg";
import deleteIcon from "../../public/svg/delete.svg";

let organizer = ref("");
let phone = ref("");
let email = ref("");
let city = ref("");
let name = ref("");
let description = ref("");
let photoPreview = ref(null);
let dates = ref([
  {
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  },
]);
let rating = ref("16+");
let address = ref("");
const fileInput = ref(null);

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

function addDate() {
  dates.value.push({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
}

function removeDate(index) {
  dates.value.splice(index, 1);
}

function cancel() {
  // ...
}

function submit() {
  // ...
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
          />
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
          />
        </div>
        <div class="form__container">
          <label class="form__label" for="email">E-mail</label>
          <input
            class="form__input"
            type="email"
            id="email"
            v-model="email"
            placeholder="example@mail.com"
          />
        </div>
        <div class="form__container">
          <label class="form__label" for="city">Город организатора</label>
          <input
            class="form__input"
            type="text"
            id="city"
            v-model="city"
            placeholder="Казань"
          />
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
          />
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
          ></textarea>
        </div>
      </div>

      <div class="form__date">
        <div class="form__group">
          <div class="form__container">
            <label class="form__label" for="startDate">Дата начала:</label>
            <input
              class="form__input form__input_date"
              type="date"
              id="startDate"
              v-model="startDate"
            />
          </div>

          <div class="form__container">
            <label class="form__label" for="startTime">Время начала:</label>
            <input
              class="form__input"
              type="time"
              id="startTime"
              v-maska:"'##.##'"
              v-model="startTime"
            />
          </div>
          <span class="form__separator"></span>
          <div class="form__container">
            <label class="form__label" for="endDate">Дата окончания:</label>
            <input
              class="form__input"
              type="date"
              id="endDate"
              v-model="endDate"
            />
          </div>
          <div class="form__container">
            <label class="form__label" for="endTime">Время окончания:</label>
            <input
              class="form__input"
              type="time"
              id="endTime"
              v-model="endTime"
            />
          </div>
        </div>
      </div>
      <button @click="addDate">Добавить дату</button>

      <h3>Рейтинг мероприятия</h3>
      <select v-model="rating">
        <option value="16+">16+</option>
        <option value="18+">18+</option>
      </select>

      <h3>Адрес мероприятия</h3>
      <input type="text" v-model="address" />

      <button @click="cancel">Отменить</button>
      <button @click="submit">Далее</button>
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
        background: transparent url(../../public/svg/calendar.svg) 95% 50%
          no-repeat !important;
      }
    }
  }
}
</style>
