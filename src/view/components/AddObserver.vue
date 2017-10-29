<template>
  <div class="add">
    <div @click="toggleAddContainer"><Icon name="plus-circle" class="icon"></Icon></div>
    <div class="container" v-if="isAddContainerActive">
      <label>
        <input type="checkbox" v-model="addNewObserver">
        Dodaj nowy dział
      </label>
      <input 
        type="text"
        placeholder="Nazwa"
        v-if="addNewObserver"
        v-model="name"/>
      <input
        type="text"
        placeholder="Link"
        v-model="url"/>
      <button @click="addObserver">Dodaj</button>
    </div>
  </div>
</template>

<script>
import "vue-awesome/icons/plus-circle";
import Icon from "vue-awesome/components/Icon";

export default {
  props: ["categoryName", "saveObserver"],
  data() {
    return {
      url: "",
      name: "",
      addNewObserver: false,
      isAddContainerActive: false
    };
  },
  methods: {
    toggleAddContainer: function() {
      this.isAddContainerActive = !this.isAddContainerActive;
    },
    addObserver: function() {
      const toSave = {
        url: this.url,
        name: this.addNewObserver ? this.name : this.categoryName
      };

      this.saveObserver(toSave);
    }
  },
  components: {
    Icon
  }
};
</script>

<style scoped>
.add {
  display: flex;
  justify-content: start;
  align-items: end;
  position: relative;

  grid-column-start: 3;
  justify-self: start;
  align-self: end;
}
.icon {
  width: 3em;
  height: 3em;
  max-width: 100%;
  max-height: 100%;
  color: #36495e;
  border-radius: 50%;
}
.icon:hover {
  box-shadow: 0 0 5px #41b984;
  cursor: pointer;
}
.container {
  position: absolute;
  right: -70px;
  top: 60px;
  width: 200px;
  z-index: 1;
  padding: 10px;
  border: 1px solid rgb(224, 224, 224);
  background: linear-gradient(to bottom, #ffffff 0%, #f3f3f3 50%, #ededed 100%);
  box-shadow: 0 0 5px rgb(224, 224, 224);
  box-sizing: border-box;
}
input {
  padding: 3px 5px;
  outline: none;
}
button {
  padding: 7px 20px;
  margin: 20px 0 0 0;
  background: #41b984;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #46a573;
}
</style>

