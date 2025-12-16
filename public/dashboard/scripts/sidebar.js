/**
 * Sidebar Navigation JavaScript
 * Handles sidebar toggle, accordion behavior, view switching, and breadcrumb updates
 */

(function () {
    'use strict';

    // State
    let currentView = 'light_cells';
    let sidebarOpen = window.innerWidth >= 1024; // Open by default on desktop

    /**
     * Initialize sidebar functionality
     */
    function initSidebar() {
        setupSidebarToggle();
        setupAccordions();
        setupViewSwitching();
        setupBackdrop();
        setupResponsive();

        // Set initial view
        switchView('light_cells', 'Dashboard', 'Light Cells');
    }

    /**
     * Setup sidebar toggle button
     */
    function setupSidebarToggle() {
        const toggleBtn = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', function () {
                toggleSidebar();
            });
        }
    }

    /**
     * Toggle sidebar open/closed
     */
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');

        if (sidebar) {
            sidebarOpen = !sidebarOpen;

            if (sidebarOpen) {
                sidebar.classList.remove('collapsed');
                sidebar.classList.add('open');
                if (backdrop) backdrop.classList.add('active');
            } else {
                sidebar.classList.add('collapsed');
                sidebar.classList.remove('open');
                if (backdrop) backdrop.classList.remove('active');
            }
        }
    }

    /**
     * Setup accordion behavior for navigation groups
     */
    function setupAccordions() {
        const groupHeaders = document.querySelectorAll('.nav-group-header');

        groupHeaders.forEach(header => {
            header.addEventListener('click', function () {
                const group = this.closest('.nav-group');
                const isExpanded = group.classList.contains('expanded');

                // Close all other groups (optional - remove for multiple open groups)
                // document.querySelectorAll('.nav-group').forEach(g => {
                //     if (g !== group) g.classList.remove('expanded');
                // });

                // Toggle current group
                if (isExpanded) {
                    group.classList.remove('expanded');
                } else {
                    group.classList.add('expanded');
                }
            });
        });
    }

    /**
     * Setup view switching for navigation items
     */
    function setupViewSwitching() {
        const navItems = document.querySelectorAll('[data-view]');

        navItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();

                const viewId = this.getAttribute('data-view');
                const category = this.getAttribute('data-category') || 'Dashboard';
                const viewName = this.textContent.trim();

                switchView(viewId, category, viewName);

                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) {
                    toggleSidebar();
                }
            });
        });
    }

    /**
     * Switch to a different view
     * @param {string} viewId - ID of the view to show
     * @param {string} category - Category name for breadcrumb
     * @param {string} viewName - View name for breadcrumb
     */
    function switchView(viewId, category, viewName) {
        // Hide all views
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });

        // Show selected view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.style.display = 'block';
            targetView.classList.add('active');
        }

        // Update active nav item
        document.querySelectorAll('[data-view]').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`[data-view="${viewId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');

            // Expand parent group if item is in a collapsed group
            const parentGroup = activeItem.closest('.nav-group');
            if (parentGroup) {
                parentGroup.classList.add('expanded');
            }
        }

        // Update breadcrumb
        updateBreadcrumb(category, viewName);

        // Update current view
        currentView = viewId;

        // Trigger any view-specific initialization
        initializeView(viewId);
    }

    /**
     * Update breadcrumb navigation
     * @param {string} category - Category name
     * @param {string} viewName - View name
     */
    function updateBreadcrumb(category, viewName) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `
                <span>${category}</span>
                <span class="breadcrumb-separator">›</span>
                <span>${viewName}</span>
            `;
        }
    }

    /**
     * Initialize view-specific functionality
     * @param {string} viewId - ID of the view
     */
    function initializeView(viewId) {
        // Call chart initialization functions based on view
        // This matches the logic from the original tabs.js openTab function
        switch (viewId) {
            case 'light_radar':
                if (typeof drawRadarChart === 'function') {
                    drawRadarChart("radar-chart");
                }
                break;

            case 'light_treemap':
                if (typeof drawTreeMapChart === 'function') {
                    drawTreeMapChart("treemap-chart");
                }
                break;

            case 'memorization_chart_tab':
                if (typeof drawMemorizationPieChart === 'function') {
                    drawMemorizationPieChart();
                }
                // Also update gauges if scores are available
                if (typeof scores !== 'undefined' && !isNaN(scores["today_review"])) {
                    setTimeout(function () {
                        if (typeof updateGuageChart === 'function') {
                            if (typeof get_review_werd === 'function' && typeof format === 'function') {
                                updateGuageChart("review_score_guage",
                                    "Today Review Revenue [" + format(scores["today_review"]) + " of Target " + format(get_review_werd()) + "]",
                                    100 * Number(scores["today_review"]) / get_review_werd());
                            }
                            if (typeof get_read_werd === 'function' && typeof get_today_read === 'function') {
                                updateGuageChart("daily-read-guage",
                                    "Today Read Revenue [" + format(scores["today_read"]) + " of Target " + format(get_read_werd()) + "]",
                                    100 * get_today_read() / get_read_werd());
                            }
                        }
                    }, 2000);
                }
                break;

            case 'review_guage':
                if (typeof updateGuageChart === 'function' && typeof scores !== 'undefined') {
                    if (typeof get_review_werd === 'function' && typeof format === 'function') {
                        updateGuageChart("review_score_guage",
                            "Today Review Revenue [" + format(scores["today_review"]) + " of Target " + format(get_review_werd()) + "]",
                            100 * Number(scores["today_review"]) / get_review_werd());
                    }
                }
                break;

            case 'daily_read_guage':
                if (typeof updateGuageChart === 'function' && typeof scores !== 'undefined') {
                    if (typeof get_read_werd === 'function' && typeof get_today_read === 'function' && typeof format === 'function') {
                        updateGuageChart("daily-read-guage",
                            "Today Read Revenue [" + format(scores["today_read"]) + " of Target " + format(get_read_werd()) + "]",
                            100 * get_today_read() / get_read_werd());
                    }
                }
                break;

            case 'light_ratio_chart_tab':
                if (typeof updateGuageChart === 'function' && typeof lightRatio !== 'undefined') {
                    updateGuageChart("light-ratio-chart-container", "Light Ratio", lightRatio);
                }
                break;

            case 'conquer_ratio_chart_tab':
                if (typeof updateGuageChart === 'function' && typeof conquerRatio !== 'undefined') {
                    updateGuageChart("conquer-ratio-chart-container", "Conquer Ratio", conquerRatio);
                }
                break;

            case 'khatma_progress_tab':
                if (typeof drawKhatmaPieChart === 'function') {
                    drawKhatmaPieChart();
                }
                break;

            case 'daily_score_chart_tab':
                if (typeof drawTimeSeriesChart === 'function' && typeof DAILY_SCORE_MODE !== 'undefined') {
                    drawTimeSeriesChart("daily-score-chart", DAILY_SCORE_MODE);
                }
                break;

            case 'monthly_score_chart_tab':
                if (typeof drawTimeSeriesChart === 'function' && typeof MONTHLY_SCORE_MODE !== 'undefined') {
                    drawTimeSeriesChart("monthly-score-chart", MONTHLY_SCORE_MODE);
                }
                break;

            case 'yearly_score_chart_tab':
                if (typeof drawTimeSeriesChart === 'function' && typeof YEARLY_SCORE_MODE !== 'undefined') {
                    drawTimeSeriesChart("yearly-score-chart", YEARLY_SCORE_MODE);
                }
                break;

            case 'light_days_chart_tab':
                if (typeof drawTimeSeriesChart === 'function' && typeof LIGHT_DAYS_MODE !== 'undefined') {
                    drawTimeSeriesChart("light_days_chart", LIGHT_DAYS_MODE);
                }
                break;

            case 'dark_days_chart_tab':
                if (typeof drawTimeSeriesChart === 'function' && typeof LIGHT_DAYS_MODE !== 'undefined') {
                    drawTimeSeriesChart("dark_days_chart", LIGHT_DAYS_MODE);
                }
                break;

            case 'sura_score_chart_tab':
                if (typeof drawTimeSeriesChart === 'function' && typeof REFRESH_COUNT_TIME_SCORE_MODE !== 'undefined') {
                    drawTimeSeriesChart("sura-score-chart", REFRESH_COUNT_TIME_SCORE_MODE);
                }
                break;
        }
    }

    /**
     * Setup backdrop for mobile sidebar
     */
    function setupBackdrop() {
        const backdrop = document.getElementById('sidebar-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', function () {
                if (sidebarOpen && window.innerWidth < 1024) {
                    toggleSidebar();
                }
            });
        }
    }

    /**
     * Setup responsive behavior
     */
    function setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                const sidebar = document.getElementById('sidebar');
                const backdrop = document.getElementById('sidebar-backdrop');

                if (window.innerWidth >= 1024) {
                    // Desktop: sidebar always open
                    if (sidebar) {
                        sidebar.classList.remove('collapsed');
                        sidebar.classList.add('open');
                    }
                    if (backdrop) backdrop.classList.remove('active');
                    sidebarOpen = true;
                } else {
                    // Mobile/Tablet: sidebar closed by default
                    if (sidebar && !sidebarOpen) {
                        sidebar.classList.add('collapsed');
                        sidebar.classList.remove('open');
                    }
                }
            }, 250);
        });
    }

    /**
     * Keyboard shortcuts
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            // Ctrl/Cmd + B: Toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                toggleSidebar();
            }

            // Escape: Close sidebar on mobile
            if (e.key === 'Escape' && sidebarOpen && window.innerWidth < 1024) {
                toggleSidebar();
            }
        });
    }

    /**
     * Setup language switcher dropdown
     */
    var languageSwitcherInitialized = false;
    function setupLanguageSwitcher() {
        // Only initialize once
        if (languageSwitcherInitialized) return;
        languageSwitcherInitialized = true;

        console.log('Setting up language switcher...');

        // Use jQuery since it's already loaded
        $(document).on('click', '.navbar-actions .dropdown-toggle', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $dropdown = $('.navbar-actions .dropdown');
            console.log('Dropdown toggle clicked');
            console.log('Dropdown element found:', $dropdown.length);
            console.log('Has open class before toggle:', $dropdown.hasClass('open'));
            $dropdown.toggleClass('open');
            console.log('Has open class after toggle:', $dropdown.hasClass('open'));
        });

        $(document).on('click', '.language-dropdown a[data-lang]', function (e) {
            e.preventDefault();
            var lang = $(this).attr('data-lang');
            console.log('Language selected:', lang);

            // Change language
            if (window.i18n && window.i18n.changeLanguage) {
                window.i18n.changeLanguage(lang);
            }

            // Update display
            $('#current-lang').text($(this).text().trim());

            // Close dropdown and mark active
            $('.navbar-actions .dropdown').removeClass('open');
            $('.language-dropdown a[data-lang]').removeClass('active');
            $(this).addClass('active');
        });

        // Close dropdown when clicking outside
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.navbar-actions .dropdown').length) {
                $('.navbar-actions .dropdown').removeClass('open');
            }
        });

        // Set initial language
        setTimeout(function () {
            var currentLang = localStorage.getItem('preferredLanguage') || 'ar';
            var $activeLangLink = $('.language-dropdown a[data-lang="' + currentLang + '"]');
            if ($activeLangLink.length) {
                $activeLangLink.addClass('active');
                $('#current-lang').text($activeLangLink.text().trim());
            }
            console.log('Language switcher initialized');
        }, 100);
    }

    /**
     * Setup theme toggle
     */
    var themeToggleInitialized = false;
    function setupThemeToggle() {
        // Only initialize once
        if (themeToggleInitialized) return;
        themeToggleInitialized = true;

        console.log('Setting up theme toggle...');

        // Get current theme from localStorage or default to 'dark'
        var currentTheme = localStorage.getItem('theme') || 'dark';

        // Apply theme on load
        applyTheme(currentTheme);

        // Handle theme toggle click
        $('#theme-toggle').on('click', function () {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
            console.log('Theme switched to:', currentTheme);
        });

        console.log('Theme toggle initialized. Current theme:', currentTheme);
    }

    /**
     * Apply theme to the page
     */
    function applyTheme(theme) {
        var $body = $('body');
        var $themeToggle = $('#theme-toggle');

        if (theme === 'light') {
            $body.addClass('light-theme').removeClass('dark-theme');
            $themeToggle.text('🌙'); // Moon for light mode (click to go dark)
        } else {
            $body.addClass('dark-theme').removeClass('light-theme');
            $themeToggle.text('☀️'); // Sun for dark mode (click to go light)
        }
    }

    /**
     * Public API (for backward compatibility with existing code)
     */
    window.openTab = function (viewId) {
        // Map old tab IDs to new view IDs
        switchView(viewId, 'Dashboard', viewId);
    };

    window.switchView = switchView;
    window.toggleSidebar = toggleSidebar;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initSidebar();
            setupKeyboardShortcuts();
            setupLanguageSwitcher();
            setupThemeToggle();
        });
    } else {
        initSidebar();
        setupKeyboardShortcuts();
        setupLanguageSwitcher();
        setupThemeToggle();
    }

})();
