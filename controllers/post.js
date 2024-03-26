const User = require("../models/user");
const Post = require("../models/post");
const { response } = require("express");

exports.createPost = async (req, res) => {
  console.log("req.file : " , req.file)
  try {
    const { subject, description } = req.body;
    const image = req.file.filename
    const user = await User.findOne(req.user._id);
    const newPost = new Post({ ...req.body, author: user._id , image });
    await newPost.save();
    user.posts.push(newPost._id);
    user.save();
    return res
      .status(200)
      .send({ msg: "Post is created with success", response: newPost });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Server error" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 })
      .populate("author", "name lastName")
      .exec();
    if (!posts) {
      return res.status(200).send({ msg: "No posts" });
    } else {
      return res
        .status(200)
        .send({ msg: "Posts is rendred with success", response: posts });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    if (!posts) {
      return res.status(200).send({ msg: "No posts" });
    } else {
      return res
        .status(200)
        .send({ msg: "Posts is rendred with success", response: posts });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Server error" });
  }
};

//get user
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const numComments = post.comments.length;
  return res
    .status(200)
    .send({ msg: "post founded", Comments: numComments, response: post });
};

//delete post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.deleteOne({ _id: id });
    return res.status(200).send({ msg: "Post deleted" });
  } catch (error) {
    console.log(error);
  }
};

//update post
exports.updatePost = async (req, res) => {
  console.log(req.body)
  const { id } = req.params;
  const post = await Post.updateOne({ _id: id }, { ...req.body });
  return res.status(200).send({ msg: "Post updated" });
};

//like post
exports.likePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (post.likes.includes(req.user._id)) {
    post.likes.pop(req.user._id);
    await post.save();
    return res
      .status(200)
      .send({ msg: "post disliked", response: post.likes.length });
  }
  if (!post.likes.includes(req.user._id)) {
    post.likes.push(req.user._id);
    await post.save();
    return res
      .status(200)
      .send({ msg: "post liked", response: post.likes.length });
  }
};
// else{
//      post.likes.pop(req.body._id)
//      return res.status(200).send({msg:'like removed'});

// }
// return res.status(200).send({msg:'post founded',response: post});

// const {id} = req.params
// const post = await Post.updateOne({_id:id}, {...req.body})
// return res.status(200).send({msg:'Post updated'});

// create post comment

exports.createPostComment = async (req, res) => {
  // console.log("REQ ;; ",req);
  // console.log("start")
  const { comment } = req.body;
  const post = await Post.findById(req.params.id);
  // if (post) {
  //     const alreadyCommented = post.comments.find(
  //       (r) => r.author.toString() === req.user._id.toString()
  //     )

  //     if (alreadyCommented) {
  //       res.status(400).json('Post already commented')
  //     }
  const newComment = {
    comment,
    author: req.user._id,
  };
  post.comments.push(newComment);
  post.numComments = post.comments.length;
  await post.save();
  res.status(201).json({ message: "Review added" });
};

exports.getTopPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ likes: -1 }).limit(5)
  .populate("author likes comments.author", "name lastName")
  .exec();
  return res
      .status(200)
      .send({ msg: "post liked", response: posts });
}

//get timeline posts
exports.getFollowingPosts= async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const userPosts = await Post.find({ author: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ author: friendId }).sort({ createdAt: -1 })
        .populate("author", "name lastName image")
        .exec();
      })
    );
    res.json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err);
  }
}

//save post
exports.savePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const user = await User.findById(req.user._id)

  if (user.bookmarks.includes(post._id)) {
    user.bookmarks.pop(post._id);
    await user.save();
    return res
      .status(200)
      .send({ msg: "post unsaved", response: user.bookmarks});
  }
  if (!user.bookmarks.includes(post._id)) {
    user.bookmarks.push(post._id);
    await user.save();
    return res
      .status(200)
      .send({ msg: "post save"});
  }
};


exports.getBookmarkedPosts = async (req, res) => {
  try {
    

    const currentUser = await User.findById(req.user._id);
    const bookmarksPosts = await Promise.all(
      currentUser.bookmarks.map((postId) => {
        return Post.find({ _id: postId }).sort({ createdAt: -1 })
        .populate("author subject description", "name lastName")
        .exec();


      })
    );
    res.status(200).send({ msg: "Success", response: bookmarksPosts });

    
    // const user = req.user
    // return res.status(200).send({ msg: "Bookmarked", response: user.bookmarks});

     
   
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Server error" });
  }
};