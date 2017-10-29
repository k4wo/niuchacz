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
    <Offers v-bind:offers="offers"></Offers>
  </div>
</template>

<script>
import Offers from "./Offers.vue";
import Categories from "./Categories.vue";
import AddObserver from "./AddObserver.vue";

export default {
  methods: {
    changeCategory(category) {
      const { name } = category;
      this.selectedCategory = category;
      this.offers = this.allOffers[name] || [];
    },
    saveObserver(data) {
      fetch("add-observer", { method: "POST", body: JSON.stringify(data) });
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
          {
            _id: "59f4d690a2466d0e09222257",
            map: null,
            description:
              "Sprzedam działkę położoną w Malawie-Zagóra od strony Słociny, ok 1km od ulicy Świętego Rocha, o powierzchni 25 arów, media: gaz, prąd, kanalizacja na działce i wodociąg w pobliżu. Dla działki zostały wydane dwie decyzje o warunkach zabudowy. Idealne miejsce pod dom jednorodzinny lub zabudowę letniskową. Dojazd do działki bezpośrednio z drogi asfaltowej gminnej (droga utwardzona), w doskonałej lokalizacji w otoczeniu domów jednorodzinnych. Lokalizacja działki zapewnia cisze i spokój. Szybki dojazd do Rzeszowa.  Działka widokowa, atrakcyjny widok w stronę miasta. Teren w żaden sposób nie jest zagrożony zalaniem wodą. Więcej szczegółowych informacji pod numerem tel.886779533. Cena do uzgodnienia! Zapraszam!",
            powierzchnia: "25 ar",
            "cena za ar": "5 200 zl",
            media: "prąd, gaz, kanalizacja,",
            polożenie: "Malawa",
            cena: "130000 PLN",
            url:
              "http://www.rzeszowiak.pl/sprzedam-dzialke-polozona-w-malawie-zagora-od-strony-slociny-8723608",
            serviceId: 14
          },
          { isMarkedAsRead: false, id: 2, isFavourite: true }
        ],
        samochody: []
      }
    };
  },
  components: {
    Offers,
    Categories,
    AddObserver
  },
  beforeMount() {
    this.changeCategory(this.categories[0]);
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
