<template>
  <div class="index">
    <Categories 
      :categories="categories" 
      :selectedCategory="selectedCategory" 
      @update:selectedCategory="changeCategory">
    </Categories>
    <AddObserver 
      v-bind:categoryName="selectedCategory.name"
      :saveObserver="saveObserver">
    </AddObserver>
    <Offers 
      v-bind:offers="offers"
      v-bind:locations="locations"
      :deletion="deletePressed"
      :saveAsRead="saveAsRead"
      :blockLocations="blockLocations"
      :priceFilter="priceFilter"
      :showFavourite="showFavourite"
      :removeSelected="removeSelected"
      :locationFilter="locationFilter"
      :saveAsFavourite="saveAsFavourite">
    </Offers>
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
      this.setLocations();
    },
    setLocations() {
      this.locations = this.offers.reduce((store, offer) => {
        const location = offer.body["polożenie"].trim().toLowerCase();
        if (!location || store.includes(location)) {
          return store;
        }

        return [...store, location];
      }, []).sort();
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
    priceFilter(price, filterType) {
      if (!price) {
        this.changeCategory(this.selectedCategory, offers);
        return;
      }

      const bigger = offer => offer > price;
      const lower = offer => offer < price;
      const onFilter = filterType === ">" ? bigger : lower;

      const { name: categoryName } = this.selectedCategory;
      const offers = this.allOffers[categoryName].filter(offer =>
        onFilter(offer.body.cena)
      );

      this.changeCategory(this.selectedCategory, offers);
    },
    locationFilter(locations) {
      if (!Array.isArray(locations) || !locations.length) {
        this.isFiltredByLocation = false;
        return this.changeCategory(this.selectedCategory);
      }

      const offers = this.offers.filter(offer =>
        locations.includes(offer.body["polożenie"].trim().toLowerCase())
      );

      this.isFiltredByLocation = true;
      this.changeCategory(this.selectedCategory, offers);
    },
    removeSelected() {
      this.deletePressed += 1;
      const filter = offers => offers.filter(offer => !offer.markAsRead);

      this.offers = filter(this.offers);

      const { name } = this.selectedCategory;
      this.allOffers[name] = filter(this.allOffers[name]);
      this.setLocations();
    },
    blockLocations() {
      if(!this.isFiltredByLocation) {
        return
      }

      fetch("/offer/block", {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({locations: this.locations})
      });
    }
  },
  data() {
    return {
      offers: [],
      categories: [],
      selectedCategory: {},
      allOffers: {},
      favouriteOffers: [],
      deletePressed: 0,
      locations: [],
      isFiltredByLocation: false
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
      this.categories = categories;

      const [selectedCategory] = categories;
      const offerUrl = `/offer/${selectedCategory.id}`;

      const offersResponse = await fetch(offerUrl);
      const { offers } = await offersResponse.json();
      this.allOffers[selectedCategory.name] = offers.map(item => 
        ({...item, body: JSON.parse(item.body)}));

      const favouriteOffers = await fetch(`${offerUrl}/favourite`);
      const favourites = await favouriteOffers.json();
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
