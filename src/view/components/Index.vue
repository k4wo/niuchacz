<template>
  <div class="index">
    <Categories 
      :categories="categories" 
      :selectedCategory="selectedCategory" 
      @update:selectedCategory="changeCategory">
    </Categories>
    <AddObserver 
      v-bind:categoryName="selectedCategory.name"
      :saveObserver="saveObserver"></AddObserver>
    <Offers 
      v-bind:offers="offers"
      :showFavourite="showFavourite"
      :saveAsRead="saveAsRead"
      :priceFilter="priceFilter"
      :saveAsFavourite="saveAsFavourite"></Offers>
  </div>
</template>

<script>
import Offers from "./Offers.vue";
import Categories from "./Categories.vue";
import AddObserver from "./AddObserver.vue";

export default {
  methods: {
    changeCategory(category, offers) {
      const { name } = category;
      this.selectedCategory = category;
      this.offers = offers || this.allOffers[name] || [];
    },
    saveObserver(data) {
      fetch("/niuchacz/add", {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    saveAsRead(id) {
      fetch(`/offer/markasread/${id}`, { method: "POST" });
    },
    saveAsFavourite(id, isFavourite) {
      const path = `/offer/markasfavourite/${id}`;
      const url = isFavourite ? path : `${path}/remove`;
      fetch(url, { method: "POST" });
    },
    showFavourite(isMarked) {
      const offers = isMarked ? this.favouriteOffers : null;
      this.changeCategory(this.selectedCategory, offers);
    },
    priceFilter(filter) {
      if (!filter) {
        this.changeCategory(this.selectedCategory, offers);
        return;
      }

      const { name: categoryName } = this.selectedCategory;
      const offers = this.allOffers[categoryName].filter(offer => offer.body.cena > filter);
      this.changeCategory(this.selectedCategory, offers);
    }
  },
  data() {
    return {
      offers: [],
      categories: [],
      selectedCategory: {},
      allOffers: {},
      favouriteOffers: []
    };
  },
  components: {
    Offers,
    Categories,
    AddObserver
  },
  async beforeMount() {
    try {
      const categoriesResponse = await fetch("/niuchacz");
      const categories = await categoriesResponse.json();

      const [selectedCategory] = categories;
      const offerUrl = `/offer/${selectedCategory.servicesId.toString()}`;
      const offersResponse = await Promise.all([
        fetch(offerUrl),
        fetch(`${offerUrl}/favourite`)
      ]);

      const { offers } = await offersResponse[0].json();
      const favourites = await offersResponse[1].json();

      this.categories = categories;
      this.allOffers[selectedCategory.name] = offers;
      this.favouriteOffers = favourites.offers;
      this.changeCategory(selectedCategory);
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
  display: grid;
  grid-template-columns: 15% 70% 15%;
  grid-template-rows: 120px auto;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
