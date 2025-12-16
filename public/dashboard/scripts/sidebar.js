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
        // Call existing initialization functions based on view
        switch (viewId) {
            case 'light_treemap':
                if (typeof init_treemap === 'function') init_treemap();
                break;
            case 'light_radar':
                if (typeof init_radar === 'function') init_radar();
                break;
            case 'daily_score_chart_tab':
                if (typeof init_daily_score_chart === 'function') init_daily_score_chart();
                break;
            case 'monthly_score_chart_tab':
                if (typeof init_monthly_score_chart === 'function') init_monthly_score_chart();
                break;
            case 'yearly_score_chart_tab':
                if (typeof init_yearly_score_chart === 'function') init_yearly_score_chart();
                break;
            case 'review_guage':
                if (typeof init_review_guage === 'function') init_review_guage();
                break;
            case 'daily_read_guage':
                if (typeof init_daily_read_guage === 'function') init_daily_read_guage();
                break;
            case 'memorization_chart_tab':
                if (typeof init_memorization_chart === 'function') init_memorization_chart();
                break;
            case 'light_ratio_chart_tab':
                if (typeof init_light_ratio_chart === 'function') init_light_ratio_chart();
                break;
            case 'conquer_ratio_chart_tab':
                if (typeof init_conquer_ratio_chart === 'function') init_conquer_ratio_chart();
                break;
            case 'khatma_progress_tab':
                if (typeof init_khatma_progress === 'function') init_khatma_progress();
                break;
            case 'sura_score_chart_tab':
                if (typeof init_sura_score_chart === 'function') init_sura_score_chart();
                break;
            case 'light_days_chart_tab':
                if (typeof init_light_days_chart === 'function') init_light_days_chart();
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
        });
    } else {
        initSidebar();
        setupKeyboardShortcuts();
    }

})();
