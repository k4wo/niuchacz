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
      <div class="bages">
        <span 
          class="badge localization" 
          v-if="localization" 
          @click="toggleDescription">
  
          {{localization}}
          </span>
        <span class="badge price" @click="toggleDescription">{{offer.body.cena}}</span>
      </div>

      <a 
        class="icon-container link"
        @click="setMarkAsRead(true)" 
        :href="offer.url" target="_blank">
        <Icon name="external-link"></Icon>
      </a>
    </div>
    <div class="description-container" v-if="showFullDescription">
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
      <div class="description">
        <div>{{offer.body.description}}</div>
        <Map :name="offer.body.offerId" :destination="destination"></Map> 
      </div>
    </div>
  </li>
</template>

<script>
import "vue-awesome/icons/external-link";
import "vue-awesome/icons/heart";
import "vue-awesome/icons/heart-o";
import Icon from "vue-awesome/components/Icon";
import Map from "./Map.vue";

export default {
  props: {
    offer: {
      type: Object,
      required: true
    },
    saveAsRead: Function,
    saveAsFavourite: Function,
    deletion: Number
  },
  computed: {
    details() {
      const offer = Object.assign({}, this.offer.body);
      ["description", "map", "offerId"].forEach(key => delete offer[key]);

      return Object.keys(offer).map(key => ({ name: key, value: offer[key] }));
    },
    telNoUrl() {
      return `${this.offer.body.offerId}.jpeg`;
    },
    destination() {
      const offer = this.offer.body;
      if (!offer.map) {
        return `${offer["polożenie"]}, Rzeszów`;
      }

      return { lat: parseFloat(offer.map[0]), lng: parseFloat(offer.map[1]) };
    },
    localization() {
      return this.offer.body["polożenie"].trim();
    }
  },
  watch: {
    deletion() {
      this.showFullDescription = false;
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
    toggleTelNo() {
      this.showTelNo = !this.showTelNo;
    }
  },
  components: {
    Icon,
    Map
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
.details:hover {
  background: #d8d5d5;
}
.bages {
  display: flex;
  justify-content: flex-end;
}
.badge {
  color: white;
  padding: 2px 5px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 14px;
  margin: 0 5px;
  flex-shrink: 0;
}
.price {
  background: #41b984;
}
.localization {
  background: #2196f3;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
}
.link {
  color: inherit;
}
.spoiler {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin: 0 10px;
}
.description-container {
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
.description {
  display: flex;
  word-wrap: break-word;
}
.description > div {
  width: 50%;
}
.description > div:first-child {
  margin: 10px 10px 0 0;
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
  flex-shrink: 0;
}
.icon-container:hover {
  background: #eaeaea;
  cursor: pointer;
}
.border-right {
  border-right: 1px solid #fff;
}
</style>
