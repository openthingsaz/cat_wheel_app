<template>
  <v-list-tile @click="click">
    <v-list-tile-content>
      <v-list-tile-title>{{device.name}}</v-list-tile-title>
      <v-list-tile-sub-title>{{device.id}}</v-list-tile-sub-title>
    </v-list-tile-content>

    <v-list-tile-action v-if="connected">
      연결됨
    </v-list-tile-action>
  </v-list-tile>
</template>
<script>
    export default {
        name: 'itemList',
        props: [
            'device',
            'connected'
        ],
        data() {
            return {

            }
        },
        methods: {
            connectSuccess: function () {
                this.$emit('connect', this.device);
            },
            click: function () {
                if (this.connected) {
                    bluetoothSerial.disconnect();
                    this.$emit('disconnect');
                }else{
                    bluetoothSerial.disconnect();
                    this.$emit('tryConnect');
                    bluetoothSerial.connect(this.device.id, this.connectSuccess, (e) => {
                        console.log(e);
                        bluetoothSerial.connect(this.device.id, this.connectSuccess, (e) => {
                          console.log(e);
                          this.$emit('connect', null);
                          navigator.notification.alert(e, "연결 실패");
                        })
                    })
                }
            }
        },
        mounted() {
          console.log(this.device);
        },
    };
</script>
<style lang="scss" scoped>

</style>

