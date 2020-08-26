<template>
  <div id="app">
    <tabs>
      <tab name="First tab" badge="123">
        <template #dropdown>
          <dropdown name="First Dropdown">First Dropdown</dropdown>
          <dropdown name="Second Dropdown">Second Dropdown</dropdown>
        </template>

        First tab
      </tab
      >
      <tab name="Second">this</tab>
      <tab name="This is the last">this</tab>
    </tabs>
  </div>
</template>

<script>
import Dropdown from "./components/Dropdown";
import Tab from "./components/Tab";
import Tabs from "./components/Tabs";

export default {
  name: "App",
  data: () => ({
    date: ""
  }),
  components: {
    Tab,
    Tabs,
    Dropdown
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
