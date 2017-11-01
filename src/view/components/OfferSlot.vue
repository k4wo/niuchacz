<template>
  <li class="slot">
    <div class="details" :class="{ 'mark-as-read': offer.markAsRead }">
      <label class="icon-container">
        <input type="checkbox" @change="toggleSelection" :checked="offer.markAsRead">
      </label>
      <div class="icon-container border-right" @click="toggleFavourite">
        <Icon v-if="!offer.markAsFavourite" name="heart-o"></Icon>
        <Icon v-if="offer.markAsFavourite" name="heart"></Icon>
      </div>

      <span class="spoiler" @click="toggleDescription">{{offer.body.description}}</span>
      <span class="price" @click="toggleDescription">{{offer.body.cena}}</span>

      <div class="icon-container" @click="openInNewWindow">
        <Icon name="external-link"></Icon>
      </div>
    </div>
    <div class="description" v-if="showFullDescription">
      <div class="description-details">
        <div>
          <div v-for="detail in details" :key="detail.name">
            <span>{{detail.name}}: </span>
            <span>{{detail.value}}</span>
          </div>
        </div>

        <div v-if="showTelNo">
          <img :src="telNoUrl" />
        </div>
        <div
          v-if="!showTelNo"
          @click="toggleTelNo"
          class="show-phone-no">Pokaz telefon</div>
      </div>
      <div>{{offer.body.description}}</div>
    </div>
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
    },
    saveAsRead: Function,
    saveAsFavourite: Function
  },
  computed: {
    details() {
      this.offer.body.offerId && console.log(this.offer.body);
      const offer = Object.assign({}, this.offer.body);
      ["description", "map", "offerId"].forEach(key => delete offer[key]);

      return Object.keys(offer).map(key => ({ name: key, value: offer[key] }));
    },
    telNoUrl() {
      return `${this.offer.body.offerId}.jpeg`;
    }
  },
  data() {
    return {
      showFullDescription: false,
      showTelNo: false,
      wasRead: !!this.offer.markAsRead
    };
  },
  methods: {
    setMarkAsRead(isMarked) {
      if (!this.wasRead) {
        this.wasRead = true;
        this.saveAsRead(this.offer._id);
      }

      this.$set(this.offer, "markAsRead", isMarked);
    },
    toggleSelection() {
      this.setMarkAsRead(!this.offer.markAsRead);
    },
    toggleFavourite() {
      this.$set(this.offer, "markAsFavourite", !this.offer.markAsFavourite);
      this.saveAsFavourite(this.offer._id, this.offer.markAsFavourite);
    },
    toggleDescription() {
      this.showFullDescription = !this.showFullDescription;
      this.setMarkAsRead(true);
    },
    openInNewWindow() {
      this.setMarkAsRead(true);
      window.open(this.offer.url, "_blank");
    },
    toggleTelNo() {
      this.showTelNo = !this.showTelNo;
    }
  },
  components: {
    Icon
  }
};
</script>

<style scoped>
.slot {
  color: #616161;
  margin: 1px;
  position: relative;
}
.details {
  display: flex;
  align-items: center;
  background: rgb(247, 247, 247);
  cursor: pointer;
}
.price {
  background: #41b984;
  color: white;
  padding: 2px 5px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 14px;
  margin: 0 10px;
}
.spoiler {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  margin: 0 10px;
}
.description {
  margin-top: 1px;
  width: 100%;
  min-height: 100px;
  background: rgb(237, 237, 237);
  padding: 10px 20px;
  box-sizing: border-box;
}
.description-details {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 30px 0;
  font-size: 14px;
}
.show-phone-no {
  cursor: pointer;
}
.mark-as-read {
  opacity: 0.5;
}
.icon-container {
  height: 35px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-container:hover {
  background: #eaeaea;
  cursor: pointer;
}
.border-right {
  border-right: 1px solid #fff;
}
</style>
