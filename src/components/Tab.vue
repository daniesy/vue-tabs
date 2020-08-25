<template>
  <section
    v-show="isActive"
    :aria-hidden="!isActive"
    class="c-tabs__content"
    :id="cleanId"
    role="tabpanel"
  >
    <slot />
    <slot name="subtabs"></slot>
  </section>
</template>

<script>
export default {
  name: "Tab",
  props: {
    id: { default: null },
    name: { required: true },
    isDisabled: { default: false },
    activeSubTab: { type: String },
    badge: String
  },
  data: () => ({
    isActive: false,
    isVisible: true
  }),
  computed: {
    cleanId() {
      return this.id ? this.id : this.name.toLowerCase().replace(/ /g, "-");
    },
    hash() {
      if (this.isDisabled) {
        return "#";
      }
      return `#${this.cleanId}`;
    },
    subTabs() {
      return this.$children.filter(child => child.$options.name === "SubTab");
    },
    hasSubTabs() {
      return !!this.subTabs.length;
    }
  },
  mounted() {
    if (this.activeSubTab) {
      this.selectSubTab(`${this.hash}:${this.activeSubTab}`);
    }
  },
  methods: {
    selectSubTab(hash) {
      if (!hash || !hash.includes(":")) {
        return;
      }
      this.subTabs.forEach(subTab => {
        subTab.isActive = hash === subTab.hash;
      });
    },
    findSubTab(hash) {
      return this.subTabs.find(subTab => subTab.hash === hash);
    }
  }
};
</script>
