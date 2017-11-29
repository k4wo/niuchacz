<template>
  <ul>
    <li class="top-bar">
      <span>Na liście znajduje się {{offers.length}} ofert.</span>
      <button @click="selectAll">Zaznacz wszystkie</button>
      <button @click="toggleModal">Filtruj po cenie</button>
      <price-filter v-if="isModalPriceActive" :onSave="onFilter"></price-filter>
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
import priceFilter from "./PriceFilter.vue";

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
        this.saveAsRead(offer._id)
      });
    },
    onFilter(price) {
      this.isModalPriceActive = false
      this.priceFilter(+price)
    },
    toggleModal() {
      this.isModalPriceActive = !this.isModalPriceActive
    }
  },
  data() {
    return {
      isFavouriteMarked: false,
      isModalPriceActive: false
    }
  },
  components: {
    offerslot,
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
.top-bar label {
  cursor: pointer;
}
ul {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}
</style>
