module.exports = function (mongoose) {
	var printSchema = mongoose.Schema({
		title: String,
		originalFileNames: [String],
		fileOnServer: String,
		created_at: Date
	})
	var Print = mongoose.model('Print', printSchema);
	return Print;
}