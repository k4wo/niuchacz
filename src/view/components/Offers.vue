<template>
  <ul>
    <li class="top-bar">Na liście znajduje się {{offers.length}} ofert.</li>
    <offerslot 
      v-for="offer in offers" 
      :key="offer.id" 
      v-bind:offer="offer"
      :saveAsRead="saveAsRead"
      :saveAsFavourite="saveAsFavourite">
    </offerslot>
    <li v-if="!offers.length">Brak ofert w tej kategorii</li>
  </ul>
</template>

<script>
import offerslot from "./OfferSlot.vue";

export default {
  props: {
    offers: Array,
    saveAsRead: Function,
    saveAsFavourite: Function
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
}
ul {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}
</style>
