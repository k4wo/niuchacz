<template>
    <div class="filter">
      <button @click="togglePopup">Filtruj po cenie</button>
      <div class="popup" v-if="isPopupActive">
        <div class="label">
          <span>Cena</span>
          <select v-model="filterType">
            <option value=">">większa</option>
            <option value="<">mniejsza</option>
          </select>
          <span>niż</span>
        </div>
        <input
          type="text"
          placeholder="price"
          autofocus
          v-model="price"/>
        <button @click="saveFilter">Filtruj</button>
      </div>
      <div class="resetIcon">
        <div @click="resetPrice" v-if="price">
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
    onSave: Function
  },
  data() {
    return {
      price: "",
      filterType: ">",
      isPopupActive: false
    };
  },
  methods: {
    togglePopup() {
      this.isPopupActive = !this.isPopupActive;
    },
    resetPrice() {
      this.isPopupActive = false;
      this.price = "";
      this.onSave(this.price);
    },
    saveFilter() {
      this.isPopupActive = false;
      this.onSave(+this.price, this.filterType);
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
  height: 150px;

  z-index: 1;
  padding: 10px;

  border: 1px solid rgb(224, 224, 224);
  background: linear-gradient(to bottom, #ffffff 0%, #f3f3f3 50%, #ededed 100%);
  box-shadow: 0 0 5px rgb(224, 224, 224);
  box-sizing: border-box;
  color: #2c3e50;
}
.popup > * {
  margin: 10px 0;
}
.label {
  display: flex;
  justify-content: space-around;
}
input {
  font-size: 14px;
  padding: 3px 5px;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(224, 224, 224);
}
button {
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
}
.popup button:hover {
  background: #46a573;
}
</style>

