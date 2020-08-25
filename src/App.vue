<template>
  <div id="app">
    <tabs>
      <tab name="First tab" badge="123">World</tab>
      <tab name="Second">this</tab>
      <tab name="This is the last">this</tab>
    </tabs>
  </div>
</template>

<script>
import Tab from "./components/Tab";
import Tabs from "./components/Tabs";

export default {
  name: "App",
  data: () => ({
    date: ""
  }),
  components: {
    Tab,
    Tabs
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
