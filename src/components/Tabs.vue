<template>
  <div class="c-tabs">
    <ul role="tablist" class="c-tabs__bar">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        :class="{
          'c-tab--active': tab.isActive,
          'c-tab--disabled': tab.isDisabled,
          'c-tab--has-sub': tab.hasSubTabs
        }"
        class="c-tab"
        role="presentation"
        v-show="tab.isVisible"
      >
        <a
          :aria-controls="tab.hash"
          :aria-selected="tab.isActive"
          @click="selectTab(tab.hash, $event)"
          :href="tab.hash"
          class="c-tab__link"
          role="tab"
        >
          <span v-if="tab.badge" class="c-tab__badge">{{ tab.badge }}</span>
          {{ tab.name }}
          <ul v-if="tab.hasSubTabs" class="c-subtabs">
            <li
              class="c-subtab"
              :class="{ active: subTab.isActive }"
              v-for="(subTab, j) in tab.subTabs"
              :key="j"
            >
              <a
                @click.self="selectTab(subTab.hash, $event)"
                :aria-controls="subTab.id"
                :aria-selected="subTab.isActive"
                :href="`${subTab.hash}`"
                role="tab"
              >
                <span v-if="tab.badge" class="c-tab__badge">{{
                  tab.badge
                }}</span>
                {{ subTab.label }}</a
              >
            </li>
          </ul>
        </a>
      </li>
      <div :style="borderStyle" class="c-tabs__border" />
    </ul>
    <div class="c-tabs__content mt-3">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  data: () => ({
    tabs: [],
    activeTabIndex: 0,
    activeTabHash: "",
    lastActiveTabHash: "",
    activeSubTabHash: "",
    lastActiveSubTabHash: "",
    borderStyle: {}
  }),
  props: {
    options: {
      type: Object,
      default: () => ({
        useUrlFragment: true,
        defaultTabHash: null
      })
    }
  },
  created() {
    this.tabs = this.$children;
  },
  mounted() {
    window.addEventListener("hashchange", () =>
      this.selectTab(window.location.hash)
    );
    if (this.findTab(window.location.hash)) {
      this.selectTab(window.location.hash);
      return;
    }
    if (
      this.options.defaultTabHash !== null &&
      this.findTab("#" + this.options.defaultTabHash)
    ) {
      this.selectTab("#" + this.options.defaultTabHash);
      return;
    }
    if (this.tabs.length) {
      this.selectTab(this.tabs[0].hash);
    }
  },
  methods: {
    findTab(hash) {
      const [tabHash] = hash.split(":");
      return this.tabs.find(tab => tab.hash === tabHash);
    },
    findSubTab(hash) {
      const tab = this.findTab(hash);
      if (!tab) {
        return null;
      }
      return tab.findSubTab(hash);
    },
    selectTab(hash, event) {
      if (event && !this.options.useUrlFragment) {
        event.preventDefault();
      }

      const selectedTab = this.findTab(hash);
      const selectedSubTab = selectedTab.findSubTab(hash);

      if (!selectedTab) {
        console.log("nope");
        return;
      }

      if (selectedTab.isDisabled) {
        event.preventDefault();
        return;
      }

      this.$nextTick(() => {
        const { x, width } = document
          .querySelector(`a[href="${hash}"]`)
          .getBoundingClientRect();
        this.borderStyle = { left: `${x}px`, width: `${width}px` };
      });

      if (
        this.lastActiveTabHash === selectedTab.hash &&
        !!selectedSubTab &&
        this.lastActiveSubTabHash === selectedSubTab.hash
      ) {
        this.$emit("clicked", { tab: selectedTab });
        return;
      }

      this.tabs.forEach(tab => {
        if (tab.hash === selectedTab.hash) {
          tab.isActive = true;
          tab.selectSubTab(hash);
        } else {
          tab.isActive = false;
        }
      });

      this.$emit("changed", { tab: selectedTab, subTab: selectedSubTab });

      this.activeTabIndex = this.getTabIndex(selectedTab);
      this.lastActiveTabHash = this.activeTabHash = selectedTab.hash;
      this.lastActiveSubTabHash = this.activeSubTabHash = selectedSubTab
        ? selectedSubTab.hash
        : "";
    },
    getTabIndex(selectedTab, hash) {
      if (!selectedTab && hash) {
        selectedTab = this.findTab(hash);
      }
      return this.tabs.indexOf(selectedTab);
    }
  }
};
</script>

<style lang="scss" scoped>
.c-tabs {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li.c-tab {
      position: relative;
      font-size: 1.1rem;
      display: inline-block;
      margin: 0 15px;
      transition: color 0.4s;

      &.c-tab--has-sub {
        &::after {
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3Cpath fill='none' d='M0 0h24v24H0V0z'/%3E%3C/svg%3E");
          display: inline-block;
          position: relative;
          top: 8px;
          height: 24px;
          margin-left: 2px;
          will-change: transform;
          transition: transform 0.4s;
        }

        &:hover {
          &::after {
            transform: rotate(-180deg);
          }

          .c-subtabs {
            opacity: 1;
            transform: translateY(5px);
            visibility: visible;

            .c-subtab:hover {
              background-color: rgba(0, 0, 0, 0.05);
            }
          }
        }
      }

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      a {
        .c-tab__badge {
          font-size: 0.6rem;
          padding: 0.1rem 0.4rem;
          border: 1px solid;
          border-radius: 4px;
          position: relative;
          top: -0.15rem;
        }
      }
      & > a {
        display: inline-block;
        margin: 15px 0;
        font-weight: 600;
        text-decoration: none;
        color: inherit;
      }

      &.c-tab--active {
        color: var(--active-color, #069247);
        .c-tab__badge {
          background: var(--active-color, #069247);
          color: var(--active-color-alt, #fff);
        }
      }

      .c-subtabs {
        position: absolute;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid #eaedf3;
        min-width: 185px;
        opacity: 0;
        will-change: transform;
        transition: transform 0.4s, opacity 0.4s;
        visibility: hidden;

        li.c-subtab {
          &.active {
            a {
              font-weight: bold;
            }
          }

          a {
            display: block;
            padding: 10px 15px;
            color: #203152;
          }
        }
      }
    }
    .c-tabs__border {
      transition: left 0.4s, width 0.4s;
      background: var(--active-color, #069247);
      margin-top: -1px;
      height: 2px;
      position: absolute;
    }

    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>
