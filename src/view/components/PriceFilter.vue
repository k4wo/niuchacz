<template>
    <div class="container" >
      <input
        type="text"
        placeholder="price"
        autofocus
        v-model="price"/>
      <button @click="onSave(price)">Dodaj</button>
    </div>
</template>

<script>
export default {
  props: ["onSave"],
  data() {
    return {
      price: ""
    };
  }
};
</script>

<style scoped>
.container {
  position: absolute;
  left: 570px;
  top: 50px;
  width: 200px;
  z-index: 1;
  padding: 10px;
  border: 1px solid rgb(224, 224, 224);
  background: linear-gradient(to bottom, #ffffff 0%, #f3f3f3 50%, #ededed 100%);
  box-shadow: 0 0 5px rgb(224, 224, 224);
  box-sizing: border-box;
}
input {
  padding: 3px 5px;
  outline: none;
}
button {
  padding: 7px 20px;
  margin: 20px 0 0 0;
  background: #41b984;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
}
button:hover {
  background: #46a573;
}
</style>

