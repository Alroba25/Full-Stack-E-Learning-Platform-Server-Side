const Notification = require("../Models/notification");
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
