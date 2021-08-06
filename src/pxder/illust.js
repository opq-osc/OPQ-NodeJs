let pixiv;
let a = 0;
/**
 * 插画
 *
 * @class Illust
 */
class Illust {
	/**
	 *Creates an instance of Illust.
	 * @param {number} id PID
	 * @param {string} title 作品名
	 * @param {string} url 原画链接
	 * @param {string} file 文件名
	 * @memberof Illust
	 */
	constructor(pid, title, author, url, width, height, tags, file) {
		this.pid = pid;
		this.title = title;
		this.url = url;
		this.file = file;
		this.author = author;
		this.width = width;
		this.height = height;
		this.tags = tags;
	}

	static setPixiv(p) {
		pixiv = p;
	}

	getObject() {
		return {
			pid: this.pid,
			title: this.title,
			url: this.url,
			file: this.file,
			author: this.author,
			width: this.width,
			height: this.height,
			tags: this.tags,
		};
	}

	/**
	 * 从插画JSON对象中得到插画列表
	 *
	 * @param {*} illustJSON 插画JSON对象
	 * @returns 插画列表
	 */
	static async getIllusts(illustJSON) {
		// if(a == 0 ){
		// 	console.log(illustJSON);
		// 	a ++;
		// }
		if (illustJSON.total_bookmarks < 5000) {
			return
		}
		const illusts = [];
		// 得到插画信息
		const title = illustJSON.title.replace(/[\x00-\x1F\x7F]/g, '');
		const fileName = title.replace(/[/\\:*?"<>|.&$]/g, ''); // 适合的文件名
		const id = illustJSON.id;
		const author = illustJSON.user;
		const width = illustJSON.width;
		const height = illustJSON.height;
		const tags = []
		for (let tag of illustJSON.tags) {
			tags.push(tag.name)
			if (tag.name.includes('r18') || tag.name.includes('r-18') || tag.name.includes('R18') || tag.name.includes('R-18')) {
				return
			}
		}
		// 动图的话是一个压缩包
		if (illustJSON.type == 'ugoira') {
			// const ugoiraParams = [id, title, author, illustJSON.meta_single_page.original_image_url.replace('img-original', 'img-zip-ugoira').replace(/_ugoira0\.(.*)/, '_ugoira1920x1080.zip'), width, height, tags];
			// if (global.ugoiraMeta) {
			// 	try {
			// 		const uDelay = await pixiv.ugoiraMetaData(id).then(ret => ret.ugoira_metadata.frames[0].delay);
			// 		illusts.push(new Illust(...ugoiraParams, `(${id})${fileName}@${uDelay}ms.zip`));
			// 	} catch (error) {
			// 		console.error('\nFailed to get ugoira meta data . If you get a rate limit error, please use ', '--no-ugoira-meta'.yellow, 'argument to avoid it.', error, '\n');
			// 		illusts.push(new Illust(...ugoiraParams, `(${id})${fileName}.zip`));
			// 	}
			// } else illusts.push(new Illust(...ugoiraParams, `(${id})${fileName}.zip`));
		} else {
			if (illustJSON.meta_pages.length > 0) {
				// 组图
				for (const pi in illustJSON.meta_pages) {
					const url = illustJSON.meta_pages[pi].image_urls.original;
					const ext = url.substr(url.lastIndexOf('.')); // 图片扩展名
					illusts.push(new Illust(id, title + '_p' + pi, author, url, width, height, tags, `(${id})${fileName}_p${pi}${ext}`));
				}
			} else if (illustJSON.meta_single_page.original_image_url) {
				const url = illustJSON.meta_single_page.original_image_url;
				const ext = url.substr(url.lastIndexOf('.')); // 图片扩展名
				// 单图
				illusts.push(new Illust(id, title, author, url, width, height, tags, `(${id})${fileName}${ext}`));
			}
		}
		// 结果
		return illusts;
	}
}

module.exports = Illust;
