<template>
  <div id="app">
    <tabs>
      <tab
        name="First tab"
        badge="123"
        icon="material-icons md-18"
        icon-content="favorite"
      >
        <template #dropdown>
          <dropdown name="First Dropdown">First Dropdown</dropdown>
          <dropdown name="Second Dropdown">Second Dropdown</dropdown>
        </template>

        First tab
      </tab>
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
/* Rules for sizing the icon. */
.material-icons.md-14 {
  font-size: 14px;
  max-width: 14px;
}
.material-icons.md-18 {
  font-size: 18px;
  max-width: 18px;
}
.material-icons.md-24 {
  font-size: 24px;
  max-width: 24px;
}
.material-icons.md-36 {
  font-size: 36px;
  max-width: 36px;
}
.material-icons.md-48 {
  font-size: 48px;
  max-width: 48px;
}

/* Rules for using icons as black on a light background. */
.material-icons.md-dark {
  color: rgba(0, 0, 0, 0.54);
}
.material-icons.md-dark.md-inactive {
  color: rgba(0, 0, 0, 0.26);
}

/* Rules for using icons as white on a dark background. */
.material-icons.md-light {
  color: rgba(255, 255, 255, 1);
}
.material-icons.md-light.md-inactive {
  color: rgba(255, 255, 255, 0.3);
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
