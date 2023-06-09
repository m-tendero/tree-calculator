function normalizeNumber (n) {
  return n.toLocaleString("es-ES", {maximumFractionDigits: 2, minimumFractionDigits: 2}).replace(/,?0+$/, "")
}

const { createApp } = Vue

const app = createApp({
  data() {
    return {

      title: "Perfil energético y CO₂",
            
      // Interface

      views: {
        explanation: {
          key: "explanation",
          name: "?",
          forestHeightFactor: 0,
        },
        calculation: {
          key: "calculation",
          name: "Cálculo",
          forestHeightFactor: 5,
        },
        forest: {
          key: "forest",
          name: "Bosque",
          forestHeightFactor: 8,
        },
        more: {
          key: "more",
          name: "...",
          forestHeightFactor: 3,
        },
      },

      currentViewKey: "explanation",

      // Data

      numberOfUsers: 1,
            
      resources: {
        electicity: {
          name: "Electricidad",
          unit: "kWh",
          unitToKwh: 1,
          kwhToCo2Kg: 0.16,
          amount: 0,
          active: true,
        },
        gas: {
          name: "Gas natural",
          unit: "m³",
          unitToKwh: 10.73,
          kwhToCo2Kg: 0.2019598384321292,
          amount: 0,
          active: false,
        },
        coal: {
          name: "Carbón",
          unit: "kg",
          unitToKwh: 6.57,
          kwhToCo2Kg: 0.3599997120002304,
          amount: 0,
          active: false,
        },
        butane: {
          name: "Butano",
          unit: "kg",
          unitToKwh: 12.45,
          kwhToCo2Kg: 0.23111981510414792,
          amount: 0,
          active: false,
        },
        propane: {
          name: "Propano",
          unit: "kg",
          unitToKwh: 12.45,
          kwhToCo2Kg: 0.23039981568014745,
          amount: 0,
          active: false,
        },
        gasoil: {
          name: "Gasoil",
          unit: "l",
          unitToKwh: 11.80,
          kwhToCo2Kg: 0.2667597865921707,
          amount: 0,
          active: false,
        },
        gasoline: {
          name: "Gasolina",
          unit: "l",
          unitToKwh: 9.91,
          kwhToCo2Kg: 0.24947980041615966,
          amount: 0,
          active: false,
        }
        
      },

      treeSpecies: {
        mix: {
          name: "Mezcla de árboles",
          treesPerHa: 200,
          tCO2PerHaPerYear: 6
        },
        oak: {
          name: "Roble (melojar)",
          treesPerHa: 300,
          tCO2PerHaPerYear: 5.6
        },
        pineC: {
          name: "Pino carrasco",
          treesPerHa: 115,
          tCO2PerHaPerYear: 7.6
        },
        pineR: {
          name: "Pino radiata",
          treesPerHa: 105,
          tCO2PerHaPerYear: 7.6
        }
      },

      currentTreeSpeciesKey: "mix",
      
      // Appearance

      numberOfTreeVarieties: 8,

      maxTrees: 400,

      treeLayers: [
        {
          height: 90,
          frequency: 48,
        },
        {
          height: 80,
          frequency: 24,
        },
        {
          height: 60,
          frequency: 12,
        },
        {
          height: 10,
          frequency: 6,
        },
      ],
      
      trees: [],

    }
  },
  computed: {
    co2KgPerTree () {
      const treeSp = this.treeSpecies[this.currentTreeSpeciesKey];
      return 1000 * treeSp.tCO2PerHaPerYear / treeSp.treesPerHa
    },
    co2 () {
      let n = 0
      for (const k in this.resources) {
        const resource = this.resources[k];
        if (resource.active)
          n += resource.amount * resource.unitToKwh * resource.kwhToCo2Kg
      }
      return n
    },
    numberOfTrees () {
      return this.co2 / this.co2KgPerTree
    },
    numberOfTreesRounded () {
      return Math.ceil(this.numberOfTrees)
    },
    treesPerUser () {
      return this.numberOfTrees / this.numberOfUsers
    },
    layerFrequencies () {
      const frequencies = [];
      for (
        let layerIndex = 0;
        layerIndex < this.treeLayers.length;
        layerIndex++
      ) {
        const layer = this.treeLayers[layerIndex];
        for (let j = 0; j < layer.frequency; j++) {
          frequencies.push(layerIndex)
        }
      }
      return frequencies
    },
    currentView () {
      return this.views[this.currentViewKey]
    },
    forestHeight () {
      const ratio =  3 * window.innerWidth / window.innerHeight / 5
      return ratio * this.currentView.forestHeightFactor * 10 + "%"
    },
    randomDecorativeTreeUrl () {
      return `img/tree_${ Math.floor(Math.random() * this.numberOfTreeVarieties) + 1 }_0.svg` 
    },

  },
  watch: {
    numberOfTreesRounded (newNumber, previousNumber) {
      this.populateForest(newNumber, previousNumber)
    },
    currentTreeSpeciesKey () {
      this.trees.splice(0);
      this.populateForest(this.numberOfTreesRounded, 0)
    }
  },
  methods: {
    populateForest (newNumber, previousNumber) {
      if (newNumber > previousNumber) {
        if (previousNumber < this.maxTrees) {
          if (newNumber > this.maxTrees) newNumber = this.maxTrees;
          for (
            let i = previousNumber ? previousNumber : 0;
            i < newNumber;
            i++
          ) {
            const layer = this.getRandomLayer()
            this.trees.push({
              layer,
              image: this.getRandomTreeImage(layer),
              left: Math.round(Math.random() * 100) + "%",
              inverted: Math.random() >= 0.5
            })
          }
        }
      } else if (newNumber < previousNumber && newNumber <= this.maxTrees) {
        for (
          let i = previousNumber < this.maxTrees ? previousNumber : this.maxTrees;
          i > newNumber;
          i--
        ) {
          this.trees.pop()
        }
      }
    },
    getRandomTreeImage (layer) {
      let imageNumber = Math.floor(Math.random() * this.numberOfTreeVarieties) + 1;
      if (this.currentTreeSpeciesKey == "pineR")
        imageNumber = 5;
      else if (this.currentTreeSpeciesKey == "pineC")
        imageNumber = 4;
      else if (this.currentTreeSpeciesKey == "oak")
        imageNumber = 1;
      return "img/tree_" + imageNumber + "_" + layer + ".svg"
    },
    getRandomLayer () {
      return this.layerFrequencies[Math.floor(Math.random() * this.layerFrequencies.length)]
    },
    generateTreeStyle (tree, layer) {
      let transform = "translateX(50%)";
      if (tree.inverted)
        transform = "scale(-1,1) " + transform; 
      return { 
        width: Math.floor(100 / layer.frequency) + "%",
        left: tree.left,
        bottom: layer.height + "%",
        transform
      }
    },
    getGroundStyle (layer, i) {
      return {
        'background-image': 'url(img/ground_' + i + '.svg)',
        'background-size': (i * 5 + 10) + "%",
        bottom: layer.height + "%"
      }
    },
    normalizeNumber,
  },
})
.component("ResourceEditor", {
  props: {
    name: String,
    unit: String,
    unitToKwh: Number,
    kwhToCo2Kg: Number,
    amount: Number,
    active: Boolean
  },
  computed: {
    kwh () {
      return this.amount * this.unitToKwh
    },
    co2 () {
      return this.kwh * this.kwhToCo2Kg
    }
  },
  methods: {
    changeAmount (event) {
      
      let s = event.target.value;
      
      if (s == "")
        s = "0";

      // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      if (isNaN(s))
        return;
      
      const n = parseFloat(s);
      
      // ...and ensure strings of whitespace fail
      if (isNaN(n))
        return;
      
      this.$emit("changeAmount", n)
    },
    normalizeNumber
  },
  template: `
    <div :class="[ 'resource-editor', { hidden: !active } ]">
      <label>
        <h3>{{ name }}</h3>
        <div>
          <input
            type="text"
            value="0"
            min="0"
            @input="changeAmount">
          {{ unit }}
        </div>
      </label>
      <div v-if="unit != 'kWh'">
        {{ normalizeNumber(amount) }} × {{ normalizeNumber(unitToKwh) }} = {{ normalizeNumber(kwh) }} kWh
      </div>
      <div>
        {{ normalizeNumber(kwh) }} × {{ normalizeNumber(kwhToCo2Kg) }} = {{ normalizeNumber(co2) }} kg CO₂ eq
      </div>
    </div>
  `
})
.mount('#app')
