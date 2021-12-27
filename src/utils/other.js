import { nextTick } from 'vue';
import * as svg from '@element-plus/icons-vue';
import router from '/@/router/index';
import { store } from '/@/store/index';
import { Local } from '/@/utils/storage';
import SvgIcon from '/@/components/svgIcon/index.vue';

/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
export function elSvg(app) {
	for (const i in svg) {
		app.component(`element${svg[i].name}`, svg[i]);
	}
	app.component('SvgIcon', SvgIcon);
}

/**
 * 设置浏览器标题
 * @method other.useTitle();
 */
export function useTitle() {
	nextTick(() => {
		let webTitle = '';
		let globalTitle = store.state.themeConfig.themeConfig.globalTitle;
		webTitle = router.currentRoute.value.meta.title;
		document.title = `${webTitle} - ${globalTitle}` || globalTitle;
	});
}

/**
 * 图片懒加载
 * @param el dom 目标元素
 * @param arr 列表数据
 * @description data-xxx 属性用于存储页面或应用程序的私有自定义数据
 */
export const lazyImg = (el, arr) => {
	const io = new IntersectionObserver((res) => {
		res.forEach((v) => {
			if (v.isIntersecting) {
				const { img, key } = v.target.dataset;
				v.target.src = img;
				v.target.onload = () => {
					io.unobserve(v.target);
					arr[key]['loading'] = false;
				};
			}
		});
	});
	nextTick(() => {
		document.querySelectorAll(el).forEach((img) => io.observe(img));
	});
};

/**
 * 全局组件大小
 * @returns 返回 `window.localStorage` 中读取的缓存值 `globalComponentSize`
 */
export const globalComponentSize = Local.get('themeConfig')?.globalComponentSize || store.state.themeConfig.themeConfig?.globalComponentSize;

/**
 * 对象深克隆
 * @param obj 源对象
 * @returns 克隆后的对象
 */
export function deepClone(obj) {
	let newObj;
	try {
		newObj = obj.push ? [] : {};
	} catch (error) {
		newObj = {};
	}
	for (let attr in obj) {
		if (typeof obj[attr] === 'object') {
			newObj[attr] = deepClone(obj[attr]);
		} else {
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
}

/**
 * 判断是否是移动端
 */
export function isMobile() {
	if (
		navigator.userAgent.match(
			/('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
		)
	) {
		return true;
	} else {
		return false;
	}
}

/**
 * 统一批量导出
 * @method elSvg 导出全局注册 element plus svg 图标
 * @method useTitle 设置浏览器标题国际化
 * @method lazyImg 图片懒加载
 * @method globalComponentSize element plus 全局组件大小
 * @method deepClone 对象深克隆
 * @method isMobile 判断是否是移动端
 */
const other = {
	elSvg: (app) => {
		elSvg(app);
	},
	useTitle: () => {
		useTitle();
	},
	lazyImg: (el, arr) => {
		lazyImg(el, arr);
	},
	globalComponentSize,
	deepClone: (obj) => {
		deepClone(obj);
	},
	isMobile: () => {
		return isMobile();
	},
};

// 统一批量导出
export default other;