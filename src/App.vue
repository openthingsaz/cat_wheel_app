<template>
  <v-app>
    <router-view name="bluetoothConnect" @select="checkDevice"></router-view>
<!--    <router-view name="login" @login="login"></router-view>-->
    <v-content id="main">
      <transition name="page">
        <router-view name="page"></router-view>
      </transition>
    </v-content>
    <!--<splash></splash>-->
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import {connect, db} from "./assets/js/db"
  import {Confirm} from "./assets/js/dialog"
  import {bytesToString, write} from "./assets/js/bleUtill"
  import catHeader from './components/home/cat-header.vue'
  // import splash from './components/splash.vue';

  export default {
    components: {
      "cat-header": catHeader,
      // splash
    },
    data () {
      return {
        cordova: Vue.cordova,
        clipped: false,
        drawer: true,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        splash: true,
        title: 'Vuetify.js'
      }
    },
    created () {
      this.cordova.on('deviceready', () => {
          // Handle the device ready event.
          StatusBar.backgroundColorByHexString("#001632");
          StatusBar.styleLightContent(true);
          navigator.splashscreen.hide();
          if (this.cordova.device.platform === 'Android') {
              document.addEventListener('backbutton', this.onBackKeyDown, false)
          }

          // if(this.$store.getters.user){
          //   this.afterLogin()
          // } else{
          //   this.$router.replace("/login")
          // }
          this.afterLogin(); // 현재 로그인 없음


          bluetoothSerial.subscribe('\n', (data)=>{
              if (data.trim().length){
                  if (!isNaN(data))
                      this.$store.commit('setWheelPos', parseInt(data)/10);
              }
          });

          connect(()=>{
              this.setTodayWheelData();
          });
      });
    },
    methods: {
      setTodayWheelData() {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT SUM(move) as today_move, sum(calorie) as today_calorie FROM logs", [],
                    (tx, res) => {
                        if (res.rows.length) {
                            let item = res.rows.item(0)
                            this.$store.commit('setTodayWheelData',item['today_calorie'],item['today_move'])
                        }
                    },
                    err => {
                        console.error(err);
                    }
                )
            }, err => {
                console.error(err);
            })
        },
      checkDevice: function () {
        const device = this.$store.getters.device
        if (device && device.id) {
          bluetoothSerial.connect(device.id, () => {
          }, () => {
            bluetoothSerial.connect(device.id, () => { // 연결 2회 시도
            }, () => {
              this.$store.commit('setDevice', null);
              this.$router.push("connect-dialog")
            });
          });
        } else {
          this.$router.push("connect-dialog")
        }
      },

      login(user){
        // this.$store.commit('setUser', user)
        // this.$router.replace("/")
        // this.afterLogin()
      },

      afterLogin(){
          bluetoothSerial.isEnabled(this.checkDevice, () => {
              bluetoothSerial.enable(this.checkDevice);
        });
      },

      onBackKeyDown () {
        if (this.$store.getters.isBackButtonDisabled){
          return
        }
        // Handle the back-button event on Android. By default it will exit the app.
        if(this.$routerHistory.hasPrevious()){
          this.$router.back();
        } else{
          Confirm("종료하시겠습니까?", "확인", function() {
            navigator.app.exitApp();
          })
        }
      }
    }
  }
</script>

<style>
	body {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
	}
  .footer{ /* Apply this to v-bottom-nav if necessary. */
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }
</style>
