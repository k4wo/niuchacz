<template>
  <div class="add">
    <div @click="toggleAddContainer"><Icon name="plus-circle" class="icon"></Icon></div>
  </div>
</template>

<script>
import "vue-awesome/icons/plus-circle";
import Icon from "vue-awesome/components/Icon";

export default {
  components: {
    Icon
  }
};
</script>

<style scoped>
.add {
  position: absolute;
  display: inline-block;
  width: 50px;
  margin-left: 10%;
  margin-top: 10px;
}
.icon {
  width: 3em;
  height: 3em;
  max-width: 100%;
  max-height: 100%;
  color: #36495e;
  border-radius: 50%;
}
.icon:hover {
  box-shadow: 0 0 5px #41b984;
  cursor: pointer;
}
</style>

