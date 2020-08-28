<template>
  <section
    v-if="isActive"
    :aria-hidden="!isActive"
    class="c-tabs__content"
    :id="cleanId"
    role="tabpanel"
  >
    <slot v-if="!hasActiveDropdown" />
    <slot name="dropdown" />
  </section>
</template>

<script>
export default {
  name: "Tab",
  props: {
    id: { default: null },
    name: { required: true },
    isDisabled: { default: false },
    activeDropdownItem: { type: String },
    badge: [String, Number],
    badgeFront: Boolean,
    icon: String,
    iconContent: String
  },
  data: () => ({
    isActive: false,
    isVisible: true,
    selectedHash: ""
  }),
  watch: {
    isActive(value) {
      if (value) {
        return;
      }
      this.disableDropdowns();
    },
    hasActiveDropdown(value) {
      if (value) {
        return;
      }
      this.disableDropdowns();
    },
    badge() {
      if (this.isActive) {
        this.$parent.moveBar(this.hash);
      }
    }
  },
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
    dropdown() {
      return this.$children.filter(child => child.$options.name === "Dropdown");
    },
    hasDropdown() {
      return !!this.dropdown.length;
    },
    hasActiveDropdown() {
      return !!this.$parent.activeDropdownHash;
    }
  },
  mounted() {
    if (this.activeDropdownItem) {
      this.selectDropdown(`${this.hash}:${this.activeDropdownItem}`);
    }
  },
  methods: {
    selectDropdown(hash) {
      if (!hash || !hash.includes(":")) {
        return;
      }
      this.dropdown.forEach(item => {
        item.isActive = hash === item.hash;
      });
    },
    findDropdown(hash) {
      return this.dropdown.find(item => item.hash === hash);
    },
    disableDropdowns() {
      this.dropdown.forEach(item => (item.isActive = false));
    }
  }
};
</script>
