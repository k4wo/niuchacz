<template>
  <li class="slot">
    <div class="details" :class="{ 'mark-as-read': offer.isMarkedAsRead }">
      <div class="mark">
        <label><input type="checkbox" v-model="offer.isMarkedAsRead"></label>
        <div class="icon" @click="toggleFavourite">
          <Icon v-if="!offer.isFavourite" name="heart-o"></Icon>
          <Icon v-if="offer.isFavourite" name="heart"></Icon>
        </div>
      </div>

      <div class="offer" @click="toggleDescription">
        <span>description here</span>
      </div>

      <div class="icon" @click="openInNewWindow">
        <Icon name="external-link"></Icon>
      </div>
    </div>
    <div class="description" v-if="showFullDescription">full showFullDescription</div>
  </li>
</template>

<script>
import "vue-awesome/icons/external-link";
import "vue-awesome/icons/heart";
import "vue-awesome/icons/heart-o";
import Icon from "vue-awesome/components/Icon";

export default {
  props: {
    offer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showFullDescription: false
    };
  },
  methods: {
    markedAsRead() {
      this.offer.isMarkedAsRead = true;
    },
    toggleFavourite() {
      this.offer.isFavourite = !this.offer.isFavourite;
    },
    toggleDescription() {
      this.showFullDescription = !this.showFullDescription;
      this.markedAsRead();
    },
    openInNewWindow() {
      this.markedAsRead();
      window.open(this.offer.url, "_blank");
    }
  },
  components: {
    Icon
  }
};
</script>

<style scoped>
.slot {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  color: #616161;
  margin: 1px;
  position: relative;
}
.details {
  display: flex;
  width: 100%;
  background: rgb(247, 247, 247);
}
.description {
  margin-top: 1px;
  width: 100%;
  min-height: 100px;
  background: rgb(237, 237, 237);
  padding: 10px 20px;
  box-sizing: border-box;
}
.mark-as-read {
  opacity: 0.5;
}
.mark {
  display: flex;
  align-items: center;
  border-right: 1px solid #fff;
}
.icon,
.mark label {
  height: 35px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.offer {
  display: flex;
  width: 100%;
  margin: auto 20px;
  cursor: pointer;
}
.icon {
  border-left: 1px solid #fff;
}
.star:hover,
.mark label:hover,
.icon:hover {
  background: #eaeaea;
  cursor: pointer;
}
</style>
