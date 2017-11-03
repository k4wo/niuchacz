<template>
  <ul>
    <li class="top-bar">
      <span>Na liście znajduje się {{offers.length}} ofert.</span>
      <label>
        Pokaż ulubione oferty
        <input type="checkbox" v-model="isFavouriteMarked" @change="showFavourite(isFavouriteMarked)"/>
      </label>
    </li>
    <offerslot 
      v-for="offer in offers" 
      :key="offer.id" 
      v-bind:offer="offer"
      :saveAsRead="saveAsRead"
      :saveAsFavourite="saveAsFavourite">
    </offerslot>
  </ul>
</template>

<script>
import offerslot from "./OfferSlot.vue";

export default {
  props: {
    offers: Array,
    saveAsRead: Function,
    saveAsFavourite: Function,
    showFavourite: Function
  },
  data() {
    return {
      isFavouriteMarked: false
    }
  },
  components: {
    offerslot
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
}
.top-bar label {
  cursor: pointer;
}
ul {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}
</style>
