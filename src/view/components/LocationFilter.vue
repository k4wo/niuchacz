<template>
    <div class="filter">
      <button @click="togglePopup">Filtruj po Lokalizacji</button>
      <div class="popup" v-if="isPopupActive">
        <div class="list">
          <label 
            v-for="location in locations"
            :key="location">
            <input type="checkbox" v-bind:value="location" v-model="selected" />
            {{location}}
            </label>
        </div>
        <button @click="saveFilter">Filtruj</button>
      </div>
      <div class="resetIcon">
        <div @click="resetFilter" v-if="!!selected.length">
          <Icon name="remove"></Icon>
        </div>
      </div>
    </div>
</template>

<script>
import "vue-awesome/icons/remove";
import Icon from "vue-awesome/components/Icon";

export default {
  props: {
    onSave: Function,
    locations: Array
  },
  data() {
    return {
      isPopupActive: false,
      selected: []
    };
  },
  methods: {
    togglePopup() {
      this.isPopupActive = !this.isPopupActive;
    },
    resetFilter() {
      this.isPopupActive = false;
      this.selected = [];
      this.onSave(this.selected);
    },
    saveFilter() {
      this.isPopupActive = false;
      this.onSave(this.selected);
    }
  },
  components: {
    Icon
  }
};
</script>

<style scoped>
.filter {
  display: flex;
  align-items: center;
  position: relative;
}
.popup {
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: stretch;
  align-content: space-around;

  left: -50px;
  top: 40px;
  width: 200px;
  height: 300px;

  z-index: 1;
  padding: 10px;

  border: 1px solid rgb(224, 224, 224);
  background: linear-gradient(to bottom, #ffffff 0%, #f3f3f3 50%, #ededed 100%);
  box-shadow: 0 0 5px rgb(224, 224, 224);
  box-sizing: border-box;
  color: #2c3e50;
}
.list {
  display: flex;
  flex-flow: column;
  overflow: auto;
  text-transform: capitalize;
  height: 95%;
}
button,
label {
  cursor: pointer;
}
.resetIcon {
  width: 13px;
  height: 16px;
  margin-left: 5px;
}
.resetIcon > div {
  cursor: pointer;
}
.popup button {
  padding: 7px 20px;
  background: #41b984;
  border: none;
  border-radius: 5px;
  outline: none;
  margin-top: 10px; 
}
.popup button:hover {
  background: #46a573;
}
</style>
