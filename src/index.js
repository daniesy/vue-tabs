import Vue from "vue";

import Dropdown from "./components/Dropdown";
import Tab from "./components/Tab";
import Tabs from "./components/Tabs";

const Components = { Dropdown, Tab, Tabs };

for (let key in Components) {
  Vue.component(key, Components[key]);
}

export default Components;
