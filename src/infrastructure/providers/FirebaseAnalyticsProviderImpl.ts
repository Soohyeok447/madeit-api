import { FirebaseAnalyticsProvider } from '../../domain/providers/FirebaseAnalyticsProvider';
import { initializeApp, FirebaseApp } from '@firebase/app';
import { Analytics, getAnalytics, logEvent } from '@firebase/analytics';

export class FirebaseAnalyticsProviderImpl
  implements FirebaseAnalyticsProvider
{
  public async getInstallationCount(): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/typedef
    const firebaseConfig = {
      apiKey: `${process.env.GOOGLE_API_KEY_FIREBASE}`,
      authDomain: `${process.env.GOOGLE_PROJECT_ID}.firebaseapp.com`,
      projectId: `${process.env.GOOGLE_PROJECT_ID}`,
      messagingSenderId: `${process.env.GOOGLE_FIREBASE_MESSAGINGSENDER_ID}`,
      appId: `${process.env.GOOGLE_FIREBASE_ANDROID_APP_ID}`,
    };

    // Initialize Firebase
    const app: FirebaseApp = initializeApp(firebaseConfig);

    // Initialize Analytics and get a reference to the service
    const analytics: Analytics = getAnalytics(app);

    logEvent(analytics, 'first_open');

    return;
  }
}
