<template>
    <li class="top-bar">
      <label class="selectAll">
        <input type="checkbox" v-model="checkAll" @change="selectAll"/>
        <span>Na liście znajduje się {{offerCounter}} ofert.</span>
      </label>

      <price-filter :onSave="priceFilter"></price-filter>

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

export default {
  props: {
    selectAll: Function,
    offerCounter: Number,
    saveAsRead: Function,
    priceFilter: Function,
    showFavourite: Function
  },

  data() {
    return {
      isFavouriteMarked: false,
      checkAll: false
    };
  },

  components: {
    priceFilter
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
.top-bar label, .selectAll {
  cursor: pointer;
}
</style>

