import { bindable } from 'aurelia';


export class HeaderComponent {
  @bindable logo = new URL('../../assets/images/default.jpg', import.meta.url).href;

  attached() {
    this.updateNotificationCount();
  }

  toggleNotifications(event) {
    const toggle = event.target;
    const systemNotifications = document.getElementById("systemNotifications");
    
    if (systemNotifications) {
      systemNotifications.style.display = toggle.checked ? "block" : "none";
    }
    this.updateNotificationCount();
  }

  markAllAsRead() {
    const badge = document.querySelector(".notification-badge");
    if (badge) {
      badge.style.display = "none";
    }
  }

  updateNotificationCount() {
    const badge = document.querySelector(".notification-badge");
    if (!badge) return;

    let count = document.querySelectorAll(".notification-item").length;
    const toggle = document.getElementById("systemNotificationsToggle");

    if (toggle && !toggle.checked) {
      const systemNotificationCount = document.querySelectorAll("#systemNotifications .notification-item").length;
      count -= systemNotificationCount;
    }

    badge.textContent = count.toString();
    badge.style.display = count === 0 ? "none" : "block";
  }
  goToNotifications() {
    this.router.navigateToRoute('notifications');
  }
}
