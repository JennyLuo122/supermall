import { debounce } from "common/utils";
import BackTop from 'components/content/backTop/BackTop';
import {POP, NEW, SELL} from "./const";

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
      refresh: null
    }
  },
  mounted() {
    // 监听Item中图片加载完成
    this.refresh = debounce(this.$refs.scroll.refresh, 50)
    this.itemImageListener = () => {
      this.refresh()
    }

    this.$bus.$on('itemImgLoad', this.itemImageListener)
    console.log('混入');
  }
}

export const backTopMixin = {
	components: {
		BackTop
	},
	data() {
		return {
			isShowBackTop: false
		}
	},
	methods: {
		backClick() {
			this.$refs.scroll.scrollTo(0, 0, 1000)
		}
	}
}

export const tabControlMixin = {
	data: function () {
		return {
			currentType: POP
		}
	},
	methods: {
		tabClick(index) {
			switch (index) {
				case 0:
					this.currentType = POP
					break
				case 1:
					this.currentType = NEW
					break
				case 2:
					this.currentType = SELL
					break
			}
			console.log(this.currentType);
		}
	}
}
