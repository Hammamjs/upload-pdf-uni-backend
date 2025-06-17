class AppFeatures {
  constructor(mongooseQuery, stringQuery) {
    this.mongooseQuery = mongooseQuery;
    this.stringQuery = stringQuery;
  }

  search() {
    const keyword = {};
    if (this.stringQuery.keyword) {
      keyword.$or = [
        { title: { $regex: this.stringQuery.keyword, $options: 'i' } },
        { year: { $regex: this.stringQuery.keyword, $options: 'i' } },
        { semester: { $regex: this.stringQuery.keyword, $options: 'i' } },
      ];
    }
    this.mongooseQuery = this.mongooseQuery.find(keyword);
    return this;
  }
  sort() {
    if (this.stringQuery.sort) {
      this.mongooseQuery = this.mongooseQuery.sort(this.stringQuery.sort);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }
  filter() {
    const queryObject = { ...this.stringQuery };
    const exludeFields = ['page', 'fields', 'limit', 'sort'];
    exludeFields.forEach((field) => delete queryObject[field]);
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
}

export default AppFeatures;
