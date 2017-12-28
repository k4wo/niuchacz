<template>
  <li class="top-bar">
    <label class="selectAll">
      <input type="checkbox" v-model="checkAll" @change="selectAll"/>
      <span>Zaznacz wszystkie ({{offerCounter}})</span>
    </label>

    <div class="buttons">
      <div><button @click="removeSelectedOffers">Usuń zaznaczone</button></div>
      <price-filter :onSave="priceFilter"></price-filter>
      <location-filter :onSave="locationFilter" :locations="locations"></location-filter>
    </div>

    <label>
      Pokaż ulubione oferty
      <input 
        type="checkbox"
        v-model="isFavouriteMarked"
        @change="showFavourite(isFavouriteMarked)"/>
    </label>
  </li>
</template>

<script>
import priceFilter from "./PriceFilter.vue";
import locationFilter from "./LocationFilter.vue";

export default {
  props: {
    locations: Array,
    selectAll: Function,
    offerCounter: Number,
    saveAsRead: Function,
    priceFilter: Function,
    showFavourite: Function,
    locationFilter: Function,
    removeSelected: Function
  },

  methods: {
    removeSelectedOffers() {
      this.checkAll = false;
      this.removeSelected();
    }
  },

  data() {
    return {
      isFavouriteMarked: false,
      checkAll: false
    };
  },

  components: {
    priceFilter,
    locationFilter
  }
};
</script>

<style scoped>
.top-bar {
  background: #374a5e;
  padding: 10px;
  color: #fff;
  margin: -1px 1px;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.top-bar label,
.selectAll {
  cursor: pointer;
}
.buttons {
  display: flex;
  justify-content: space-between;
  width: 370px;
}
</style>

