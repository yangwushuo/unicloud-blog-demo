<template>
	<view class="box-wrapper">
		<view class="top-wrapper">
			<view class="blog-info">
				<view class="author-avatar">
					<image
						:src="item.user_id[0].avatar_file.url? item.user_id[0].avatar_file.url:'../../static/img/avatar.png'"
						mode="aspectFill">
					</image>
				</view>
				<view class="author-name">
					<text>{{item.user_id[0].nickname? item.user_id[0].nickname:item.user_id[0].username}}</text>
				</view>
				<view class="blog-posttime">
					<uni-dateformat :date="item.publish_date" :threshold="[60000, 86400000]"></uni-dateformat>
				</view>
			</view>
			<view class="top-btn">
				<view class="more">
					<text class="iconfont icon-gengduo" style="font-size: 45rpx;"></text>
				</view>
			</view>
		</view>
		<view class="content-wrapper" @click="contentClick">
			<view class="blog-title">
				<text class="title">{{item.title}}</text>
			</view>
			<view class="blog-subtitle">
				<text class="title">{{item.description}}</text>
			</view>
			<view class="blog-img">
				<image v-for="(url,index) in item.picurls" :style="{borderRadius: item.picurls.length == 1? '20rpx':''}"
					:key="index" :src="url" mode="aspectFill" @click.stop="browseImg(index)"></image>
			</view>
		</view>
		<view class="foot-wrapper">
			<view class="foot-item">
				<text class="iconfont icon-yanjing_xianshi_o foot-icon"></text>
				<text class="num">{{item.view_count}}</text>
			</view>
			<view class="foot-item">
				<text class="iconfont icon-pinglun foot-icon"></text>
				<text class="num">{{item.comment_count ? item.comment_count:'评论'}}</text>
			</view>
			<view class="foot-item">
				<text class="iconfont icon-dianzan foot-icon"></text>
				<text class="num">{{item.like_count}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "blog-box",
		props: {
			item: {
				type: Object,
				default () {
					return {

					}
				}
			}
		},
		data() {
			return {

			};
		},
		methods: {
			browseImg(index) {
				uni.previewImage({
					urls: this.item.picurls,
					current: index
				})
			},
			contentClick() {
				this.$emit('contentClick', this.item._id);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-wrapper {
		padding: 15rpx 15rpx 0 15rpx;
		box-sizing: border-box;

		& .top-wrapper {
			padding: 15rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			& .blog-info {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-content: center;

				& .author-avatar {
					image {
						width: 70rpx;
						height: 70rpx;
						border-radius: 50%;
					}
				}

				& .author-name {
					color: $custom-color5;
					font-size: 34rpx;
					line-height: 70rpx;
					margin-left: 13rpx;
				}

				& .blog-posttime {
					font-size: 20rpx;
					color: $custom-color3;
					margin: auto 0;
					margin-left: 13rpx;
				}

			}

			& .top-btn {
				font-size: 44rpx;
				line-height: 70rpx;
			}
		}

		& .content-wrapper {
			padding: 0 20rpx 20rpx 20rpx;
			box-sizing: border-box;

			& .blog-title {
				font-size: 44rpx;
				font-weight: bold;
			}

			& .blog-subtitle {
				font-size: 33rpx;
				padding: 15rpx 0;
				color: $custom-color3;
				box-sizing: border-box;
			}

			& .blog-img {
				display: flex;
				flex-direction: row;

				image {
					width: 225rpx;
					height: 225rpx;
				}

				& image:first-child {
					border-radius: 20rpx 0 0 20rpx;
					margin-right: 3rpx;
				}

				& image:last-child {
					border-radius: 0 20rpx 20rpx 0;
					margin-left: 3rpx;
				}
			}
		}

		& .foot-wrapper {
			display: flex;
			flex-direction: row;
			padding: 0 20rpx;
			justify-content: space-evenly;
			color: $custom-color3;

			.foot-item {

				display: flex;
				justify-content: center;
				align-items: center;

				& .num {
					margin-left: 10rpx;
					font-size: 24rpx;
				}

				& .foot-icon {
					font-size: 40rpx;
				}
			}
		}
	}
</style>
