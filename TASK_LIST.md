# Project Task List

This file contains the prioritized, actionable TODOs for the Quran Lights Web project. Reload this file after a crash or chat reset to restore context.

---

1. [setup-automated-testing] Set up automated testing: Add Jest for unit tests and Playwright for E2E tests, write initial tests for JS modules, and add test scripts to package.json. (in progress)
2. [modularize-js-css] Modularize JS and CSS: Split large JS files into ES6 modules, move inline scripts to separate files, and modularize CSS by feature/section. (pending, depends on 1)
3. [migrate-to-cdn] Migrate to CDN for all 3rd-party libraries: Replace local Bootstrap, jQuery, FontAwesome, etc. with CDN links and remove unused libraries. (pending, depends on 1)
4. [setup-build-system] Set up a modern build system: Add Parcel, Vite, or Webpack for asset bundling, minification, and cache busting. Update HTML to reference built assets. (pending, depends on 2,3)
5. [reimplement-pwa] Re-implement PWA features: Restore and improve manifest.json and sw.js, add meta tags for PWA installability, and test offline support. (pending, depends on 4)
6. [refactor-html-accessibility-mobile] Refactor HTML for accessibility and mobile UX: Improve ARIA roles, alt text, semantic markup, and navigation for mobile. (pending, depends on 4)
7. [optimize-images-lazyload] Optimize images and add lazy loading: Compress images, serve in modern formats, and add loading="lazy" to all images. (pending, depends on 4)
8. [add-linting-formatting] Add linting and formatting: Add ESLint, Stylelint, and Prettier, and add lint scripts to package.json. (pending, depends on 4)
9. [setup-cicd] Set up CI/CD: Add GitHub Actions or similar for test/build/deploy automation. (pending, depends on 8)
10. [secure-auth-data] Secure auth and sensitive data: Review and secure all uses of localStorage, remove secrets from client-side code, and add CSP/security headers. (pending, depends on 9)
11. [cleanup-document] Clean up and document: Remove unused files, add README sections for setup/testing/deployment, and document modular structure. (pending, depends on 10) 

- [x] Create modular Firebase config files for prod, test, staging, dev (public/js/firebase.config.*.js)
- [x] Create loader (public/js/firebase.config.js) to select config based on window.FIREBASE_ENV (defaults to prod). Add crash recovery notes.
- [x] Create Firebase initialization (public/js/firebase-init.js) that guards against duplicate initialization. Add crash recovery notes. 
- [x] Integrate modular Firebase initialization into all entry HTML files (dashboard, login, signup, etc.)
- [x] Remove legacy Firebase v4 scripts and config from HTML and JS files
- [x] Update js/constants.js and js/config.js to reference new modular initialization
- [ ] Set up Playwright E2E tests for sign in and sign up (with dashboard verification), using the test Firebase project 