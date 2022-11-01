import { getAppDetails } from './getAppDetails';
import { waitForAppDetails } from './waitForAppDetails';

/**
 * Tries to change the shortcut name for the app id.
 * 
 * @remarks
 * At the moment changing the name results in a strange behaviour (checked on 2022-10-29).
 * 
 * The game can be launched, but not terminated. Also the SteamDeck
 * will not focus the shortcut with the changed name. The only usecase
 * right now is changing the name after the app is already launched.
 * 
 * The reason could be that in the past the app name was (maybe still is) used to generate
 * the app id and changing the name now via the API results in some mismatch.
 * 
 * @param appId app id to change the shortcut name for.
 * @param value new value to be set.
 * @returns True if the shortcut name was changed (or already matches), false otherwise.
 */
export async function setShortcutName(appId: number, value: string): Promise<boolean> {
  const details = await waitForAppDetails(appId, (details) => details !== null) ? await getAppDetails(appId) : null;
  if (details == null) {
    console.log(`Could not set shortcut name for ${appId} - does not exist!`);
    return false;
  }

  if (details.strDisplayName === value) {
    return true;
  }

  try {
    SteamClient.Apps.SetShortcutName(appId, value);
    if (!await waitForAppDetails(appId, (details) => details !== null && details.strDisplayName === value)) {
      console.log(`Could not set shortcut name for ${appId}!`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}