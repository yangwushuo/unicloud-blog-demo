<template>
	<view class="detail-wrapper">
		<view class="content-wrapper" v-if="loading">
			<u-skeleton avatar rows="10" title animate="true"></u-skeleton>
		</view>
		<view class="content-wrapper" v-else>
			<view class="title">
				<text>{{detail.title}}</text>
			</view>
			<view class="author-info-wrapper">
				<view class="author-avatar">
					<image
						:src="detail.user_id[0].avatar_file.url ? detail.user_id[0].avatar_file.url:'../../static/img/avatar.png'"
						mode="aspectFill"></image>
				</view>
				<view class="author-info">
					<view class="author-name">
						<text>{{detail.user_id[0].nickname? detail.user_id[0].nickname:detail.user_id[0].username}}</text>
					</view>
					<view class="publish-date">
						<uni-dateformat :date="detail.publish_date" :threshold="[0, 0]"></uni-dateformat>
					</view>
				</view>
			</view>
			<view class="content">
				<u-parse :content="detail.content" :selectable="true" :tagStyle="contentHtmlStyle"></u-parse>
			</view>
			<view class="article-control">
				<view class="article-like-btn">
					<view class="like-btn" :class="{liked: likeStatus}" @click="toLike">
						<text class="iconfont icon-dianzan icon"></text>
						<text class="num">{{detail.like_count}}</text>
					</view>
				</view>
				<view class="article-view">
					<view class="views-img">
						<image src="../../static/img/avatar.png" mode="aspectFill"></image>
					</view>
					<view class="views-text">
						<text style="color: #00aee6;">{{detail.view_count}}</text>
						<text>人看过</text>
					</view>
				</view>
			</view>
		</view>
		<view class="comment-wrapper"></view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const utilsObj = uniCloud.importObject('utilsObj', {
		customUI: true
	});
	export default {
		data() {
			return {
				artId: '',
				detail: {},
				contentHtmlStyle: {
					img: 'width:100%;margin: 15rpx 0;'
				},
				likeStatus: false,
				loading: true,
			};
		},
		onLoad({
			id
		}) {
			if (!id) {
				this.paramsErr();
			}
			this.artId = id;
			//获取文章详细
			this.getDetail();
			// 更新访问量
			this.upViewCount();
		},
		methods: {
			upViewCount() {
				utilsObj.operation('quanzi-articles', 'view_count', this.artId.toString(), 1)
					.then(res => {
						console.log(res);
					})
			},
			paramsErr() {
				uni.showToast({
					title: "参数有误",
					icon: 'error',
					duration: 3000
				});
				setTimeout(() => {
					uni.hideToast();
					uni.navigateBack(10);
				}, 2000)
			},
			toLike() {
				this.likeStatus = !this.likeStatus;
				this.likeStatus ? this.detail.like_count++ : this.detail.like_count--;
				console.log(this.likeStatus);
				db.collection('quanzi-like').where(`article_id=="${this.artId}" && user_id==$cloudEnv_uid`)
					.count()
					.then(res => {
						let countRes = res.result.total;
						console.log(countRes);
						//是否已经点赞过
						if (countRes && !this.likeStatus) {
							//取消点赞
							db.collection('quanzi-like').where(`article_id=="${this.artId}" && user_id==$cloudEnv_uid`)
								.remove()
								.then(res => {
									console.log("删除成功，点赞数递减", res);
									utilsObj.operation('quanzi-articles', 'like_count', this.artId.toString(), -1)
								})
						} else {
							//点赞
							db.collection('quanzi-like').add({
								article_id: this.artId
							}).then(res => {
								console.log("添加成功，点赞数递增", res);
								utilsObj.operation('quanzi-articles', 'like_count', this.artId.toString(), 1)
							})
						}
					})
			},
			getDetail() {
				let artTemp = db.collection('quanzi-articles').field(
						"_id as artId,user_id,view_count,like_count,comment_count,publish_date,content,title")
					.getTemp();
				let userTemp = db.collection('uni-id-users').field("_id,username,nickname,avatar_file").getTemp();
				let likeTemp = db.collection('quanzi-like').where(
					`article_id == "${this.artId}" && user_id == $cloudEnv_uid`).getTemp();
				db.collection(artTemp, userTemp, likeTemp).where(
						`artId == "${this.artId}"`).get()
					.then(res => {
						console.log(res.result.data[0]);
						//判断数据
						if (!res.result.data[0]) {
							this.paramsErr();
						}
						this.detail = res.result.data[0];
						//点赞状态
						let likeList = this.detail._id['quanzi-like'];
						console.log(likeList);
						if (likeList && likeList.length) {
							console.log("已点过赞");
							this.likeStatus = true;
						} else {
							this.likeStatus = false;
							console.log("没有点过赞");
						}

						//更换标题
						uni.setNavigationBarTitle({
							title: this.detail.title
						})
						//取消骨架屏
						if (this.detail.artId) this.loading = false;
					})
					.catch(err => {
						console.log(err.message);
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail-wrapper {
		min-height: calc(100vh);
		background-color: $custom-color6;

		.content-wrapper {
			padding: 25rpx;
			box-sizing: border-box;
			background-color: #fff;

			.title {
				font-size: 44rpx;
				font-weight: bold;
				padding-bottom: 25rpx;
			}

			.author-info-wrapper {

				display: flex;
				flex-direction: row;
				padding-bottom: 10rpx;

				& .author-avatar {
					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
				}

				& .author-info {
					display: flex;
					flex-direction: column;
					padding-left: 15rpx;

					& .author-name {
						font-size: 30rpx;
						margin-bottom: 5rpx;
					}

					& .publish-date {
						font-size: 24rpx;
						color: $custom-color3;
					}
				}
			}

			.content {
				color: $custom-color7;
				font-size: 33rpx;
				text-align: justify;
			}

			.article-control {
				display: flex;
				flex-direction: column;
				justify-content: center;

				& .article-like-btn {
					padding: 30rpx;

					& .like-btn {
						width: 200rpx;
						height: 200rpx;
						// background-image: linear-gradient(135deg, #2AFADF 10%, #4C83FF 100%);
						background-color: $custom-color3;
						border-radius: 69% 31% 44% 56% / 64% 59% 41% 36%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin: 0 auto;

						& .icon {
							font-size: 60rpx;
							color: $custom-color4;
						}

						& .num {
							font-size: 30rpx;
							color: $custom-color4;
						}
					}

					& .liked {
						background-image: linear-gradient(135deg, #FDD819 10%, #E80505 100%);
					}
				}

				& .article-view {

					& .views-img {
						text-align: center;

						image {
							width: 50rpx;
							height: 50rpx;
							border-radius: 50%;
						}
					}

					& .views-text {
						text-align: center;
						color: $custom-color3;
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
