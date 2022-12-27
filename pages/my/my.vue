<template>
	<view class="my-wrapper">
		<view class="top-wrapper">
			<view class="group" @click="toUserInfo">
				<view class="info">
					<view class="pic">
						<image v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url"
							:src="userInfo.avatar_file.url" mode="aspectFill"></image>
						<image v-else src="@/static/img/1.png" mode="aspectFill"></image>
					</view>
					<view class="text" v-if="hasLogin">
						<view class="nickname">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</view>
						<view class="year">
							<uni-dateformat :date="getResDate()" :threshold="[3600,99*365*24*60*60*1000]">
							</uni-dateformat>
							注册
						</view>
					</view>
					<view class="text" v-else>
						<view class="nickname">点击登录</view>
					</view>
				</view>
				<view class="more">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="bg">
				<image v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"
					mode="aspectFill"></image>
				<image v-else src="@/static/img/1.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="main-wrapper">
			<view class="info">
				<view class="item"><text>{{totalObj.likeNum}}</text>获赞</view>
				<!-- <view class="item"><text>11</text>评论</view> -->
				<view class="item"><text>{{totalObj.artNum}}</text>发文</view>
			</view>

			<view class="list">
				<view class="group">
					<view class="item" @click="myArticle">
						<view class="left">
							<u-icon name="order" size="24"></u-icon></text><text class="text">我的长文</text>
						</view>
						<view class="right">
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="item" @click="myLike">
						<view class="left">
							<u-icon name="thumb-up" size="24"></u-icon><text class="text">我的点赞</text>
						</view>
						<view class="right">
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="item">
						<view class="left">
							<u-icon name="edit-pen" size="24"></u-icon><text class="text">评论过的</text>
						</view>
						<view class="right">
							<u-icon name="arrow-right"></u-icon></text>
						</view>
					</view>
				</view>

				<view class="group">
					<view class="item">
						<view class="left">
							<u-icon name="file-text" size="24"></u-icon><text class="text">关于</text>
						</view>
						<view class="right">
							<u-icon name="arrow-right"></u-icon></text>
						</view>
					</view>
					<view class="item" @click="goFeedback">
						<view class="left">
							<u-icon name="chat" size="24"></u-icon><text class="text">意见反馈</text>
						</view>
						<view class="right">
							<u-icon name="arrow-right"></u-icon></text>
						</view>
					</view>
				</view>

				<view class="group">
					<view class="item" @click="logout">
						<view class="left">
							<u-icon name="arrow-leftward" size="24"></u-icon><text class="text">退出登录</text>
						</view>
						<view class="right">
							<u-icon name="arrow-right"></u-icon></text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database()
	export default {
		data() {
			return {
				totalObj: {
					likeNum: 0,
					artNum: 0
				}
			};
		},
		onLoad() {
			this.getTotal()
		},
		methods: {
			getTotal() {

				db.collection("quanzi-articles").where("user_id == $cloudEnv_uid").count()
					.then(res => {
						this.totalObj.artNum = res.result.total;
					})
				db.collection("quanzi-articles").where(`user_id == $cloudEnv_uid`)
					.groupBy('user_id')
					.groupField('sum(like_count) as totalScore').get()
					.then(res => {
						this.totalObj.likeNum = res.result.data[0].totalScore;
					})
			},
			toUserInfo() {
				if (this.hasLogin) {
					uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
					})
				} else {
					let route = this.$mp.page.route;
					uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/login/login-withpwd?uniIdRedirectUrl=/' + route
					})
				}
			},
			//退出登录
			logout() {
				if (this.goLoginPage()) return;
				uni.showModal({
					title: "是否确认退出?",
					success: res => {
						console.log(res);
						if (res.confirm) {
							mutations.logout()
						}
					}
				})

			},
			goLoginPage() {
				if (!this.hasLogin) {
					uni.showToast({
						title: "未登录",
						icon: "none"
					})
					return true;
				}
				return false
			},
			getResDate() {
				console.log(this.userInfo);
				return 1672133411200;
			}
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin() {
				return store.hasLogin
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-wrapper {
		& .top-wrapper {
			position: relative;
			height: 300rpx;
			width: 100%;

			& .group {
				width: 100%;
				height: 100rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 0 30rpx;
				box-sizing: border-box;
				align-items: center;
				position: relative;
				top: calc(50% - 50rpx);
				z-index: 10;

				& .info {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;

					& .pic {
						image {
							width: 100rpx;
							height: 100rpx;
							border-radius: 50%;
						}
					}

					& .text {
						display: flex;
						flex-direction: column;
						padding: 15rpx;
						box-sizing: border-box;

						.nickname {
							font-weight: bold;
							font-size: 32rpx;
						}

						.year {
							font-size: 26rpx;
						}
					}

				}

				& .more {
					font-size: 30rpx;
				}
			}

			& .bg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
					filter: blur(20px);
					transform: scale(2);
					opacity: 0.6;
				}
			}
		}

		.main-wrapper {
			width: 100%;
			min-height: 200rpx;
			background-color: #fff;
			transform: translateY(-30rpx);
			border-radius: 25rpx 25rpx 0 0;

			.info {
				padding: 10rpx 30rpx;
				display: flex;
				font-size: 30rpx;

				.item {
					padding-right: 20rpx;
					color: #888;

					text {
						font-weight: 600;
						color: #333;
					}
				}
			}

			.list {
				.group {
					padding: 15rpx 30rpx;
					border-bottom: 15rpx solid #f4f4f4;

					.item {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 25rpx 0;
						font-size: 36rpx;
						color: #555;
						border-bottom: 1rpx solid #f8f8f8;

						.left {
							display: flex;
							align-items: center;

							.iconfont {
								font-size: 38rpx;
								margin-right: 10rpx;
							}
						}

						.right {

							font-size: 40rpx;

						}
					}

					.item:last-child {
						border: none;
					}
				}

				.group:last-child {
					border: none;
				}
			}
		}
	}
</style>
