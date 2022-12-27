const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	_before: function() { // 通用预处理器

	},
	operation: async (table, attr, id, num) => {
		let obj = {};
		obj[attr] = dbCmd.inc(num);
		return await db.collection(table).doc(id).update(obj);
	}

}
