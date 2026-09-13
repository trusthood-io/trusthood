import { render } from '@testing-library/react';
import { AppStoreProvider } from '../store/app-store';
import { APP_STORAGE_KEY } from '../store/state';

export function renderWithStore(ui, { persistedState } = {}) {
  if (persistedState && typeof window !== 'undefined') {
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(persistedState));
  }

  return render(<AppStoreProvider>{ui}</AppStoreProvider>);
}
