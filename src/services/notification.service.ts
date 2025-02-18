import { Notification } from '../models/notification.model';
import { User } from '../models/user.model';

export class NotificationService {
  // 创建系统通知
  async createSystemNotification(params: {
    recipientId: string;
    title: string;
    content: string;
    resourceId?: string;
  }) {
    const notification = new Notification({
      recipient: params.recipientId,
      type: 'system',
      title: params.title,
      content: params.content,
      resourceId: params.resourceId
    });

    await notification.save();
    return notification;
  }

  // 创建帖子相关通知
  async createPostNotification(params: {
    recipientId: string;
    senderId: string;
    title: string;
    content: string;
    postId: string;
  }) {
    const notification = new Notification({
      recipient: params.recipientId,
      sender: params.senderId,
      type: 'post',
      title: params.title,
      content: params.content,
      resourceId: params.postId
    });

    await notification.save();
    return notification;
  }

  // 批量创建通知
  async createBatchNotifications(params: {
    recipientIds: string[];
    title: string;
    content: string;
    type: 'system' | 'post' | 'comment';
    senderId?: string;
    resourceId?: string;
  }) {
    const notifications = params.recipientIds.map(recipientId => ({
      recipient: recipientId,
      sender: params.senderId,
      type: params.type,
      title: params.title,
      content: params.content,
      resourceId: params.resourceId
    }));

    await Notification.insertMany(notifications);
  }

  // 标记通知为已读
  async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: userId
      },
      { isRead: true },
      { new: true }
    );

    return notification;
  }

  // 标记所有通知为已读
  async markAllAsRead(userId: string) {
    await Notification.updateMany(
      {
        recipient: userId,
        isRead: false
      },
      { isRead: true }
    );
  }

  // 获取用户未读通知数量
  async getUnreadCount(userId: string) {
    return Notification.countDocuments({
      recipient: userId,
      isRead: false
    });
  }
} 