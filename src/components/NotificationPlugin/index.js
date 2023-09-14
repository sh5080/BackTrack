import Notifications from "./Notifications.vue";
import { createApp, ref } from "vue";

const NotificationStore = {
  state: ref([]), // ref로 감싸줍니다.
  settings: {
    overlap: false,
    verticalAlign: "top",
    horizontalAlign: "right",
    type: "info",
    timeout: 5000,
    closeOnClick: true,
    showClose: true,
  },
  setOptions(options) {
    this.settings = Object.assign(this.settings, options);
  },
  removeNotification(timestamp) {
    const indexToDelete = this.state.value.findIndex(
      (n) => n.timestamp === timestamp
    );
    if (indexToDelete !== -1) {
      this.state.value.splice(indexToDelete, 1);
    }
  },
  addNotification(notification) {
    if (typeof notification === "string" || notification instanceof String) {
      notification = { message: notification };
    }
    notification.timestamp = new Date();
    notification.timestamp.setMilliseconds(
      notification.timestamp.getMilliseconds() + this.state.value.length
    );
    notification = Object.assign({}, this.settings, notification);
    this.state.value.push(notification);
  },
  notify(notification) {
    if (Array.isArray(notification)) {
      notification.forEach((notificationInstance) => {
        this.addNotification(notificationInstance);
      });
    } else {
      this.addNotification(notification);
    }
  },
};

const NotificationsPlugin = {
  install(app, options) {
    let vm = createApp({
      data() {
        return {
          notificationStore: NotificationStore,
        };
      },
      methods: {
        notify(notification) {
          this.notificationStore.notify(notification);
        },
      },
    });

    app.config.globalProperties.$notify = vm.notify;
    app.config.globalProperties.$notifications = vm.notificationStore;

    app.component("Notifications", Notifications);

    if (options) {
      NotificationStore.setOptions(options);
    }
  },
};

export default NotificationsPlugin;
