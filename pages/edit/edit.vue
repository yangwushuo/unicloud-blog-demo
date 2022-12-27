<template>
	<view class="edit-news-wrapper">
		<form @submit="submit">
			<view class="news-info">
				<u-input placeholder="请输入标题" :value="title" border="surround" clearable @input="inputTitle"
					@clear="clearTitle">
					<image slot="prefix" src="../../static/icon/svg/title.svg" style="width: 50rpx;height: 50rpx;">
					</image>
				</u-input>
			</view>
			<view class="news-content">
				<editor class="content" placeholder="编辑内容" show-img-size="true" show-img-resize="true"
					show-img-toolbar="true" @focus="contentFocus" @ready="contentReady"
					@statuschange="contentStyleChange">

				</editor>
			</view>
			<view class="news-control">
				<view class="news-control-but">
					<u-button icon="edit-pen" iconColor="#fff" text="发布" shape="circle" color="#2529d8"
						:loading="loading" :loadingText="loadingText" @click="submit" throttleTime="5000">
					</u-button>
				</view>
				<!-- 				<view class="news-control-but">
					<u-button icon="reload" iconColor="#fff" text="重置" shape="circle" color="#ff7b00" @click="reset">
					</u-button>
				</view> -->
			</view>
		</form>
		<view class="content-control" v-if="contentControlStatus">
			<view @click="titleStyle"><text class="iconfont icon-biaotizhengwenqiehuan"
					:class="titleShow? 'active':''"></text>
			</view>
			<view @click="boldStyle"><text class=" iconfont icon-cuti" :class="boldShow ? 'active':''"></text></view>
			<view @click="italicsStyle"><text class="iconfont icon-zitixieti" :class="italicsShow? 'active':''"></text>
			</view>
			<view @click="contentInsertDivider"><text class="iconfont icon-fengexian"></text></view>
			<view @click="addImg"><text class="iconfont icon-tupian"></text></view>
			<view @click="confirmHide"><text class="iconfont icon-duigou"></text></view>
		</view>
	</view>
</template>

<script>
	import {
		getUuid
	} from '../../utils/id.js'
	import {
		getImgSrc
	} from '../../utils/tool.js'
	const db = uniCloud.database();
	export default {
		data() {
			return {
				title: '',
				content: '',
				loading: false,
				loadingText: '正在发布',
				contentControlStatus: false,
				editCtx: '',
				titleShow: false,
				boldShow: false,
				italicsShow: false,
				artObj: {}
			};
		},
		onLoad() {

		},
		methods: {
			submit() {

				//校验是否都为空
				if (!this.title.length) {
					uni.showToast({
						title: '标题不能为空',
						icon: 'error',
						mask: true,
						duration: 2000,
					})
					return;
				}

				this.editCtx.getContents({
					success: (res) => {
						this.artObj.description = res.text.slice(0, 80);
						this.artObj.content = res.html;
						this.artObj.picurls = getImgSrc(res.html)
						this.artObj.title = this.title;
						console.log(this.artObj);
						this.loading = true;
						this.saveArt();
					}
				})

			},
			saveArt() {
				db.collection("quanzi-articles").add(this.artObj).then(res => {
					if (res.result.id) {
						uni.showToast({
							title: "发布成功",
							icon: "success",
							mask: true,
							duration: 2000
						})
						//跳转首页
						uni.navigateBack(9);
					} else {
						uni.showToast({
							title: "发布失败",
							icon: "error",
							mask: true,
							duration: 2000
						})
					}
				}).catch(err => {
					uni.showToast({
						title: "发布失败",
						icon: "error",
						mask: true,
						duration: 2000
					})
				})
				this.loading = false;
			},
			inputTitle(v) {
				this.title = v;
			},
			clearTitle() {
				this.title = '';
			},
			contentReady() {
				//文本初始化
				uni.createSelectorQuery().in(this).select(".content").fields({
					context: true
				}, (res) => {
					this.editCtx = res.context;
				}).exec();
			},
			contentFocus() {
				this.contentControlStatus = true;
			},
			contentInsertDivider() {
				this.editCtx.insertDivider();
			},
			confirmHide() {
				this.contentControlStatus = false;
			},
			titleStyle() {
				this.titleShow = !this.titleShow;
				this.editCtx.format("header", this.titleShow ? 'H2' : '', false);
			},
			boldStyle() {
				this.boldShow = !this.boldShow;
				this.editCtx.format("bold");
			},
			italicsStyle() {
				this.italicsShow = !this.italicsShow;
				this.editCtx.format("italic");
			},
			checkStatus(name, detail, obj) {
				if (detail.hasOwnProperty(name)) {
					this[obj] = true;
				} else {
					this[obj] = false;
				}
			},
			contentStyleChange(e) {
				let detail = e.detail;
				this.checkStatus("header", detail, "titleShow");
				this.checkStatus("bold", detail, "boldShow");
				this.checkStatus("italic", detail, "italicsShow");
			},
			addImg() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					success: async (res) => {
						uni.showLoading({
							title: '正在上传',
							mask: true
						})
						let tempImgPath = res.tempFilePaths[0];
						if (tempImgPath) {
							const result = await uniCloud.uploadFile({
								filePath: tempImgPath,
								cloudPath: getUuid(),
							});
							if (result.success) {
								this.editCtx.insertImage({
									src: result.fileID
								})
							}
							uni.hideLoading();
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.edit-news-wrapper {
		box-sizing: border-box;
		height: 100vh;
		padding: 15rpx;
		display: flex;
		flex-direction: column;

		.news-info {
			border-radius: 20rpx;
			box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 2px inset, rgba(0, 0, 0, 0.6) 0px 0px 0px 2px;
			margin-bottom: 20rpx;

			.label-class {
				text-align: center;
			}

			// box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
			.icon {
				width: 42rpx;
				height: auto;
			}

			.icon-news-img {
				width: 42rpx;
				height: 42rpx;
			}

		}

		.news-content {
			& .content {
				border-radius: 20rpx;
				box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 2px inset, rgba(0, 0, 0, 0.6) 0px 0px 0px 2px;
				padding: 15rpx;
				height: 800rpx;
			}
		}

		.news-control {
			height: 100rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 25rpx;

			.news-control-but:last-child {
				margin-left: 25rpx;
			}

		}

		.popUp {
			display: flex;
			flex-direction: row;
			justify-content: center;
			width: 100%;
			height: 100rpx;

			text {
				line-height: 100rpx;
			}
		}

		.content-control {
			position: fixed;
			left: 0rpx;
			bottom: 0rpx;
			width: 100%;
			height: 120rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			font-size: 46rpx;
			box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
			animation-name: example;
			animation-duration: 0.3s;
			z-index: 999;
			background-color: #fff;

			& .active {
				color: $custom-color1;
				font-size: 48rpx;
			}
		}

		@keyframes example {
			from {
				bottom: -120rpx;
			}

			to {
				bottom: 0rpx;
			}
		}

	}
</style>
