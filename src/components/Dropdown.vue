<template>
  <section
    v-show="isActive"
    :aria-hidden="!isActive"
    class="c-tabs__content"
    :id="cleanId"
    role="tabpanel"
  >
    <slot />
  </section>
</template>
<script>
export default {
  name: "Dropdown",
  render: () => "",
  props: {
    id: { type: String },
    name: { type: String, required: true },
    badge: [String, Number],
    badgeFront: Boolean,
    icon: String,
    iconContent: String
  },
  computed: {
    cleanId() {
      return this.id ? this.id : this.name.toLowerCase().replace(/ /g, "-");
    },
    hash() {
      return `${this.$parent.hash}:${this.cleanId}`;
    }
  },
  data: () => ({
    isActive: false
  })
};
</script>
