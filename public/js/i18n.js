/**
 * i18n.js - Internationalization Module for Quran Lights
 * Supports 10 languages with RTL/LTR handling
 * 
 * Languages: ar, en, es, fr, de, zh, hi, pt, ur, ja
 */

(function () {
    'use strict';

    // Configuration
    const SUPPORTED_LANGUAGES = {
        'ar': { name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
        'en': { name: 'English', dir: 'ltr', flag: '🇬🇧' },
        'es': { name: 'Español', dir: 'ltr', flag: '🇪🇸' },
        'fr': { name: 'Français', dir: 'ltr', flag: '🇫🇷' },
        'de': { name: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
        'zh': { name: '中文', dir: 'ltr', flag: '🇨🇳' },
        'hi': { name: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
        'pt': { name: 'Português', dir: 'ltr', flag: '🇧🇷' },
        'ur': { name: 'اردو', dir: 'rtl', flag: '🇵🇰' },
        'ja': { name: '日本語', dir: 'ltr', flag: '🇯🇵' }
    };

    const DEFAULT_LANGUAGE = 'ar';
    const STORAGE_KEY = 'quran_lights_language';

    // State
    let currentLanguage = DEFAULT_LANGUAGE;
    let translations = {};

    /**
     * Initialize i18n system
     */
    function init() {
        // Detect and load language
        const savedLang = localStorage.getItem(STORAGE_KEY);
        const browserLang = detectBrowserLanguage();
        const initialLang = savedLang || browserLang || DEFAULT_LANGUAGE;

        loadLanguage(initialLang);
    }

    /**
     * Detect browser language
     */
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get 'en' from 'en-US'

        return SUPPORTED_LANGUAGES[langCode] ? langCode : null;
    }

    /**
     * Load language file and apply translations
     */
    function loadLanguage(lang) {
        if (!SUPPORTED_LANGUAGES[lang]) {
            console.warn(`Language ${lang} not supported, falling back to ${DEFAULT_LANGUAGE}`);
            lang = DEFAULT_LANGUAGE;
        }

        currentLanguage = lang;

        // Fetch translation file
        fetch(`locales/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load language file: ${lang}.json`);
                }
                return response.json();
            })
            .then(data => {
                translations = data;
                applyTranslations();
                updateDirection();
                updateMetaTags();
                updateCurrentLanguageDisplay();
                localStorage.setItem(STORAGE_KEY, lang);
            })
            .catch(error => {
                console.error('Error loading language:', error);
                if (lang !== DEFAULT_LANGUAGE) {
                    loadLanguage(DEFAULT_LANGUAGE);
                }
            });
    }

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    function applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getNestedTranslation(key);

            if (translation) {
                // Check if element has data-i18n-attr for attribute translation
                const attr = element.getAttribute('data-i18n-attr');
                if (attr) {
                    element.setAttribute(attr, translation);
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    /**
     * Get nested translation from key like "nav.home"
     */
    function getNestedTranslation(key) {
        const keys = key.split('.');
        let value = translations;

        for (let k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return null;
            }
        }

        return value;
    }

    /**
     * Update HTML direction (RTL/LTR)
     */
    function updateDirection() {
        const dir = SUPPORTED_LANGUAGES[currentLanguage].dir;
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', currentLanguage);

        // Add transition class for smooth direction change
        document.body.classList.add('lang-transition');
        setTimeout(() => {
            document.body.classList.remove('lang-transition');
        }, 300);
    }

    /**
     * Update meta tags for SEO
     */
    function updateMetaTags() {
        if (!translations.meta) return;

        // Update title
        if (translations.meta.title) {
            document.title = translations.meta.title;
        }

        // Update description
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta && translations.meta.description) {
            descMeta.setAttribute('content', translations.meta.description);
        }

        // Update keywords
        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (keywordsMeta && translations.meta.keywords) {
            keywordsMeta.setAttribute('content', translations.meta.keywords);
        }
    }

    /**
     * Update current language display in navbar
     */
    function updateCurrentLanguageDisplay() {
        const currentLangElement = document.getElementById('current-lang');
        if (currentLangElement) {
            currentLangElement.textContent = SUPPORTED_LANGUAGES[currentLanguage].name;
        }

        // Update active state in dropdown
        const langLinks = document.querySelectorAll('[data-lang]');
        langLinks.forEach(link => {
            const linkLang = link.getAttribute('data-lang');
            if (linkLang === currentLanguage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Switch to a different language
     */
    function switchLanguage(lang) {
        if (lang === currentLanguage) return;
        loadLanguage(lang);
    }

    /**
     * Get current language
     */
    function getCurrentLanguage() {
        return currentLanguage;
    }

    /**
     * Get all supported languages
     */
    function getSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }

    /**
     * Setup language switcher event listeners
     */
    function setupLanguageSwitcher() {
        const langLinks = document.querySelectorAll('[data-lang]');

        langLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                switchLanguage(lang);

                // Close dropdown after selection (Bootstrap)
                const dropdown = this.closest('.dropdown');
                if (dropdown) {
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    if (toggle && typeof $(toggle).dropdown === 'function') {
                        $(toggle).dropdown('toggle');
                    }
                }
            });
        });
    }

    // Public API
    window.i18n = {
        init: init,
        switchLanguage: switchLanguage,
        getCurrentLanguage: getCurrentLanguage,
        getSupportedLanguages: getSupportedLanguages,
        setupLanguageSwitcher: setupLanguageSwitcher,
        getTranslation: getNestedTranslation
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            init();
            setupLanguageSwitcher();
        });
    } else {
        init();
        setupLanguageSwitcher();
    }

})();

