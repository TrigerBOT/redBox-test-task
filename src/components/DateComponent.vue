<script setup>
import deleteIcon from "../../public/svg/delete.svg";
defineProps({
  date: {
    type: Object,
    required: true,
  },
});

defineEmits(["deleteDate"]);
</script>

<template>
  <div class="form__date form__date_readonly">
    <div class="form__group form__group_mn">
      <div class="form__container">
        <label class="form__label" for="startDate">Дата начала:</label>
        <input
          class="form__input form__input_date"
          type="date"
          id="startDate"
          :value="date.startDate"
          readonly
        />
      </div>

      <div class="form__container">
        <label class="form__label" for="startTime">Время начала:</label>
        <input
          class="form__input"
          type="time"
          id="startTime"
          :value="date.startTime"
          readonly
        />
      </div>
      <span class="form__separator"></span>
      <div class="form__container">
        <label class="form__label" for="endDate">Дата окончания:</label>
        <input
          class="form__input form__input_date"
          type="date"
          id="endDate"
          :value="date.endDate"
          readonly
        />
      </div>
      <div class="form__container">
        <label class="form__label" for="endTime">Время окончания:</label>
        <input
          class="form__input"
          type="time"
          id="endTime"
          :value="date.endTime"
          readonly
        />
      </div>
      <img :src="deleteIcon" @click="$emit('deleteDate', date.index)" class="date__delete">

    </div>
  </div>
</template>



<style lang="scss">
@import "../style/variables.scss";

.form__group_mn{
    margin-bottom: 0 !important;
}
.date__delete {
    position: absolute;
    top: -15px;
    right: -15px;
}
.form__date_readonly{
    position: relative;
    background-color: #FAF7FE;
    padding: 22px 28px;
    margin-bottom: 40px;
    border-radius: $border-radius;
}
</style>
