<template>
  <div class="index">
    <Categories 
      :categories="categories" 
      :selectedCategory="selectedCategory" 
      @update:selectedCategory="changeCategory">
    </Categories>
    <Icon name="plus-circle" class="add"></Icon>
    <Offers v-bind:offers="offers"></Offers>
  </div>
</template>

<script>
import "vue-awesome/icons/plus-circle";
import Icon from "vue-awesome/components/Icon";

import Offers from "./Offers.vue";
import Categories from "./Categories.vue";

export default {
  methods: {
    changeCategory: function(category) {
      const { name } = category;
      this.selectedCategory = category;
      this.offers = this.allOffers[name] || [];
    }
  },
  data() {
    return {
      offers: [],
      categories: [
        { id: 1, name: "działki" },
        { id: 532, name: "samochody" },
        { id: 923, name: "szybkowary" },
        { id: 7310, name: "samochody" },
        { id: 3943, name: "Inne" }
      ],
      selectedCategory: {},
      allOffers: {
        działki: [
          { id: 1, isFavourite: false },
          { isMarkedAsRead: false, id: 2, isFavourite: true }
        ],
        samochody: []
      }
    };
  },
  components: {
    Offers,
    Categories,
    Icon
  },
  beforeMount() {
    this.changeCategory(this.categories[0]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
  width: 100%;
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
.add {
  margin-left: 10%;
  margin-top: 10px;
  width: 3em;
  height: 3em;
  color: #36495e;
  border-radius: 50%;
}
.add:hover {
  box-shadow: 0 0 5px #41b984;
  cursor: pointer;
}
</style>
