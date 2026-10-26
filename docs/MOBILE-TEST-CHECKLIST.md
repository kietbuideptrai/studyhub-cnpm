# Mobile Test Checklist

Run these checks on a physical Android or iOS device before the demo. Replace the status with `Pass`, `Fail`, or `Blocked`, and record the device/OS for failures.

| ID | Steps | Expected result | Status / notes |
| --- | --- | --- | --- |
| MOB-01 | Start the app in Expo Go and open the Artifacts tab. | Published artifacts load from the backend with title, summary, and image. | |
| MOB-02 | Search for a known artifact, then search for a phrase with no matches. | Matching results appear; an understandable empty state appears for no matches. | |
| MOB-03 | Open an artifact from the list. | Correct detail opens and the view is added to history. | |
| MOB-04 | Scan a valid QR containing `/artifacts/<slug>`. | The scanner opens the matching artifact detail. | |
| MOB-05 | Scan a QR that is not an HTTP(S) artifact URL. | The app reports an invalid QR and allows scanning again. | |
| MOB-06 | Scan a valid-format URL with an unknown slug. | A not-found message appears without crashing. | |
| MOB-07 | Deny camera permission, then grant it; repeat with permission permanently denied. | The app explains the permission requirement and offers request permission or device settings as appropriate. | |
| MOB-08 | Turn off network access, load the list/detail, then restore it and tap Retry. | A clear network error and retry action appear; retry succeeds after connectivity returns. | |
| MOB-09 | Change languages on the detail screen, including one without a translation. | Available translation updates; missing translation lists available languages and text remains usable. | |
| MOB-10 | Restart the app after choosing a language. | The chosen language remains selected. | |
| MOB-11 | Play narration, pause, resume, and stop; change language or leave the detail screen during playback. | Controls work; audio stops on language change or screen exit; text remains visible if the voice is unavailable. | |
| MOB-12 | Add an artifact to Favorites, open the Favorites tab, restart the app, then remove it. | Favorite appears, persists across restart, opens the correct detail, and can be removed. | |
| MOB-13 | Open more than 20 different details and visit one of them again. | History is newest-first, contains no duplicate slug, and retains at most 20 items. | |
| MOB-14 | Change text size to Small, then Large; reopen a detail and restart the app. | Detail title, summary, and body reflect the selected size and the preference persists. | |
| MOB-15 | Open artifacts with and without images and inspect accessibility labels with the device screen reader. | Images expose an appropriate accessibility label; missing/failed images do not break the detail screen. | |