const router = require("express").Router();
const Course = require("../models").courseModel;
const User = require("../models").userModel;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("A request. is coming in to course-route.js");
  next();
});

router.get("/", (req, res) => {
  Course.find({})
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      rex.status(500).send("Error!!, Cannot get course!!");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post("/", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, description, price } = req.body;
  //console.log(req.user._id);
  if (req.user.isStudent()) {
    return res.status(400).send("Only instructor can post a new course.");
  }

  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });

  try {
    await newCourse.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save course.");
  }
});

router.patch("/:_id", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course not found.",
    });
  }

  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send({ sucess: true, message: "Course updated." });
      })
      .catch((e) => {
        res.send({
          success: false,
          message: "Course not found.",
        });
      });
  } else {
    res.status(403);
    return res.json({
      succss: false,
      message:
        "Only the instructor of this course or administor can edit this course.",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course not found.",
    });
  }

  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send({ sucess: true, message: "Course deleted." });
      })
      .catch((e) => {
        res.send({
          success: false,
          message: "Course not found.",
        });
      });
  } else {
    res.status(403);
    return res.json({
      succss: false,
      message:
        "Only the instructor of this course or administor can delete this course.",
    });
  }
});

module.exports = router;
