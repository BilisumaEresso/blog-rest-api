const { removeListener } = require("../app");
const cloudinary = require("../config/cloudinary");
const { errorHandler } = require("../middlewares");
const { Post, User, Category, File } = require("../models");

const addPost = async (req, res, next) => {
  try {
    const { title, desc, category, file } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("user not found");
    }
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      res.code = 404;
      throw new Error("category not found");
    }
    const newPost = new Post({
      title: title,
      desc: desc,
      file: file,
      category: categoryExist._id,
      updatedBy: user._id,
    });
    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate([
      { path: "category" },
      { path: "file" },
      {
        path: "updatedBy",
        select: "-password -verificationCode -forgotPasswordCode",
      },
    ]);
    res.status(201).json({
      code: 201,
      status: true,
      message: "post added successfully",
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};
const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, desc, file, category } = req.body;
    const { _id } = req.user;
    const post = await Post.findById(postId);
    if (!post) {
      res.code = 404;
      throw new Error("post is not found");
    }
    if (String(post.updatedBy) !== String(_id)) {
      res.code = 400;
      throw new Error("not authorized");
    }
    if (file) {
      const fileExist = await File.findById(file);
      if (!fileExist) {
        res.code = 400;
        throw new Error("file not found");
      }
    }
    if (category) {
      const categoryExist = await Category.findById(category);
      if (!categoryExist) {
        res.code = 400;
        throw new Error("category not found");
      }
    }
    post.title = title ? title : post.title;
    post.desc = desc ? title : post.desc;
    post.file = file ? file : post.file;
    post.category = category ? category : post.category;
    await post.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { _id } = req.user;
    const post = await Post.findById(postId);
    if (!post) {
      res.code = 404;
      throw new Error("post is not found");
    }
    if (req.user.user !== 1) {
      if (String(post.updatedBy) !== String(_id)) {
        res.code = 400;
        throw new Error("unauthorized");
      }
    }
    if (post.file) {
      await cloudinary.uploader.destroy(post.file, { invalidate: true });
    }
    await post.deleteOne();
    res.status(200).json({
      code: 200,
      status: true,
      message: "post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
const detailPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate([
      { path: "file" },
      { path: "category" },
      {
        path: "updatedBy",
        select: "-password -verificationCode -forgotPasswordCode",
      },
    ]);
    if (!post) {
      res.code = 404;
      throw new Error("post not found");
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "got post successfully ",
      data: {post:post},
    });
  } catch (error) {
    next(error);
  }
};
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;
    const category = req.query.category;
    const q = req.query.q;

    // Build filter object
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (q) {
      const search = new RegExp(q, "i");
      filter.$or = [{ title: search }, { desc: search }];
    }

    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .skip(skip)
      .limit(size)
      .populate([
        { path: "file" },
        { path: "category" },
        {
          path: "updatedBy",
          select: "-password -verificationCode -forgotPasswordCode",
        },
      ])
      .sort({ createdAt: -1 });

    res.status(200).json({
      code: 200,
      status: true,
      message: "posts fetched successfully",
      data: {
        posts,
        total,
        page,
        size,
        pages: Math.ceil(total / size),
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { addPost, updatePost, deletePost, detailPost, getPosts };
