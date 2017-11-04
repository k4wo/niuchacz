<template>
  <div>
    <div v-if="isReady" class="info">
      <span>Odległość: {{distance}}</span>
      <span>Czas: {{duration}}</span>
    </div>
    <div class="google-map" :id="mapName"></div>
  </div>
</template>
<script>
const rzeszow = { lat: 50.041184, lng: 21.999127 };

export default {
  name: "google-map",
  props: ["name", "destination"],
  data: function() {
    return {
      mapName: this.name + "-map",
      distance: "",
      duration: "",
      isReady: false
    };
  },
  mounted: function() {
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 7,
      center: rzeszow
    };
    const map = new google.maps.Map(element, options);
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();

    directionsService.route(
      {
        origin: rzeszow,
        destination: this.destination,
        travelMode: "DRIVING"
      },
      (response, status) => {
        if (status === "OK") {
          const route = response.routes[0].legs[0];
          this.distance = route.distance.text;
          this.duration = route.duration.text;
          this.isReady = true;

          directionsDisplay.setMap(map);
          directionsDisplay.setDirections(response);
        }
      }
    );
  }
};
</script>
<style scoped>
.google-map {
  height: 500px;
  margin: 0 auto;
  background: gray;
}
.info {
  margin: 10px;
}
</style>
