<template>
  <ul>
    <top-bar
      :selectAll="selectAll"
      :locations="locations"
      :blockLocations="blockLocations"
      :saveAsRead="saveAsRead"
      :priceFilter="priceFilter"
      :offerCounter="offers.length"
      :showFavourite="showFavourite"
      :locationFilter="locationFilter"
      :removeSelected="removeSelected">
    </top-bar>
    <offerslot 
      v-for="offer in offers" 
      :key="offer.id" 
      v-bind:offer="offer"
      :deletion="deletion"
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
    locations: Array,
    blockLocations: Function,
    saveAsRead: Function,
    removeSelected: Function,
    saveAsFavourite: Function,
    locationFilter: Function,
    showFavourite: Function,
    priceFilter: Function,
    deletion: Number
  },

  methods: {
    selectAll() {
      this.offers.forEach(offer => {
        this.$set(offer, "markAsRead", true);
        this.saveAsRead(offer.id);
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
