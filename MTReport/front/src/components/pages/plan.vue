<template>
<div>
    <Navbar/>
<div class="container">
 <div class="row">
           <div class="col-12 concept">
         <p class="concept-title">行程資訊</p>
       </div>
  </div>
  <div class="row mt-5 d-flex flex-row align-items-start sticky ">
          <!-- 選單 (List group) -->
          <div class="filter-container text-center list-group  sticky col-lg-3">
            <h4 class="p-3">分類</h4>
             <hr>
            <input v-model.trim="plan.title" class="form-control" placeholder="活動關鍵字" type="text">
            <a class="list-group-item list-group-item-action serch-control"
              href="#" @click.prevent="searchText = item"
              :class="{ 'active': item === searchText}"
              v-for="item in categories" :key="item">
              {{ item }}
            </a>
            <a href="#" class="list-group-item list-group-item-action
            serch-control"
              @click.prevent="searchText = ''"
              :class="{ 'active': searchText === ''}">
              全部行程
            </a>
          </div>

        <transition name="fade" mode="out-in">
        <div class="col-lg-9 ">
          <div class="row flex-row ">
              <div class="col-lg-6  col-sm-12 mb-4 " v-for="(item) in filterTitle" :key="item.id">
                  <div v-if="item.is_enabled" class="card rounded border-2 shadow-md ml-2">
    <div style="height:300px; background-size:cover; background-position:center"
      :style="{backgroundImage:`url(${item.images[0].imgUrl})`}"
      > 
    </div>
    <div class="card-body">
      <h5 class="card-title">
        <span href="#">{{ item.title }}</span>
      </h5>
      <span class="card-txt">分類：{{ item.category }}</span>
      <br>
      <span class="card-txt">費用： NT{{ item.cost | commaFormat | dollarSign }} </span>
    </div>
    <div class="card-foot">
      <div class="btn-detail text-center rounded">
      <a @click="getProduct(item._id)"  class="rounded">
        詳細資訊
      </a>
      </div>
    </div>
     </div>
                </div>
                </div>
            </div>
            </transition>


        </div>
   </div>
</div>
</template>
<script>
import Vue from 'vue'
import Axios from 'axios'
import Navbar from '../Navbar'

Vue.filter('dollarSign', function (n) {
return `$ ${n}`
})

Vue.filter('commaFormat', (value) => {
  if (!value) return ''
  return value.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, digital) {
    return pre + digital.replace(/\d{3}/g, ',$&')
  })
})

export default {
  name: 'Plan',
  components: {
    Navbar,
    },
  data () {
    return {
    searchText: '',
    categories: [],
    plans:[],
    plan:{
      title:''
    },
    index:0
    } 
  },
  computed: {
    // 篩選分類
    filterData() {
      if (this.searchText) {
        return this.plans.filter((item) => {
          const data = item.category.toLowerCase().includes(this.searchText.toLowerCase());
          return data;
        });
      }
      return this.plans;
    },
    products() {
      return this.$store.state.products; 
    },
    filterTitle () { 
     if (this.plan.title){
       return this.filterData.filter(item=>{
         let content = item.title.toLowerCase()
         let inputext = this.plan.title.toLowerCase()
          // content陣列中找符合的元素（若存在 !==-1 則回傳）
         return content.indexOf(inputext) !== -1
       })
     }
     else {
       return this.filterData
     }
    },
  },
    methods: {
        getProducts() {
        const api = `${process.env.VUE_APP_API}`+ '/products'
        const vm = this;
        Axios.get(api).then((response) => {
        // console.log(response.data)
        vm.plans = response.data.result
        vm.getUnique()    
        })
        },
       //篩選分類
        getUnique() {
          const vm = this
          const categories = new Set();
          vm.plans.forEach((item) => {
        categories.add(item.category);
      });
      vm.categories = Array.from(categories);
    },
        getProduct(id) {
        const api = `${process.env.VUE_APP_API}`+ '/products/' + `${id}`
        const vm = this;
        Axios.get(api).then((response) => {
        vm.plan = response.data.result
        if(response.data.success){
            vm.$router.push('itemPlan/'+`${id}`)
          }        
        })
        },
 
    },
    created() {
      this.getProducts()
    },
}
</script>
<style lang="scss">
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active{
transition: opacity 0.5s;
}
</style>