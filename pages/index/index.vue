<template>
	<view class="home-wrapper">
		<view class="top-nav-wrapper">
			<u-tabs :list="topNavConfig.list" :lineColor="topNavConfig.lineColor"
				:activeStyle="topNavConfig.activeStyle" :inactiveStyle="topNavConfig.inactiveStyle" @click="navClick">
			</u-tabs>
		</view>

		<view class="skeleton-wrapper" v-if="skeletonConfig.loadingStatus">
			<view class="skeleton">
				<u-skeleton avatar rows="4" title animate="true"></u-skeleton>
			</view>
			<view class="skeleton">
				<u-skeleton avatar rows="4" title animate="true"></u-skeleton>
			</view>
			<view class="skeleton">
				<u-skeleton avatar rows="4" title animate="true"></u-skeleton>
			</view>
		</view>

		<view class="content-wrapper">
			<blog-box v-for="item in blogs" :key="item._id" :item="item" @contentClick="goDetail"></blog-box>
		</view>

		<view class="btn-wrapper">
			<view class="edit" @click="editBlog">
				<text class="iconfont icon-tianjia" id="addArtIcon"></text>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				limit: 8,
				blogs: [],
				skeletonConfig: {
					loadingStatus: true,
				},
				topNavConfig: {
					activeTopNavIndex: 0,
					lineColor: "#2529d8",
					activeStyle: {
						color: '#2529d8',
						fontWeight: 'bold',
					},
					inactiveStyle: {
						color: '#707070',
					},
					list: [{
						name: '最新',
						type: 'publish_date'
					}, {
						name: '热门',
						type: 'like_count'
					}]
				}
			}
		},
		onLoad() {
			this.getArts();
		},
		methods: {
			navClick(e) {
				console.log(e);
				this.blogs = [];
				this.skeletonConfig.loadingStatus = true;
				this.topNavConfig.activeTopNavIndex = e.index;
				this.getArts();
			},
			editBlog() {
				uni.navigateTo({
					url: '/pages/edit/edit'
				})
			},
			getArts() {
				let artTemp = db.collection('quanzi-articles').field(
					"_id,user_id,view_count,like_count,comment_count,publish_date,description,picurls,title").getTemp();
				let userTemp = db.collection('uni-id-users').field("_id,username,nickname,avatar_file").getTemp();
				db.collection(artTemp, userTemp).orderBy(this.topNavConfig.list[this.topNavConfig.activeTopNavIndex].type,
						"desc").get()
					.then(res => {
						console.log(res);
						this.blogs = res.result.data;
						this.skeletonConfig.loadingStatus = false;
					})
			},
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.home-wrapper {
		position: relative;

		.skeleton-wrapper {
			box-sizing: border-box;
			padding: 20rpx;

			.skeleton {
				margin: 25rpx 0;
			}

		}

		.content-wrapper {
			blog-box:not(:last-child)::after {
				content: '';
				display: inline-block;
				height: 7rpx;
				width: 100%;
				background-color: $custom-color4;
			}
		}

		.btn-wrapper {
			position: fixed;
			right: 50rpx;
			bottom: 50rpx;

			.edit {
				width: 90rpx;
				height: 90rpx;
				background-color: $custom-color1;
				border-radius: 50%;
				box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
				z-index: 999;
				text-align: center;

				& #addArtIcon {
					font-size: 50rpx;
					color: $uni-bg-color-grey;
					line-height: 90rpx;
				}
			}

		}
	}
</style>
