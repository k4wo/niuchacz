<template>
  <ul>
    <top-bar
      :offerCounter="offers.length"
      :saveAsRead="saveAsRead"
      :showFavourite="showFavourite"
      :priceFilter="priceFilter"
      :selectAll="selectAll">
    </top-bar>
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
import topBar from "./TopBar.vue";

export default {
  props: {
    offers: Array,
    saveAsRead: Function,
    saveAsFavourite: Function,
    showFavourite: Function,
    priceFilter: Function
  },

methods: {
    selectAll() {
      this.offers.forEach(offer => {
        this.$set(offer, "markAsRead", true);
        this.saveAsRead(offer._id);
      });
    }
  },

  components: {
    offerslot,
    topBar
  }
};
</script>

<style scoped>
ul {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}
</style>
