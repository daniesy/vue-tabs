<template>
  <div class="c-tabs">
    <ul role="tablist" class="c-tabs__bar">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        :class="{
          'c-tab--active': tab.isActive,
          'c-tab--disabled': tab.isDisabled,
          'c-tab--dropdown': tab.hasDropdown
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
          <span v-if="tab.icon" class="c-icon" :class="tab.icon">{{
            tab.iconContent
          }}</span>
          <span
            v-if="tab.badge && tab.badgeFront"
            class="c-badge c-badge--before"
            >{{ tab.badge }}</span
          >
          {{ tab.name }}
          <span
            v-if="tab.badge && !tab.badgeFront"
            class="c-badge c-badge--after"
            >{{ tab.badge }}</span
          >
          <ul v-if="tab.hasDropdown" class="c-dropdown">
            <li
              class="c-dropdown__item"
              :class="{ active: item.isActive }"
              v-for="(item, j) in tab.dropdown"
              :key="j"
            >
              <a
                @click.self="selectTab(item.hash, $event)"
                :aria-controls="item.id"
                :aria-selected="item.isActive"
                :href="`${item.hash}`"
                role="tab"
              >
                <span v-if="item.icon" class="c-icon" :class="item.icon">{{
                  item.iconContent
                }}</span>
                <span v-if="item.badge && item.badgeFront" class="c-badge">{{
                  item.badge
                }}</span>
                {{ item.name }}</a
              ><span v-if="item.badge && !!item.badgeFront" class="c-badge">{{
                item.badge
              }}</span>
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
    activeDropdownHash: "",
    lastActiveDropdownHash: "",
    borderStyle: {},
    rafRunning: false,
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
    window.addEventListener("resize", this.windowResized);
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
  beforeDestroy() {
    window.removeEventListener("resize", this.windowResized);
  },
  methods: {
    findTab(hash) {
      const [tabHash] = hash.split(":");
      return this.tabs.find(tab => tab.hash === tabHash);
    },
    findDropdown(hash) {
      const tab = this.findTab(hash);
      if (!tab) {
        return null;
      }
      return tab.findDropdown(hash);
    },
    selectTab(hash, event) {
      if (event && !this.options.useUrlFragment) {
        event.preventDefault();
      }

      const selectedTab = this.findTab(hash);
      const selectedDropdown = selectedTab.findDropdown(hash);

      if (!selectedTab) {
        return;
      }

      if (selectedTab.isDisabled) {
        event.preventDefault();
        return;
      }

      this.$nextTick(() => {
        this.moveBar(hash);
      });

      if (
        this.lastActiveTabHash === selectedTab.hash &&
        !!selectedDropdown &&
        this.lastActiveDropdownHash === selectedDropdown.hash
      ) {
        this.$emit("clicked", { tab: selectedTab });
        return;
      }

      this.tabs.forEach(tab => {
        if (tab.hash === selectedTab.hash) {
          tab.isActive = true;
          tab.selectDropdown(hash);
        } else {
          tab.isActive = false;
        }
      });

      this.$emit("changed", { tab: selectedTab, dropdown: selectedDropdown });

      this.activeTabIndex = this.getTabIndex(selectedTab);
      this.lastActiveTabHash = this.activeTabHash = selectedTab.hash;
      this.activeDropdownHash = selectedDropdown ? selectedDropdown.hash : "";
      this.lastActiveDropdownHash = this.activeDropdownHash;
    },
    getTabIndex(selectedTab, hash) {
      if (!selectedTab && hash) {
        selectedTab = this.findTab(hash);
      }
      return this.tabs.indexOf(selectedTab);
    },
    moveBar(hash) {
      if (!hash) {
        hash = this.activeTabHash;
      }
      const [mainHash] = hash.split(":");
      const element = document.querySelector(`a[href="${mainHash}"]`)
        .parentElement;
      this.borderStyle = {
        left: `${element.offsetLeft}px`,
        width: `${element.offsetWidth}px`
      };
    },
    windowResized() {   
      console.log("resized")  ;
      if (this.rafRunning) {
        window.cancelAnimationFrame(this.rafRunning);
      }
      this.rafRunning = window.requestAnimationFrame(() => {
        this.moveBar(this.activeTabHash);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.c-tabs {
  ul {
    position: relative;
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;

    li.c-tab {
      position: relative;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      margin: 0 15px;
      transition: color 0.4s;

      &.c-tab--dropdown {
        &::after {
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3Cpath fill='none' d='M0 0h24v24H0V0z'/%3E%3C/svg%3E");
          display: inline-block;
          position: relative;
          height: 24px;
          margin-left: 2px;
          will-change: transform;
          transition: transform 0.4s;
        }

        &:hover {
          &::after {
            transform: rotate(-180deg);
          }

          .c-dropdown {
            opacity: 1;
            transform: translateY(5px);
            visibility: visible;

            .c-dropdown:hover {
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
        .c-icon {
          margin-right: 0.4rem;
        }
        .c-badge {
          font-size: 0.6rem;
          padding: 0.1rem 0.4rem;
          border: 1px solid;
          border-radius: 4px;
          position: relative;
          &.c-badge--before {
            margin-right: 0.4rem;
          }
          &.c-badge--after {
            margin-left: 0.4rem;
          }
        }
      }
      & > a {
        display: inline-flex;
        align-items: center;
        margin: 15px 0;
        font-weight: 600;
        text-decoration: none;
        color: inherit;
        .c-icon {
          line-height: inherit;
        }
      }

      &.c-tab--active {
        color: var(--active-color, #069247);
        .c-badge {
          background: var(--active-color, #069247);
          color: var(--active-color-alt, #fff);
        }
      }

      .c-dropdown {
        display: block;
        position: absolute;
        top: 100%;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid #eaedf3;
        min-width: 185px;
        opacity: 0;
        will-change: transform;
        transition: transform 0.4s, opacity 0.4s;
        visibility: hidden;
        z-index: 1;

        li.c-dropdown__item {
          &.active {
            a {
              font-weight: bold;
            }
          }

          a {
            display: block;
            padding: 10px 15px;
            color: #203152;
            text-decoration: none;
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
      bottom: 0;
    }

    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>
