import { Welcome } from './views/welcome/welcome';
import { AllNotificationPage } from './views/all-notification-page/all-notification-page';
export class MyApp {
    static routes = [
        {
          path: '',
          component: Welcome
        },
        {
          path: 'all-notifications',
          component: AllNotificationPage
        }
      ];
}
