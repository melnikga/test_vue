<template>
  <div id="app">
    <div v-if="error">
      {{ error }}
    </div>
    <ul v-else>
      <ul class="font-bold text-lg" v-for="plot in plots" :key="plot.id">
        Уровень - {{ plot.attributes.Level }}
        <div class="text-base font-bold">
            Точки уровня
          </div>
        <li class="text-base" v-for="k in plot.attributes.dots.data" :key="plot.id">
          
          {{ k.attributes.latitude }}
          {{ k.attributes.longitude }}
        </li>
      </ul>
      <form class="mt-4 border p-4 " id="form" v-on:submit="handleSubmit">
        <h4 class="text-lg font-bold ">Добавть PLOT</h4>
        <input class="border-2 p-1 border-black rounded-xl" type="number" min='1' v-model="modifiedData.data.Level" name="Level" id="" placeholder="Type level of plot"><br>
        
        <input class="border-2 p-2 border-black rounded-xl mt-2 cursor-pointer transition-all hover:bg-green-300" type="submit" value="Submit">
      </form>
      <form class="mt-4 border p-4 " id="form1" v-on:submit="handleSubmitDots">
        <h4 class="text-lg font-bold ">Добавить Dots</h4>
        <input type="float" class="border-2 p-1 border-black rounded-xl" min='1' v-model="modifiedDataDots.data.latitude" name="Level" id="" placeholder="Type longitude"><br>
        <input type="float" class="border-2 p-1 border-black mt-2 rounded-xl" min='1' v-model="modifiedDataDots.data.longitude" name="Level" id="" placeholder="Type latitude"><br>
        <div v-for="zone in plots" :key="zone.id">
          <label>{{ zone.attributes.Level }}</label>
          <input
            type="radio"
            v-bind:value="zone.id"
            v-model="modifiedDataDots.data.plot.id"
            name="plots"
          />
        </div>
        <input class="border-2 p-2 border-black rounded-xl mt-2 cursor-pointer transition-all hover:bg-green-300" type="submit" value="Submit">
      </form>
    </ul>
  </div>
  <my-component :plots="plots"/>
  
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      plots: [],
      dotes: [],
      error: null,
      headers: {'Content-Type': 'application/json'},
      modifiedData: {
        data: {

        }
      },
      modifiedDataDots: {
        data:{
          plot: {
            
          }
        }
      },
    }
  },
  methods: {
    checkStatus: function (resp) {
      if (resp.status >= 200 && resp.status < 300) {
        return resp;
      }
    },
    
    handleSubmit: async function(e) {
      e.preventDefault();
      if(this.modifiedData.data.Level){
        try {
        const response = await fetch('http://localhost:1337/api/plots', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(this.modifiedData)
          }).then(this.checkStatus)
            .then(this.parseJSON);
            console.log(response);
        } catch (error) {
          this.error = error
        }
      } else{
        alert('Вы забыли ввести данные')
      }
      
    },
    handleSubmitDots: async function(e) {
      e.preventDefault();
      if(this.modifiedDataDots.data.longitude && this.modifiedDataDots.data.latitude){
        try {
        const response = await fetch('http://localhost:1337/api/dots', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(this.modifiedDataDots)
          }).then(this.checkStatus)
            .then(this.parseJSON);
            console.log(response);
        } catch (error) {
          this.error = error
        }
        console.log(JSON.stringify(this.modifiedDataDots));
      } else{
        alert('Вы забыли ввести данные')
      }
      e.target.reset();
      
    }
  },
  async mounted () {
   
    try {
      const response = await fetch("http://localhost:1337/api/plots?populate=dots").then(this.checkStatus).then(res => res.json())
      this.plots = response.data;
    } catch (error) {
      this.error = error
    }
  }
  
}
</script>