const db = uniCloud.database();
module.exports = {
	_before: function() { // 通用预处理器

	},

	get: async () => {
		return await db.collection("users").get();
	},

	add: async (user) => {
		return await db.collection("users").add(user);
	},

}
