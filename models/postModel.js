const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true
    },
    resources: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'resources',
      required: true
    },
    isAnonymous: {
      type: Boolean,
      required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  if (!isAnonymous){
    this.populate({
      path: 'author',
      select: 'name avatar'
    });
    next();
  }
  
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
