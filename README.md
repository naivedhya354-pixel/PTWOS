# PTWOS – PanchTatva Wellness & Organic Solutions

Single-file prototype (`index.html`) of the PanchTatva mobile app: Disease & Wellness + Organic Products store, doctor appointments, diet consultation, cart/orders, customer login, and branch-wise staff logins.

## Run
Open `index.html` in a browser. No build step. Data is kept in browser `localStorage` (prototype only).

## Demo staff logins (change before going live)
| ID | Password | Access |
|---|---|---|
| owner | owner@123 | All branches |
| gkp_head | gkp@123 | Gorakhpur |
| lko_head | lko@123 | Lucknow |

## Next steps
- [ ] Connect Firebase Auth (replace demo login) and Firestore (replace `save()` / load)
- [ ] Firestore Security Rules for branch-wise access
- [ ] Real OTP, payment gateway, video consultation
- [ ] Review health claims and food labels (FSSAI), DPDP compliance
- [ ] Wrap with Capacitor for Android / iOS

## Notes
Never commit Firebase admin keys or real passwords to this repo.
