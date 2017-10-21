<template>
<div class="categories">
  <div 
    class="category"
    v-for="category in categories" 
    :key="category.id"
    :class="{ 'selectedCategory': selectedCategory.id === category.id }"
    @click="selectCategory(category)">
    <span>{{category.name}}</span>
  </div>
</div>
</template>
<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: Object
    }
  },
  methods: {
    selectCategory(category) {
      this.$emit("update:selectedCategory", category);
    }
  }
};
</script>
<style scoped>
.categories {
  display: inline-block;
  position: relative;
  margin: 20px 0;
}
.category {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 0.5px;
  background: #41b984;
  cursor: pointer;
}
.selectedCategory {
  color: #fff;
  background: #36495e;
  font-weight: bold;
}
.categories:before,
.categories:after {
  content: "";
  position: absolute;
  display: block;
  bottom: -1em;
  border: 1.5em solid #6ec7a0;
  z-index: -1;
}
.categories:before {
  left: -2em;
  border-right-width: 1.5em;
  border-left-color: transparent;
}
.categories:after {
  right: -2em;
  border-left-width: 1.5em;
  border-right-color: transparent;
}
.category:first-child:before,
.category:last-child:after {
  content: "";
  position: absolute;
  display: block;
  border-style: solid;
  border-color: #30986a transparent transparent transparent;
  bottom: -1em;
}
.category:first-child:before {
  left: 0;
  border-width: 1em 0 0 1em;
}
.category:last-child:after {
  right: 0;
  border-width: 1em 1em 0 0;
}
</style>

