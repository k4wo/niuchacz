<template>
  <ul>
    <offerslot v-for="offer in offers" :key="offer.id" v-bind:offer="offer"></offerslot>
    <li v-if="!offers.length">Brak ofert w tej kategorii</li>
  </ul>
</template>

<script>
import offerslot from "./OfferSlot.vue";

export default {
  props: {
    offers: {
      type: Array,
      required: true
    }
  },
  components: {
    offerslot
  }
};
</script>

<style scoped>
ul {
  width: 80%;
  margin: 20px auto;
}
</style>
