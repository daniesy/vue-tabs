import Vue from "vue";

import Tab from "./components/Tab";
import Tabs from "./components/Tabs";

const Components = { Tab, Tabs };

for (let key in Components) {
  Vue.component(key, Components[key]);
}

export default Components;
